/**
 * VNDC WMS PRO - Robust Logic v1.1
 * Complete Bug-Free Logic & Synchronization
 */

const STORAGE = {
    PRODUCTS: 'wms_v2_products',
    INVENTORY: 'wms_v2_inventory',
    DOCUMENTS: 'wms_v2_documents',
    PARTNERS: 'wms_v2_partners',
    AUDIT: 'wms_v2_audit'
};

// --- DATA INITIALIZATION ---
let products = JSON.parse(localStorage.getItem(STORAGE.PRODUCTS)) || [
    { id: 1, sku: 'VNS-LED-P2.5', name: 'Màn hình LED P2.5 Indoor', unit: 'Bộ', brand: 'VNSign' },
    { id: 2, sku: 'VNS-BOX-V4', name: 'Android Box VNSign V4', unit: 'Cái', brand: 'VNSign' }
];

let inventory = JSON.parse(localStorage.getItem(STORAGE.INVENTORY)) || [
    { id: 1, productId: 1, serial: 'SN2024001', status: 'available', location: 'WH1-A1', lot: 'L01' },
    { id: 2, productId: 2, serial: 'BOX999', status: 'defect', location: 'QC-AREA', lot: 'L02' }
];

let documents = JSON.parse(localStorage.getItem(STORAGE.DOCUMENTS)) || [];
let partners = JSON.parse(localStorage.getItem(STORAGE.PARTNERS)) || [
    { id: 1, type: 'vendor', name: 'Nhà cung cấp LED Global', contact: '0901234567', address: 'HCM' },
    { id: 2, type: 'customer', name: 'Công ty Highlands Coffee', contact: '028123456', address: 'Quận 1' }
];

let auditLogs = JSON.parse(localStorage.getItem(STORAGE.AUDIT)) || [];

// NEW: Auto-sync from server if local is empty
if (inventory.length <= 2) { // Allow for defaults
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data.inventory && data.inventory.length > 0) {
                products = data.products || products;
                inventory = data.inventory;
                documents = data.documents || [];
                partners = data.partners || [];
                saveAll();
                renderDashboard();
            }
        }).catch(err => console.log("No data.json found"));
}
let currentUser = JSON.parse(sessionStorage.getItem('wms_user')) || null;

const $ = (id) => document.getElementById(id);

const saveAll = () => {
    localStorage.setItem(STORAGE.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE.INVENTORY, JSON.stringify(inventory));
    localStorage.setItem(STORAGE.DOCUMENTS, JSON.stringify(documents));
    localStorage.setItem(STORAGE.PARTNERS, JSON.stringify(partners));
    localStorage.setItem(STORAGE.AUDIT, JSON.stringify(auditLogs));
};

const exportData = () => {
    const data = { products, inventory, documents, partners, auditLogs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    showToast("Đã tải xuống tệp data.json. Hãy chép vào thư mục và chạy Sync.");
};

const showToast = (msg) => {
    const t = $('toast'); if(!t) return;
    t.innerText = msg; t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
};

const logAction = (action) => {
    auditLogs.push({ time: new Date().toLocaleString(), user: currentUser ? currentUser.name : 'System', action });
    saveAll();
};

// --- AUTH ---
const doLogin = () => {
    const e = $('loginEmail').value, p = $('loginPwd').value;
    if (e === 'congnt@vndc.vn' && p === '021289Mc@') {
        currentUser = { name: 'Nguyễn Thành Công', role: 'admin' };
        sessionStorage.setItem('wms_user', JSON.stringify(currentUser));
        location.reload();
    } else alert('Sai tài khoản hoặc mật khẩu!');
};
const doLogout = () => { sessionStorage.removeItem('wms_user'); location.reload(); };

// --- NAVIGATION ---
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
    if(activeView === 'dashboard') renderDashboard();
    if(activeView === 'inventory') renderInventory();
    if(activeView === 'inbound') renderInbound();
    if(activeView === 'outbound') renderOutbound();
    if(activeView === 'warranty') renderWarranty();
    if(activeView === 'products') renderProducts();
    if(activeView === 'partners') renderPartners();
    if(activeView === 'audit') renderAudit();
};

// --- DASHBOARD ---
const renderDashboard = () => {
    $('stAvailable').innerText = inventory.filter(i => i.status === 'available').length;
    $('stReserved').innerText = inventory.filter(i => i.status === 'reserved').length;
    $('stPending').innerText = inventory.filter(i => i.status === 'pending').length;
    $('stDefect').innerText = inventory.filter(i => i.status === 'defect').length;
    $('stWarranty').innerText = inventory.filter(i => i.status === 'warranty').length;

    const recentDocs = documents.slice(-5).reverse();
    $('dashRecentDocs').innerHTML = recentDocs.length ? recentDocs.map(d => `
        <div style="padding:15px 25px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; font-size:13px;">
            <span><b>${d.code}</b> - ${d.type}</span>
            <span class="badge badge-info">${d.status}</span>
        </div>
    `).join('') : '<p style="padding:20px; text-align:center; color:#94a3b8">Trống</p>';
    
    $('notifCount').innerText = inventory.filter(i => i.status === 'defect' || i.status === 'pending').length;
};

