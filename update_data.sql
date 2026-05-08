-- Clear sample data for brand_voice and add real data
DELETE FROM brand_voice;
INSERT INTO brand_voice (title, content) VALUES 
('Tone giọng', 'Chuyên nghiệp, Uy tín nhưng gần gũi, mang tính hướng dẫn và tư vấn. Nhấn mạnh niềm tự hào sản phẩm Việt.'),
('Từ khóa hay dùng', 'Digital Signage, CMS, Quản trị từ xa, Tự phát triển tại Việt Nam, Tối ưu hóa chi phí, Trải nghiệm khách hàng.'),
('Từ né tránh', 'Synergy, Leverage, từ ngữ Corporate quá cứng nhắc hoặc sáo rỗng.'),
('Đối tượng mục tiêu', 'Doanh nghiệp (B2B), chủ chuỗi F&B, quản lý bệnh viện, cửa hàng bán lẻ, khách sạn 3-5 sao.'),
('Câu châm ngôn/Mindset', 'Biến những màn hình vô tri thành công cụ giao tiếp mạnh mẽ và sinh lời.');

-- Add business/product info
INSERT INTO business (title, content) VALUES 
('Sản phẩm chính', 'VNSign Digital Signage - Giải pháp quản trị màn hình tập trung trên nền tảng Cloud.'),
('Thế mạnh', 'Tự phát triển 100% tại Việt Nam, hỗ trợ đa nền tảng (Web, Android, Tizen, WebOS, Windows), hoạt động tốt ngay cả khi mất mạng (Offline mode).'),
('Khách hàng mục tiêu', 'Chuỗi quán cafe, nhà hàng cần hiển thị menu điện tử và bệnh viện cần quản lý số thứ tự/thông báo.');

-- Add knowledge info
INSERT INTO knowledge (title, content) VALUES 
('Lợi ích Digital Signage', 'Giúp tăng 30% doanh thu thông qua hiển thị món ăn hấp dẫn và giảm 50% chi phí in ấn decal/menu truyền thống.'),
('Digital Signage là gì', 'Hệ thống màn hình hiển thị quảng cáo, thông tin tập trung, được điều khiển từ xa thông qua phần mềm CMS.');
