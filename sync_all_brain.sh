#!/bin/bash

# Configuration
PROJECT_DIR="/Users/thanhcong/Desktop/My brain"
LOG_FILE="$PROJECT_DIR/sync_log.txt"

cd "$PROJECT_DIR" || exit

echo "--- Smart DB Sync started at $(date) ---" >> "$LOG_FILE"

# 1. Đồng bộ từ SQLite (brain.db) ra các tệp JSON để web hiển thị
python3 sync_db_to_json.py >> "$LOG_FILE" 2>&1

# 2. Kiểm tra dữ liệu từ Downloads (để hỗ trợ cập nhật từ trình duyệt)
DOWNLOADS_DIR="/Users/thanhcong/Downloads"
if [ -f "$DOWNLOADS_DIR/accounting.json" ]; then
    # Lưu vào DB trước khi xóa
    DATA=$(cat "$DOWNLOADS_DIR/accounting.json")
    sqlite3 brain.db "INSERT INTO accounting (data) VALUES ('$DATA');"
    mv "$DOWNLOADS_DIR/accounting.json" "$PROJECT_DIR/data/accounting.json"
fi

if [ -f "$DOWNLOADS_DIR/warranty.json" ]; then
    DATA=$(cat "$DOWNLOADS_DIR/warranty.json")
    sqlite3 brain.db "INSERT INTO warranty (data) VALUES ('$DATA');"
    mv "$DOWNLOADS_DIR/warranty.json" "$PROJECT_DIR/data/warranty.json"
fi

# 3. Add, Commit and Push
git add . >> "$LOG_FILE" 2>&1
if ! git diff-index --quiet HEAD --; then
    git commit -m "Database Auto Sync: $(date)" >> "$LOG_FILE" 2>&1
    git push origin main >> "$LOG_FILE" 2>&1
    echo "Sync successful!" >> "$LOG_FILE"
else
    echo "No changes detected." >> "$LOG_FILE"
fi

echo "--------------------------------" >> "$LOG_FILE"
