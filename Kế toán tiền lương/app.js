/**
 * VNDC HRMS - Final Optimized Logic (Bug-Free Sweep)
 */
const STORAGE = { EMP: 'vndc_employees', EXP: 'vndc_payroll_expenses', LEAVE: 'vndc_leaves', AUDIT: 'vndc_audit_logs', REMEMBER: 'vndc_remembered' };

let employees = JSON.parse(localStorage.getItem(STORAGE.EMP)) || [];
let expenses = JSON.parse(localStorage.getItem(STORAGE.EXP)) || [];
let leaves = JSON.parse(localStorage.getItem(STORAGE.LEAVE)) || [];
let auditLogs = JSON.parse(localStorage.getItem(STORAGE.AUDIT)) || [];
let currentUser = JSON.parse(sessionStorage.getItem('vndc_payroll_user')) || null;

// NEW: Auto-load from server if local is empty
if (employees.length === 0) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data.employees) {
                employees = data.employees;
                expenses = data.expenses || [];
                leaves = data.leaves || [];
                saveToLocal();
                renderActiveView();
            }
        }).catch(err => console.log("No initial data file found."));
}

const $ = (id) => document.getElementById(id);
const formatMoney = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

const saveToLocal = () => {
    localStorage.setItem(STORAGE.EMP, JSON.stringify(employees));
    localStorage.setItem(STORAGE.EXP, JSON.stringify(expenses));
    localStorage.setItem(STORAGE.LEAVE, JSON.stringify(leaves));
    localStorage.setItem(STORAGE.AUDIT, JSON.stringify(auditLogs));
};

const showToast = (m) => { const t = $('toast'); if(!t) return; t.innerText = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 3000); };
const logAudit = (action) => { auditLogs.push({ time: new Date().toLocaleString(), user: currentUser ? currentUser.name : 'System', action }); saveToLocal(); };

// --- LOGIN ---
const clearLoginFields = () => { 
    $('loginEmail').value = ''; $('loginPwd').value = ''; $('loginRemember').checked = false; 
    localStorage.removeItem(STORAGE.REMEMBER); 
    showToast("Đã xoá thông tin ghi nhớ");
};

const doLogin = () => {
    const e = $('loginEmail').value, p = $('loginPwd').value;
    if (e === 'congnt@vndc.vn' && p === '021289Mc@') {
        currentUser = { name: 'Nguyễn Thành Công', email: e };
        sessionStorage.setItem('vndc_payroll_user', JSON.stringify(currentUser));
        if ($('loginRemember').checked) {
            localStorage.setItem(STORAGE.REMEMBER, JSON.stringify({ e, p }));
        } else {
            localStorage.removeItem(STORAGE.REMEMBER);
        }
        location.reload();
    } else alert('Sai thông tin đăng nhập!');
};

const doLogout = () => { sessionStorage.removeItem('vndc_payroll_user'); location.reload(); };

const checkRemembered = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE.REMEMBER));
    if (data) {
        $('loginEmail').value = data.e;
        $('loginPwd').value = data.p;
        $('loginRemember').checked = true;
    }
};

// --- CALCULATIONS ---
const getPayrollData = (emp, periodValue, type = 'month') => {
    const filterExps = expenses.filter(x => {
        if (!emp || x.empId !== emp.id) return false;
        if (type === 'month') return x.date.startsWith(periodValue);
        if (type === 'quarter') {
            const m = parseInt(x.date.split('-')[1]);
            const [q, yr] = periodValue.split('-');
            if (!x.date.startsWith(yr)) return false;
            return q === 'Q1' ? (m >= 1 && m <= 3) : q === 'Q2' ? (m >= 4 && m <= 6) : q === 'Q3' ? (m >= 7 && m <= 9) : (m >= 10 && m <= 12);
        }
        return type === 'year' ? x.date.startsWith(periodValue) : false;
    });

    const monthsCount = type === 'month' ? 1 : (type === 'quarter' ? 3 : 12);
    let bonus = 0, advance = 0, adj = 0;
    filterExps.forEach(x => {
        if (['bonus', 'ot'].includes(x.type)) bonus += x.amount;
        else if (x.type === 'advance') advance += x.amount;
        else if (x.type === 'tax_adj') adj += x.amount;
    });

    const baseTotal = (emp.baseSalary || 0) * monthsCount;
    const allowances = ((emp.lunch || 0) + (emp.phone || 0)) * monthsCount;
    const insTotal = (emp.insSalary || 0) * 0.105 * monthsCount;
    const gross = baseTotal + bonus + allowances;
    const pit = Math.max(0, (gross - insTotal - (11000000 * monthsCount) - (emp.dependents * 4400000 * monthsCount))) * 0.1;
    return { gross, ins: insTotal, pit, bonus, advance, adj, net: gross - insTotal - pit - advance + adj, baseTotal, allowanceTotal: allowances };
};

