#!/bin/bash

# Configuration
PROJECT_DIR="/Users/thanhcong/Desktop/My brain"
DOWNLOADS_DIR="/Users/thanhcong/Downloads"
LOG_FILE="$PROJECT_DIR/sync_log.txt"

cd "$PROJECT_DIR" || exit

echo "--- Smart Sync started at $(date) ---" >> "$LOG_FILE"

# 1. Tự động kiểm tra và di chuyển dữ liệu từ Downloads (Nếu có)
if [ -f "$DOWNLOADS_DIR/data.json" ]; then
    echo "Phát hiện dữ liệu mới trong Downloads. Đang tự động cập nhật..." >> "$LOG_FILE"
    
    # Kiểm tra nội dung file để biết thuộc về hệ thống nào
    if grep -q "employees" "$DOWNLOADS_DIR/data.json"; then
        mv "$DOWNLOADS_DIR/data.json" "$PROJECT_DIR/Kế toán tiền lương/data.json"
        echo "Đã cập nhật dữ liệu Kế toán." >> "$LOG_FILE"
    elif grep -q "inventory" "$DOWNLOADS_DIR/data.json"; then
        mv "$DOWNLOADS_DIR/data.json" "$PROJECT_DIR/Quản lý bảo hành VNDC/data.json"
        echo "Đã cập nhật dữ liệu Bảo hành." >> "$LOG_FILE"
    fi
fi

# 2. Add all changes
git add . >> "$LOG_FILE" 2>&1

# 3. Commit if there are changes
if ! git diff-index --quiet HEAD --; then
    git commit -m "Smart Auto Sync: $(date)" >> "$LOG_FILE" 2>&1
    git push origin main >> "$LOG_FILE" 2>&1
    echo "Sync successful!" >> "$LOG_FILE"
else
    echo "No changes detected." >> "$LOG_FILE"
fi

echo "--------------------------------" >> "$LOG_FILE"
