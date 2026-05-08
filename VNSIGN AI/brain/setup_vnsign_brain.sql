-- Schema for VNSign Dedicated Brain
CREATE TABLE IF NOT EXISTS knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brand_voice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ideas_brainstorm (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_name TEXT NOT NULL,
    description TEXT NOT NULL,
    potential_impact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populating with VNSign Strategy Data
INSERT INTO brand_voice (title, content) VALUES 
('Tone giọng', 'Chuyên nghiệp, Uy tín nhưng gần gũi, mang tính hướng dẫn và tư vấn. Nhấn mạnh niềm tự hào sản phẩm Việt.'),
('Từ khóa hay dùng', 'Digital Signage, CMS, Quản trị từ xa, Tự phát triển tại Việt Nam, Tối ưu hóa chi phí, Trải nghiệm khách hàng.'),
('Mindset', 'Biến những màn hình vô tri thành công cụ giao tiếp mạnh mẽ và sinh lời.');

INSERT INTO business (title, content) VALUES 
('Sản phẩm', 'VNSign Digital Signage - Giải pháp quản trị màn hình tập trung trên nền tảng Cloud.'),
('Giá mục tiêu', 'Gói Pro: 149k-199k/màn hình/tháng. Gói Free: 1 màn hình.'),
('Đối tượng mục tiêu', 'Chuỗi F&B, Bệnh viện, Cửa hàng bán lẻ, Showroom.');

INSERT INTO knowledge (title, content) VALUES 
('Lợi ích kỹ thuật', 'Hỗ trợ Offline Mode, đa nền tảng (Android, Tizen, WebOS, Web), hệ thống ổn định cao.'),
('Thị trường', 'Nhu cầu chuyển đổi số màn hình quảng cáo tại VN đang tăng trưởng mạnh, đặc biệt là các chuỗi cửa hàng tiện lợi và cafe.');

INSERT INTO ideas_brainstorm (idea_name, description, potential_impact) VALUES 
('AI Voice Assistant', 'Tích hợp trợ lý ảo giọng nói vào Kiosk giúp khách giải đáp nhanh vị trí phòng khám/quầy hàng.', 'Tăng trải nghiệm tương tác trực tiếp.'),
('Social Live Feed', 'Hiển thị đánh giá Google Maps hoặc hashtag TikTok/FB của thương hiệu theo thời gian thực.', 'Tăng niềm tin thông qua Social Proof.'),
('Green Signage', 'Sử dụng AI Sensor để giảm độ sáng hoặc tắt màn hình khi không có người đứng trước.', 'Tiết kiệm điện và hỗ trợ tiêu chuẩn ESG.'),
('QR Gamification', 'Quét mã QR để chơi game vòng quay may mắn/nhận voucher ngay trên màn hình lớn.', 'Tăng thời gian giữ chân khách hàng (Retention).'),
('Heatmap Analytics', 'Sử dụng AI để phân tích mật độ và bản đồ nhiệt khu vực khách đứng xem nhiều nhất.', 'Tối ưu hóa vị trí đặt màn hình và nội dung quảng cáo.');
