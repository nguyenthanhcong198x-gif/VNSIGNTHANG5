-- Create tables
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

-- Sample data for knowledge
INSERT INTO knowledge (title, content) VALUES ('Học về SQLite', 'SQLite là một hệ quản trị cơ sở dữ liệu nhẹ, không cần server.');
INSERT INTO knowledge (title, content) VALUES ('Insight khách hàng', 'Khách hàng thích sự đơn giản và hiệu quả.');

-- Sample data for business
INSERT INTO business (title, content) VALUES ('Sản phẩm A', 'Khóa học xây dựng bộ não thứ 2.');
INSERT INTO business (title, content) VALUES ('Khách hàng VIP', 'Nguyễn Văn A - Đã mua khóa học nâng cao.');

-- Sample data for brand_voice
INSERT INTO brand_voice (title, content) VALUES ('Tone giọng', 'Gần gũi, chân thành.');
INSERT INTO brand_voice (title, content) VALUES ('Mục tiêu', 'Giúp người mới bắt đầu dễ tiếp cận hơn.');
