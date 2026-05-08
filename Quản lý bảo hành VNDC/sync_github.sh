#!/bin/bash

# Configuration
PROJECT_DIR="/Users/thanhcong/Desktop/My brain/Quản lý bảo hành VNDC"
LOG_FILE="$PROJECT_DIR/sync_log.txt"

cd "$PROJECT_DIR" || exit

echo "--- Sync started at $(date) ---" >> "$LOG_FILE"

# Add all changes
git add . >> "$LOG_FILE" 2>&1

# Commit if there are changes
if ! git diff-index --quiet HEAD --; then
    git commit -m "Auto update: $(date)" >> "$LOG_FILE" 2>&1
    
    # Push to GitHub
    git push origin main >> "$LOG_FILE" 2>&1
    
    if [ $? -eq 0 ]; then
        echo "Sync successful!" >> "$LOG_FILE"
    else
        echo "Sync failed! Check your connection or credentials." >> "$LOG_FILE"
    fi
else
    echo "No changes to commit." >> "$LOG_FILE"
fi

echo "--------------------------------" >> "$LOG_FILE"
