import json
from bs4 import BeautifulSoup

# 獲取用戶輸入
weeko = input("Week: ")
classo = input("Class: ")

# 構造文件名
input_filename = f"data{weeko}_{classo}.txt"
output_filename = f"data{weeko}_{classo}_c.json"

# 讀取txt文件的內容
with open(input_filename, "r", encoding="utf-8") as file:
    html_content = file.read()

# 解析HTML內容
soup = BeautifulSoup(html_content, 'html.parser')
# 找到所有符合條件的行
rows = soup.find_all("tr", class_=["tdWhite", "tdGrayLight"])

# 提取指定的資料
extracted_data = []
for index, row in enumerate(rows):
    cells = row.find_all("td")
    # 確保每行至少有17個單元格，缺少的欄位值設置為空字串
    data = {
        "序號": cells[0].get_text(strip=True) if len(cells) > 0 else "",
        "學期": cells[1].get_text(strip=True) if len(cells) > 1 else "",
        "課號": cells[2].get_text(strip=True) if len(cells) > 2 else "",
        "課名": cells[3].get_text(strip=True) if len(cells) > 3 else "",
        "開課單位": cells[4].get_text(strip=True) if len(cells) > 4 else "",
        "年級班別": cells[5].get_text(strip=True) if len(cells) > 5 else "",
        "授課老師": cells[6].get_text(strip=True) if len(cells) > 6 else "",
        "老師單位": cells[7].get_text(strip=True) if len(cells) > 7 else "",
        "全程英語": cells[8].get_text(strip=True) if len(cells) > 8 else "",
        "學分": cells[9].get_text(strip=True) if len(cells) > 9 else "",
        "選別": cells[10].get_text(strip=True) if len(cells) > 10 else "",
        "人數": cells[11].get_text(strip=True) if len(cells) > 11 else "",
        "人數限制上限": cells[12].get_text(strip=True).split('／')[0] if len(cells) > 12 else "",
        "人數限制下限": cells[12].get_text(strip=True).split('／')[1] if len(cells) > 12 else "",
        "實習": cells[13].get_text(strip=True) if len(cells) > 13 else "",
        "時數": cells[14].get_text(strip=True) if len(cells) > 14 else "",
        "合開": cells[15].get_text(strip=True) if len(cells) > 15 else "",
        "期限": cells[16].get_text(strip=True) if len(cells) > 16 else "",
    }
    extracted_data.append(data)
    
    if len(cells) < 17:
        seq_num = cells[0].get_text(strip=True) if len(cells) > 0 else "未知"
        print(f"序號 {seq_num} 的行單元格數量不足：{len(cells)}")

# 將結果保存到JSON文件
with open(output_filename, "w", encoding="utf-8") as json_file:
    json.dump(extracted_data, json_file, ensure_ascii=False, indent=4)

print(f"數據已保存到 {output_filename}")
