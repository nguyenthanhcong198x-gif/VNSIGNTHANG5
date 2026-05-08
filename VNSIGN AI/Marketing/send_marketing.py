import smtplib
import csv
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os

# --- CẤU HÌNH THÔNG TIN GỬI EMAIL ---
SMTP_SERVER = "smtp.gmail.com"  # Thay đổi nếu dùng Outlook/SendGrid...
SMTP_PORT = 587
EMAIL_SENDER = "your-email@gmail.com"  # Email của bạn
EMAIL_PASSWORD = "your-app-password"  # Mật khẩu ứng dụng (App Password)
EMAIL_SUBJECT = "Giới thiệu giải pháp VNSign Digital Signage - Tối ưu hóa hiển thị"

# --- TÙY CHỌN ---
DRY_RUN = True  # Set thành False để gửi thật. Nếu True chỉ in ra màn hình để kiểm tra.
SLEEP_TIME = 2  # Thời gian chờ giữa mỗi email (giây) để tránh bị coi là spam.

def send_email():
    # Kiểm tra file
    csv_path = "customers.csv"
    template_path = "email_template.html"
    
    if not os.path.exists(csv_path) or not os.path.exists(template_path):
        print(f"Lỗi: Không tìm thấy file {csv_path} hoặc {template_path}")
        return

    # Đọc mẫu email
    with open(template_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    try:
        # Kết nối tới server
        if not DRY_RUN:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            print("Đã kết nối thành công tới máy chủ email.")

        # Đọc danh sách khách hàng
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                name = row['name']
                email_to = row['email']
                
                # Cá nhân hóa nội dung
                personalized_html = html_content.replace("{{name}}", name)
                
                # Tạo email
                msg = MIMEMultipart()
                msg['From'] = EMAIL_SENDER
                msg['To'] = email_to
                msg['Subject'] = EMAIL_SUBJECT
                msg.attach(MIMEText(personalized_html, 'html'))
                
                if DRY_RUN:
                    print(f"[KIỂM TRA] Sẽ gửi tới: {name} ({email_to})")
                else:
                    server.send_message(msg)
                    print(f"[THÀNH CÔNG] Đã gửi tới: {name} ({email_to})")
                    time.sleep(SLEEP_TIME)
                
                count += 1

        if not DRY_RUN:
            server.quit()
        
        print(f"\nHoàn tất! Tổng cộng đã xử lý {count} khách hàng.")
        if DRY_RUN:
            print("LƯU Ý: Đây chỉ là chế độ KIỂM TRA. Hãy đổi DRY_RUN = False trong code để gửi thật.")

    except Exception as e:
        print(f"Lỗi hệ thống: {e}")

if __name__ == "__main__":
    send_email()
