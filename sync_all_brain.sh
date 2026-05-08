#!/bin/bash

# Configuration
PROJECT_DIR="/Users/thanhcong/Desktop/My brain"
DOWNLOADS_DIR="/Users/thanhcong/Downloads"
LOG_FILE="$PROJECT_DIR/sync_log.txt"

cd "$PROJECT_DIR" || exit

echo "--- Smart Sync started at $(date) ---" >> "$LOG_FILE"

# 1. Tự động kiểm tra và di chuyển dữ liệu từ Downloads vào thư mục 'data' trung tâm
if [ -f "$DOWNLOADS_DIR/accounting.json" ]; then
    echo "Phát hiện dữ liệu Kế toán mới. Đang đồng bộ..." >> "$LOG_FILE"
    mv "$DOWNLOADS_DIR/accounting.json" "$PROJECT_DIR/data/accounting.json"
fi

if [ -f "$DOWNLOADS_DIR/warranty.json" ]; then
    echo "Phát hiện dữ liệu Bảo hành mới. Đang đồng bộ..." >> "$LOG_FILE"
    mv "$DOWNLOADS_DIR/warranty.json" "$PROJECT_DIR/data/warranty.json"
fi

# 2. Add all changes (bao gồm cả thư mục data mới)
git add . >> "$LOG_FILE" 2>&1

# 3. Commit and Push
if ! git diff-index --quiet HEAD --; then
    git commit -m "Central Data Sync: $(date)" >> "$LOG_FILE" 2>&1
    git push origin main >> "$LOG_FILE" 2>&1
    echo "Sync successful!" >> "$LOG_FILE"
else
    echo "No changes detected." >> "$LOG_FILE"
fi

echo "--------------------------------" >> "$LOG_FILE"
