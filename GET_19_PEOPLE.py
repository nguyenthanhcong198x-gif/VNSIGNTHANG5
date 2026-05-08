#!/usr/bin/env python3
import os
import sqlite3
import json
import shutil

# Paths
SAFARI_DB_DIR = os.path.expanduser("~/Library/Safari/LocalStorage")
PROJECT_DATA_DIR = "/Users/thanhcong/Desktop/My brain/data"
TARGET_JSON = os.path.join(PROJECT_DATA_DIR, "accounting.json")

def extract():
    print("--- ĐANG TRÍCH XUẤT 19 NHÂN SỰ TỪ SAFARI ---")
    
    # Tìm tệp database của Safari cho dự án này
    # Tên tệp thường chứa URL mã hóa
    found_db = None
    if os.path.exists(SAFARI_DB_DIR):
        for f in os.listdir(SAFARI_DB_DIR):
            if "K%C3%A9%20to%C3%A1n%20ti%E1%BB%81n%20l%C6%B0%C6%A1ng" in f and f.endswith(".localstorage"):
                found_db = os.path.join(SAFARI_DB_DIR, f)
                break
    
    if not found_db:
        print("LỖI: Không tìm thấy bộ nhớ Safari. Bạn hãy đảm bảo đã mở trang Kế toán trên Safari ít nhất 1 lần.")
        return

    try:
        # Safari LocalStorage là SQLite
        conn = sqlite3.connect(found_db)
        cursor = conn.cursor()
        
        # Lấy dữ liệu employees (thường nằm trong bảng ItemTable)
        cursor.execute("SELECT value FROM ItemTable WHERE key = 'vndc_employees'")
        row_emp = cursor.fetchone()
        
        cursor.execute("SELECT value FROM ItemTable WHERE key = 'vndc_payroll_expenses'")
        row_exp = cursor.fetchone()
        
        cursor.execute("SELECT value FROM ItemTable WHERE key = 'vndc_leaves'")
        row_leave = cursor.fetchone()
        
        if row_emp:
            # Dữ liệu trong SQLite của Safari thường được encode kiểu UTF-16
            emp_data = row_emp[0].decode('utf-16') if isinstance(row_emp[0], bytes) else row_emp[0]
            exp_data = row_exp[0].decode('utf-16') if row_exp and isinstance(row_exp[0], bytes) else (row_exp[0] if row_exp else "[]")
            leave_data = row_leave[0].decode('utf-16') if row_leave and isinstance(row_leave[0], bytes) else (row_leave[0] if row_leave else "[]")
            
            final_json = {
                "employees": json.loads(emp_data),
                "expenses": json.loads(exp_data),
                "leaves": json.loads(leave_data)
            }
            
            with open(TARGET_JSON, 'w', encoding='utf-8') as f:
                json.dump(final_json, f, ensure_ascii=False, indent=2)
            
            print(f"THÀNH CÔNG! Đã trích xuất được {len(final_json['employees'])} nhân sự.")
            
            # Chạy đồng bộ lên GitHub
            os.system("cd '/Users/thanhcong/Desktop/My brain' && ./sync_all_brain.sh")
            print("Đã đồng bộ lên GitHub thành công!")
        else:
            print("LỖI: Không tìm thấy dữ liệu nhân sự trong bộ nhớ Safari.")
            
        conn.close()
    except Exception as e:
        print(f"LỖI HỆ THỐNG: {str(e)}")

if __name__ == "__main__":
    extract()
    input("Nhấn Enter để thoát...")