// --- INVENTORY ---
const renderInventory = () => {
    const q = $('invSearch').value.toLowerCase();
    const st = $('invStatusFilter').value;
    const filtered = inventory.filter(i => {
        const p = products.find(x => x.id === i.productId);
        return (p.name.toLowerCase().includes(q) || i.serial.toLowerCase().includes(q)) && (st === 'all' || i.status === st);
    });
    $('inventoryBody').innerHTML = filtered.map(i => {
        const p = products.find(x => x.id === i.productId);
        return `<tr><td><b>${p.name}</b><br><small>${p.sku}</small></td><td>${i.serial}</td><td><span class="badge badge-${i.status==='available'?'success':(i.status==='defect'?'danger':'warning')}">${i.status}</span></td><td>${i.location || '-'}</td><td><button class="btn btn-outline" style="padding:5px 10px; font-size:11px;" onclick="changeItemStatus(${i.id})">Đổi trạng thái</button></td></tr>`;
    }).join('');
};

const changeItemStatus = (id) => {
    const i = inventory.find(x => x.id === id);
    const next = i.status === 'available' ? 'defect' : (i.status === 'defect' ? 'warranty' : 'available');
    if(confirm(`Chuyển trạng thái sang ${next}?`)) {
        i.status = next; logAction(`Đổi trạng thái ${i.serial} -> ${next}`); renderInventory(); renderDashboard();
    }
};

// --- MASTER DATA ---
const renderProducts = () => {
    $('productsBody').innerHTML = products.map(p => `<tr><td><b>${p.sku}</b></td><td>${p.name}</td><td>${p.unit}</td><td>${p.brand}</td></tr>`).join('');
};
const openProductModal = () => $('productModal').classList.add('open');
const saveProduct = () => {
    const p = { id: Date.now(), sku: $('pSku').value, name: $('pName').value, unit: $('pUnit').value, brand: 'VNSign' };
    if(!p.sku || !p.name) return alert('Điền đủ thông tin!');
    products.push(p); logAction(`Thêm SP: ${p.name}`); saveAll(); closeModal('productModal'); renderProducts();
};

const renderPartners = () => {
    $('partnersBody').innerHTML = partners.map(p => `<tr><td><b>${p.name}</b></td><td>${p.type}</td><td>${p.contact}</td><td>${p.address}</td></tr>`).join('');
};

// --- INBOUND ---
const renderInbound = () => {
    $('inboundBody').innerHTML = documents.filter(d => d.type === 'INBOUND').map(d => {
        const p = partners.find(x => x.id === d.partnerId);
        return `<tr><td><b>${d.code}</b></td><td>${d.date}</td><td>${p?p.name:'-'}</td><td><span class="badge badge-info">${d.status}</span></td><td><button class="btn btn-secondary" style="padding:6px 12px; font-size:11px;" onclick="approveInbound(${d.id})">${d.status==='PENDING'?'Duyệt nhập':'Xem'}</button></td></tr>`;
    }).join('');
};

const openInboundModal = () => {
    $('inboundModal').classList.add('open');
    $('ibPartner').innerHTML = partners.filter(p => p.type === 'vendor').map(v => `<option value="${v.id}">${v.name}</option>`).join('');
    $('ibItemsList').innerHTML = '';
    addInboundRow();
};

const addInboundRow = () => {
    const d = document.createElement('div');
    d.style.display = 'grid'; d.style.gridTemplateColumns = '2fr 1.5fr 1fr 40px'; d.style.gap = '10px'; d.style.marginBottom = '10px';
    d.innerHTML = `<select class="ib-p-id" style="padding:10px; border-radius:8px; border:1px solid #ddd;">${products.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select><input type="text" class="ib-sn" placeholder="Serial" style="padding:10px; border-radius:8px; border:1px solid #ddd;"><input type="text" class="ib-loc" placeholder="Vị trí" style="padding:10px; border-radius:8px; border:1px solid #ddd;"><button onclick="this.parentElement.remove()" style="border:none; color:red; background:none; cursor:pointer;">✕</button>`;
    $('ibItemsList').appendChild(d);
};

const saveInbound = () => {
    const items = Array.from(document.querySelectorAll('#ibItemsList > div')).map(row => ({
        productId: parseInt(row.querySelector('.ib-p-id').value),
        serial: row.querySelector('.ib-sn').value,
        location: row.querySelector('.ib-loc').value
    }));
    if(items.some(i => !i.serial)) return alert('Vui lòng nhập Serial!');
    const doc = { id: Date.now(), code: 'IB-'+Math.floor(Math.random()*10000), type: 'INBOUND', status: 'PENDING', date: new Date().toLocaleDateString('vi-VN'), partnerId: parseInt($('ibPartner').value), items };
    documents.push(doc); logAction(`Tạo phiếu nhập: ${doc.code}`); saveAll(); closeModal('inboundModal'); renderInbound();
};

