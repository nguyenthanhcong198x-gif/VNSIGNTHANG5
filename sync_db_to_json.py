import sqlite3
import json
import os

DB_PATH = 'brain.db'
DATA_DIR = 'data'

def sync():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Sync Accounting
    cursor.execute("SELECT data FROM accounting ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    if row:
        with open(os.path.join(DATA_DIR, 'accounting.json'), 'w', encoding='utf-8') as f:
            f.write(row[0])
        print("Synced Accounting DB to JSON")

    # Sync Warranty
    cursor.execute("SELECT data FROM warranty ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    if row:
        with open(os.path.join(DATA_DIR, 'warranty.json'), 'w', encoding='utf-8') as f:
            f.write(row[0])
        print("Synced Warranty DB to JSON")

    conn.close()

if __name__ == "__main__":
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    sync()
