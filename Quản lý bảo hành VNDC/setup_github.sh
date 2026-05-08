#!/bin/bash

PROJECT_DIR="/Users/thanhcong/Desktop/My brain/Quản lý bảo hành VNDC"
REPO_URL="https://github.com/nguyenthanhcong198x-gif/VNSIGNTHANG5"

cd "$PROJECT_DIR" || exit

echo "Đang khởi tạo Git..."
git init
git remote add origin "$REPO_URL"
git branch -M main

echo "Đang commit lần đầu..."
git add .
git commit -m "Initial commit from setup script"

echo "Đang đẩy lên GitHub..."
echo "Lưu ý: Nếu được hỏi, hãy nhập GitHub Token hoặc đăng nhập."
git push -u origin main

echo "Xong! Bây giờ hệ thống sẽ tự động cập nhật hàng ngày vào 18h."
