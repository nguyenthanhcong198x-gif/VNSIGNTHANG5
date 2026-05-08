import os

input_dir = "/Users/thanhcong/Desktop/My brain/VNSIGN AI/VNSign-Strategy"
output_html = "/Users/thanhcong/Desktop/My brain/VNSIGN AI/brain/VNSign_TongHop_H1_2025_TNR.html"

md_files = [
    "target_audience.md",
    "features.md",
    "pricing_model.md",
    "roadmap.md",
    "vnsign_ideas.md"
]

html_content = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    body {
        font-family: "Times New Roman", Times, serif !important;
        font-size: 14pt;
        line-height: 1.6;
        color: #000;
        margin: 40px auto;
        max-width: 800px;
        padding: 0 20px;
        white-space: pre-wrap;
    }
    h1 {
        font-size: 24pt;
        text-align: center;
        margin-bottom: 20px;
    }
</style>
</head>
<body>
<h1>BÁO CÁO TỔNG HỢP VNSIGN AI (H1 - 2025)</h1><br><hr><br>
"""

full_md = ""
for file in md_files:
    path = os.path.join(input_dir, file)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            full_md += f.read() + "\n\n----------------------------------------\n\n"

html_content += full_md + "</body></html>"

with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Saved HTML to {output_html}")