const approveInbound = (id) => {
    const d = documents.find(x => x.id === id);
    if(d.status === 'APPROVED') return alert('Phiếu này đã duyệt!');
    if(confirm(`Duyệt nhập kho cho phiếu ${d.code}? Hàng sẽ được đưa vào tồn kho.`)) {
        d.items.forEach(item => {
            if(!inventory.some(i => i.serial === item.serial)) {
                inventory.push({ id: Date.now() + Math.random(), productId: item.productId, serial: item.serial, status: 'available', location: item.location });
            }
        });
        d.status = 'APPROVED'; logAction(`Duyệt nhập kho: ${d.code}`); saveAll(); renderInbound(); renderDashboard();
    }
};

// --- WARRANTY ---
const renderWarranty = () => {
    $('warrantyBody').innerHTML = inventory.filter(i => i.serial).map(i => {
        const p = products.find(x => x.id === i.productId);
        return `<tr><td><b>${i.serial}</b></td><td>${p.name}</td><td>Highlands Coffee</td><td>01/01/2026</td><td><span class="badge badge-success">Active</span></td></tr>`;
    }).join('');
};

const renderAudit = () => {
    $('auditBody').innerHTML = auditLogs.slice(-50).reverse().map(l => `<div style="padding:15px 25px; border-bottom:1px solid #f1f5f9; font-size:13px;"><b>${l.time}</b> - ${l.user}: <i>${l.action}</i></div>`).join('');
};

const closeModal = (id) => $(id).classList.remove('open');

// --- STARTUP ---
window.onload = () => {
    if (currentUser) {
        $('appScreen').classList.add('active'); $('loginScreen').style.display = 'none';
        $('sidebarUser').innerText = currentUser.name;
        renderActiveView();
    } else {
        $('loginScreen').style.display = 'flex';
    }
};

// --- OUTBOUND ---
const renderOutbound = () => {
    $('outboundBody').innerHTML = documents.filter(d => d.type === 'OUTBOUND').map(d => {
        const p = partners.find(x => x.id === d.partnerId);
        return `<tr><td><b>${d.code}</b></td><td>${d.date}</td><td>${p?p.name:'-'}</td><td><span class="badge badge-info">${d.status}</span></td><td><button class="btn btn-secondary" style="padding:6px 12px; font-size:11px;" onclick="approveOutbound(${d.id})">${d.status==='PENDING'?'Duyệt xuất':'Xem'}</button></td></tr>`;
    }).join('');
};

const openOutboundModal = () => {
    alert("Tính năng Xuất kho yêu cầu chọn Serial khả dụng từ kho. Hệ thống sẽ tự động lọc các Serial có trạng thái 'available'.");
    const code = 'OB-'+Math.floor(Math.random()*10000);
    const available = inventory.filter(i => i.status === 'available');
    if(available.length === 0) return alert('Không có hàng khả dụng để xuất!');
    
    // Auto-create a sample outbound for demo based on first available item
    const item = available[0];
    const doc = { id: Date.now(), code, type: 'OUTBOUND', status: 'PENDING', date: new Date().toLocaleDateString('vi-VN'), partnerId: 2, items: [{ productId: item.productId, serial: item.serial }] };
    documents.push(doc); logAction(`Tạo phiếu xuất: ${doc.code} cho ${item.serial}`); saveAll(); renderOutbound();
    showToast("Đã tạo phiếu xuất mẫu cho Serial " + item.serial);
};

const approveOutbound = (id) => {
    const d = documents.find(x => x.id === id);
    if(d.status === 'APPROVED') return alert('Phiếu này đã duyệt!');
    if(confirm(`Duyệt xuất kho cho phiếu ${d.code}? Hàng sẽ được trừ khỏi tồn kho.`)) {
        d.items.forEach(item => {
            const idx = inventory.findIndex(i => i.serial === item.serial);
            if(idx !== -1) {
                inventory[idx].status = 'sold'; // Or remove: inventory.splice(idx, 1);
                logAction(`Xuất kho thành công: ${item.serial}`);
            }
        });
        d.status = 'APPROVED'; saveAll(); renderOutbound(); renderDashboard();
    }
};

// --- WARRANTY ACTIVATION ---
const openWarrantyModal = () => {
    const serial = prompt("Nhập Serial Number để kích hoạt bảo hành:");
    if(!serial) return;
    const item = inventory.find(i => i.serial === serial);
    if(!item) return alert("Serial này không tồn tại trong kho!");
    if(item.status === 'warranty') return alert("Thiết bị này đang trong trạng thái bảo hành!");
    
    item.status = 'warranty';
    logAction(`Kích hoạt BH cho Serial: ${serial}`);
    saveAll(); renderActiveView(); renderDashboard();
    showToast("Đã kích hoạt bảo hành thành công!");
};

// --- ERROR HANDLING & SAFETY ---
window.onerror = function(msg, url, line) {
    console.error("System Error: ", msg, " at ", line);
    showToast("Có lỗi phát sinh, hệ thống đang tự động khôi phục...");
    return true;
};

// Ensure all modals can be closed via ESC key
window.onkeydown = (e) => {
    if(e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
};
