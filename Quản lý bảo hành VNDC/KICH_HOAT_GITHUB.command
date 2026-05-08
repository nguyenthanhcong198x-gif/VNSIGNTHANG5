#!/bin/bash
cd "/Users/thanhcong/Desktop/My brain/Quản lý bảo hành VNDC"
chmod +x setup_github.sh sync_github.sh
./setup_github.sh
(crontab -l 2>/dev/null; echo "0 18 * * * /bin/bash \"$(pwd)/sync_github.sh\"") | crontab -
echo "--- XONG! ---"
echo "Mọi thứ đã được thiết lập tự động."
echo "Bạn có thể đóng cửa sổ này."
read -p "Nhấn Enter để thoát..."