// --- NAVIGATION & RENDERING ---
let activeView = 'dashboard';
const navTo = (v, el) => {
    activeView = v;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if(el) el.classList.add('active');
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const target = $(`view-${v}`); if(target) target.classList.add('active');
    $('view-title').innerText = el ? el.querySelector('span:last-child').innerText : (v.charAt(0).toUpperCase() + v.slice(1));
    renderActiveView();
};

const renderActiveView = () => {
    const m = $('salaryMonth').value;
    if(activeView === 'dashboard') renderDashboard(m);
    if(activeView === 'employees') renderEmployees();
    if(activeView === 'payroll') renderPayroll(m);
    if(activeView === 'reports') renderReports();
    if(activeView === 'contracts') renderContracts();
    if(activeView === 'leaves') renderLeaves();
    if(activeView === 'expenses') renderExpenses();
    if(activeView === 'tax') renderTax(m);
    if(activeView === 'audit') renderAudit();
};

const renderDashboard = (m) => {
    const all = employees.map(e => getPayrollData(e, m));
    $('statTotalPay').innerText = formatMoney(all.reduce((s,p)=>s+p.net, 0));
    $('statAvgSalary').innerText = formatMoney(all.length ? all.reduce((s,p)=>s+p.net, 0)/all.length : 0);
    $('statTotalBonus').innerText = formatMoney(all.reduce((s,p)=>s+p.bonus, 0));
    $('statTotalTax').innerText = formatMoney(all.reduce((s,p)=>s+p.pit, 0));
    const depts = [...new Set(employees.map(e => e.dept))];
    $('deptStatsList').innerHTML = depts.map(d => {
        const total = employees.filter(e => e.dept === d).reduce((s,e) => s + getPayrollData(e, m).net, 0);
        return `<div style="padding:15px 35px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between;"><span style="font-weight:700">${d}</span><span style="font-weight:700; color:var(--primary)">${formatMoney(total)}</span></div>`;
    }).join('');
    const recent = expenses.slice(-5).reverse();
    $('dashRecentExpenses').innerHTML = recent.length ? recent.map(ex => {
        const e = employees.find(x => x.id===ex.empId);
        return `<div style="padding:15px 35px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; font-size:14px;"><span><b>${e?e.name:'-'}</b></span><span style="color:#ef4444; font-weight:700">-${formatMoney(ex.amount)}</span></div>`;
    }).join('') : '<p style="padding:30px; text-align:center; color:#94a3b8">Trống</p>';
};

