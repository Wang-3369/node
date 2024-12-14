import os
import json
from bs4 import BeautifulSoup

def process_file(input_filename):
    # 確定輸出文件名稱，僅改變擴展名為.json
    output_filename = input_filename.rsplit('.', 1)[0] + ".json"

    # 讀取txt文件的內容
    with open(input_filename, "r", encoding="utf-8") as file:
        html_content = file.read()

    # 解析HTML內容
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find("table", {"id": "table2"})
    if table is None:
        print(f"文件 {input_filename} 中找不到表格，跳過處理。")
        return
    
    rows = table.find_all("tr")

    # 提取指定的資料
    data = []
    for row_idx, row in enumerate(rows[1:]):  # 跳過第一行（表頭）
        cells = row.find_all("td")
        period = cells[0].get_text(strip=True)  # 提取節數
        for day_idx, cell in enumerate(cells[1:], 1):
            if cell.find("a"):
                # 獲取每個課程的詳細資訊
                links = cell.find_all("a")
                for link in links:
                    course_text = link.get_text(separator="|").split("|")
                    if len(course_text) == 3:
                        course_name, course_id, department = course_text
                    else:
                        course_name = course_text[0]
                        course_id = course_text[1] if len(course_text) > 1 else ""
                        department = course_text[2] if len(course_text) > 2 else ""

                    course = {
                        "節數": period,
                        "星期": f"星期{day_idx}",
                        "課程名稱": course_name,
                        "課號": course_id,
                        "開課單位": department
                    }
                    data.append(course)

    # 將結果保存到JSON文件
    with open(output_filename, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

    print(f"數據已保存到 {output_filename}")

def process_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".txt"):
                input_filepath = os.path.join(root, file)
                process_file(input_filepath)

# 獲取資料夾路徑
folder_path = input("請輸入資料夾路徑: ")
process_folder(folder_path)
