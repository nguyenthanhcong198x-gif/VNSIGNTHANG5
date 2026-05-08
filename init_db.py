import sqlite3

def init_db():
    conn = sqlite3.connect('brain.db')
    cursor = conn.cursor()

    # Create tables
    tables = ['knowledge', 'business', 'brand_voice']
    for table in tables:
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {table} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

    # Sample data
    sample_data = {
        'knowledge': [
            ('Học về SQLite', 'SQLite là một hệ quản trị cơ sở dữ liệu nhẹ, không cần server.'),
            ('Insight khách hàng', 'Khách hàng thích sự đơn giản và hiệu quả.')
        ],
        'business': [
            ('Sản phẩm A', 'Khóa học xây dựng bộ não thứ 2.'),
            ('Khách hàng VIP', 'Nguyễn Văn A - Đã mua khóa học nâng cao.')
        ],
        'brand_voice': [
            ('Tone giọng', 'Gần gũi, chân thành.'),
            ('Mục tiêu', 'Giúp người mới bắt đầu dễ tiếp cận hơn.')
        ]
    }

    for table, rows in sample_data.items():
        # Check if table already has data
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        if cursor.fetchone()[0] == 0:
            for title, content in rows:
                cursor.execute(f"INSERT INTO {table} (title, content) VALUES (?, ?)", (title, content))

    conn.commit()
    conn.close()
    print("Database 'brain.db' đã được tạo và khởi tạo dữ liệu mẫu thành công!")

if __name__ == "__main__":
    init_db()
