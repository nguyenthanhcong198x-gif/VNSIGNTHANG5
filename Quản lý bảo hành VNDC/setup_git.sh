#!/bin/bash
PROJECT_DIR="/Users/thanhcong/Desktop/My brain/Quản lý bảo hành VNDC"
REPO_URL="https://github.com/nguyenthanhcong198x-gif/VNSIGNTHANG5"

cd "$PROJECT_DIR" || exit

# Initialize git if not already
if [ ! -d ".git" ]; then
    git init
    git remote add origin "$REPO_URL"
fi

# Set branch to main
git branch -M main

# Add and commit
git add .
git commit -m "Initial push - VNDC Warranty Management"

# Push (this might require user interaction for credentials)
git push -u origin main
