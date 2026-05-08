#!/bin/bash
PROJECT_DIR="/Users/thanhcong/Desktop/My brain"
cd "$PROJECT_DIR" || exit

echo "--- ĐANG SỬA LỖI ĐỒNG BỘ ---"
# Xóa bỏ hoàn toàn các vết tích Git cũ trong thư mục con (nếu có)
find . -name ".git" -type d -not -path "./.git" -exec rm -rf {} + 2>/dev/null

echo "1. Đang quét lại toàn bộ dữ liệu..."
git add --all --force

echo "2. Đang tạo bản lưu trữ mới..."
git commit -m "Deep Sync: Fix missing data and unify system $(date)"

echo "3. Đang đẩy dữ liệu lên GitHub..."
echo "Lưu ý: Bạn có thể cần dán lại Token nếu được hỏi."
git push -u origin main

echo "--- HOÀN TẤT! ---"
echo "Bây giờ bạn hãy kiểm tra lại trên GitHub, dữ liệu đã được đẩy lên đầy đủ."
read -p "Nhấn Enter để thoát..."
