#!/bin/bash
PROJECT_DIR="/Users/thanhcong/Desktop/My brain"
REPO_URL="https://github.com/nguyenthanhcong198x-gif/VNSIGNTHANG5"

cd "$PROJECT_DIR" || exit

echo "Đang dọn dẹp các thiết lập cũ..."
# Xóa git cũ trong thư mục con để tránh xung đột
rm -rf "Quản lý bảo hành VNDC/.git"

echo "Đang khởi tạo Git cho toàn bộ thư mục My brain..."
git init
git remote add origin "$REPO_URL"
git branch -M main

echo "Đang chuẩn bị dữ liệu (có thể mất chút thời gian nếu dữ liệu lớn)..."
git add .

echo "Đang commit..."
git commit -m "Initial commit for all folders in My brain"

echo "Đang đẩy toàn bộ dữ liệu lên GitHub..."
echo "Lưu ý: Nếu được hỏi, hãy dán GitHub Token của bạn."
git push -f -u origin main

echo "Đang thiết lập lịch cập nhật 18h hàng ngày..."
# Xóa lịch cũ và thêm lịch mới
(crontab -l 2>/dev/null | grep -v "sync_github.sh" | grep -v "sync_all_brain.sh"; echo "0 18 * * * /bin/bash \"$(pwd)/sync_all_brain.sh\"") | crontab -

echo "--- TẤT CẢ ĐÃ XONG! ---"
echo "Toàn bộ thư mục My brain hiện đã được quản lý và tự động cập nhật."
read -p "Nhấn Enter để thoát..."