const renderEmployees = () => {
    const q = $('empSearch').value.toLowerCase();
    const filtered = employees.filter(e => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
    $('employeesBody').innerHTML = filtered.map(e => `<tr><td><b>${e.code}</b></td><td>${e.name}</td><td>${e.dept}</td><td>${formatMoney(e.baseSalary)}</td><td><button class="btn btn-print" style="padding:6px 12px; font-size:12px;" onclick="openEmployeeModal(${e.id})">Sửa</button></td></tr>`).join('');
};

const renderPayroll = (m) => {
    $('payrollBody').innerHTML = employees.map(e => {
        const p = getPayrollData(e, m);
        return `<tr><td><b>${e.name}</b></td><td>${formatMoney(e.baseSalary)}</td><td><span style="color:green">+${formatMoney(p.bonus)}</span></td><td><span style="color:orange">${formatMoney(p.advance)}</span></td><td>-${formatMoney(p.ins)}</td><td>-${formatMoney(p.pit)}</td><td><b style="color:var(--primary)">${formatMoney(p.net)}</b></td></tr>`;
    }).join('');
};

const updateRptPeriodOptions = () => {
    const type = $('rptPeriodType').value;
    $('rptPeriodVal').innerHTML = type === 'month' ? '<option value="2026-05">Tháng 05/2026</option><option value="2026-04">Tháng 04/2026</option>' : (type === 'quarter' ? '<option value="Q1-2026">Quý 1/2026</option><option value="Q2-2026">Quý 2/2026</option>' : '<option value="2026">Năm 2026</option>');
    renderReports();
};

const renderReports = () => {
    const eid = parseInt($('rptEmpId').value); const emp = employees.find(e => e.id===eid); if(!emp) return;
    const p = getPayrollData(emp, $('rptPeriodVal').value, $('rptPeriodType').value);
    $('rptStats').innerHTML = `<div class="stat-card bg-purple"><div class="stat-num">${formatMoney(p.gross)}</div><div class="stat-label">Tổng thu nhập</div></div><div class="stat-card bg-green"><div class="stat-num">${formatMoney(p.net)}</div><div class="stat-label">Tổng thực lĩnh</div></div><div class="stat-card bg-orange"><div class="stat-num">${formatMoney(p.bonus)}</div><div class="stat-label">Tổng thưởng</div></div><div class="stat-card bg-red"><div class="stat-num">${formatMoney(p.pit)}</div><div class="stat-label">Tổng thuế</div></div>`;
    $('rptTableBody').innerHTML = `<tr><td>Lương cơ bản</td><td>${formatMoney(p.baseTotal)}</td></tr><tr><td>Phụ cấp</td><td>${formatMoney(p.allowanceTotal)}</td></tr><tr><td>Thưởng / OT</td><td>${formatMoney(p.bonus)}</td></tr><tr style="font-weight:800; background:#f8fafc"><td>TỔNG CỘNG</td><td>${formatMoney(p.net)}</td></tr>`;
};

const renderContracts = () => {
    const q = $('contractSearch').value.toLowerCase();
    const filtered = employees.filter(e => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
    $('contractsBody').innerHTML = filtered.map(e => {
        const expired = e.contractEnd && new Date(e.contractEnd) < new Date();
        const status = expired ? '<span style="color:red">Hết hạn</span>' : '<span style="color:green">Hiệu lực</span>';
        return `<tr><td><b>CT-${e.id}</b></td><td>${e.name}</td><td>${e.contractType || '-'}</td><td>${status}</td><td>${e.contractFile ? `<a href="${e.contractFile}" target="_blank" style="color:var(--primary)">Xem File</a>` : '-'}</td><td><button class="btn btn-print" style="padding:6px 12px; font-size:12px;" onclick="openContractModal(${e.id})">Quản lý</button></td></tr>`;
    }).join('');
};

const renderExpenses = () => {
    $('expensesBody').innerHTML = expenses.map(ex => {
        const e = employees.find(x => x.id===ex.empId);
        return `<tr><td>${ex.date}</td><td><b>${e?e.name:'-'}</b></td><td>${ex.type}</td><td>${formatMoney(ex.amount)}</td><td>${ex.note||'-'}</td><td>${ex.proof ? `<a href="${ex.proof}" target="_blank" style="color:var(--primary)">Xem Chứng từ</a>` : '-'}</td><td><button class="btn btn-print" style="color:red; font-size:12px; padding:6px 12px;" onclick="deleteExpense(${ex.id})">Xóa</button></td></tr>`;
    }).join('');
};

const renderLeaves = () => { $('leavesBody').innerHTML = leaves.map(l => { const e = employees.find(x => x.id === l.empId); return `<tr><td><b>${e?e.name:'-'}</b></td><td>${l.type}</td><td>${l.start}</td><td>${l.days}</td></tr>`; }).join(''); };
const renderTax = (m) => { $('taxOptimizationList').innerHTML = employees.map(e => { const p = getPayrollData(e, m); return `<div class="data-card" style="padding:25px;"><h4 style="display:flex; justify-content:space-between"><span>${e.name}</span> <span style="color:#10b981">+${formatMoney(p.allowanceTotal)}</span></h4></div>`; }).join(''); };
const renderAudit = () => { $('auditTrailList').innerHTML = auditLogs.map(l => `<div style="padding:15px 35px; border-bottom:1px solid #f1f5f9;"><b>${l.time}</b> - <i>${l.user}</i>: ${l.action}</div>`).reverse().join(''); };

// --- MODAL ACTIONS ---
const closeModal = (id) => $(id).classList.remove('open');

const generateNextEmpCode = () => {
    if (employees.length === 0) return 'NV001';
    const codes = employees.map(e => parseInt(e.code.replace('NV', ''))).filter(n => !isNaN(n));
    return 'NV' + (Math.max(...codes, 0) + 1).toString().padStart(3, '0');
};

const openEmployeeModal = (id = null) => {
    $('employeeModal').classList.add('open');
    if (id) {
        const e = employees.find(x => x.id === id);
        $('eId').value = e.id; $('eCode').value = e.code; $('eName').value = e.name; $('eDept').value = e.dept;
        $('eBaseSalary').value = e.baseSalary; $('eInsSalary').value = e.insSalary; $('eLunch').value = e.lunch; $('ePhone').value = e.phone; $('eDependents').value = e.dependents;
    } else { 
        $('eId').value = ''; $('employeeModal').querySelectorAll('input').forEach(i => i.value = ''); 
        $('eCode').value = generateNextEmpCode(); 
    }
};

const saveEmployee = () => {
    const id = $('eId').value;
    const d = { code:$('eCode').value, name:$('eName').value, dept:$('eDept').value, baseSalary:parseFloat($('eBaseSalary').value)||0, insSalary:parseFloat($('eInsSalary').value)||0, lunch:parseFloat($('eLunch').value)||0, phone:parseFloat($('ePhone').value)||0, dependents:parseInt($('eDependents').value)||0 };
    if (id) { const idx = employees.findIndex(x => x.id == id); employees[idx] = { ...employees[idx], ...d }; logAudit(`Sửa NV: ${d.name}`); }
    else { d.id = Date.now(); employees.push(d); logAudit(`Mới NV: ${d.name}`); }
    saveToLocal(); closeModal('employeeModal'); renderActiveView(); showToast("Đã lưu hồ sơ thành công!");
};

const openContractModal = (id) => {
    const e = employees.find(x => x.id === id); if(!e) return;
    $('contractModal').classList.add('open'); $('cId').value = e.id; $('cEmpName').value = e.name; $('cType').value = e.contractType || 'Thử việc'; $('cEnd').value = e.contractEnd || ''; $('cFileLink').value = e.contractFile || '';
};

const saveContract = () => {
    const id = parseInt($('cId').value); const idx = employees.findIndex(x => x.id === id);
    if(idx !== -1) { employees[idx].contractType = $('cType').value; employees[idx].contractEnd = $('cEnd').value; employees[idx].contractFile = $('cFileLink').value; logAudit(`Cập nhật HĐ: ${employees[idx].name}`); saveToLocal(); closeModal('contractModal'); renderActiveView(); showToast("Đã cập nhật hợp đồng!"); }
};

const openExpenseModal = () => { 
    $('expenseModal').classList.add('open'); 
    $('expEmpId').innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join(''); 
    $('expDate').value = new Date().toISOString().split('T')[0];
    $('expAmount').value = ''; $('expNote').value = ''; $('expProof').value = '';
};

const saveExpense = () => {
    const d = { id: Date.now(), empId: parseInt($('expEmpId').value), type: $('expType').value, amount: parseFloat($('expAmount').value) || 0, date: $('expDate').value, note: $('expNote').value, proof: $('expProof').value };
    expenses.push(d); logAudit(`Chi phí: ${formatMoney(d.amount)} - ${employees.find(e=>e.id==d.empId).name}`); saveToLocal(); closeModal('expenseModal'); renderActiveView(); showToast("Đã lưu phiếu chi!");
};

const deleteExpense = (id) => { if(confirm("Bạn có chắc chắn muốn xoá phiếu chi này?")) { expenses = expenses.filter(x => x.id !== id); saveToLocal(); renderActiveView(); showToast("Đã xoá!"); } };

const openLeaveModal = () => { 
    $('leaveModal').classList.add('open'); 
    $('leaveEmpId').innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join(''); 
    $('leaveStart').value = new Date().toISOString().split('T')[0];
    $('leaveDays').value = 1;
};

const saveLeave = () => { 
    const d = { id: Date.now(), empId: parseInt($('leaveEmpId').value), type: 'Nghỉ phép', start: $('leaveStart').value, days: parseFloat($('leaveDays').value) || 0 }; 
    leaves.push(d); logAudit(`Đăng ký nghỉ: ${employees.find(e=>e.id==d.empId).name}`); saveToLocal(); closeModal('leaveModal'); renderActiveView(); showToast("Đã đăng ký nghỉ thành công!"); 
};

// --- INITIALIZATION ---
window.onload = () => {
    checkRemembered();
    if (currentUser) {
        $('appScreen').style.display = 'flex'; $('loginScreen').style.display = 'none';
        $('sidebarUser').innerText = currentUser.name;
        $('rptEmpId').innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
        updateRptPeriodOptions(); renderActiveView();
    }
};
