import os

conv_dirs = [
    '/Users/thanhcong/.gemini/antigravity/brain/a454f0f0-bf6a-4f29-89b1-91e71bc3467f/.system_generated/logs/overview.txt',
    '/Users/thanhcong/.gemini/antigravity/brain/c0ea8b73-c2c3-441d-a975-993c291692df/.system_generated/logs/overview.txt'
]

output_md = '/Users/thanhcong/Desktop/My brain/ToanBoLichSu_MyBrain.md'

with open(output_md, 'w', encoding='utf-8') as outfile:
    outfile.write("# Toàn Bộ Lịch Sử Dự Án: My Brain & VNSign\n\n")
    outfile.write("Tài liệu này tổng hợp lại toàn bộ các trao đổi, tương tác và kết quả đã thực hiện từ đầu đến nay.\n\n")
    
    for log_file in conv_dirs:
        if os.path.exists(log_file):
            outfile.write(f"\n---\n## Từ phiên làm việc: {os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(log_file))))}\n\n")
            with open(log_file, 'r', encoding='utf-8') as infile:
                lines = infile.readlines()
                in_message = False
                for line in lines:
                    if line.startswith("USER:"):
                        outfile.write("\n\n### 🗣 Khách hàng yêu cầu\n")
                        outfile.write(line.replace("USER: ", "> "))
                    elif line.startswith("ASSISTANT:"):
                        outfile.write("\n\n### 🤖 AI Xử lý & Kết quả\n")
                        # The assistant message might be long, so we print the lines until next USER or SYSTEM
                        outfile.write(line.replace("ASSISTANT: ", ""))
                    elif line.startswith("TOOL:") or line.startswith("SYSTEM:"):
                        pass # skip system details to keep it clean
                    else:
                        outfile.write(line)
        else:
            outfile.write(f"\n[Không tìm thấy log: {log_file}]\n")

print("Done generating markdown.")
