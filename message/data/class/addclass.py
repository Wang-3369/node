import json
import os

def add_classroom_to_all_json(folder_path):
    # 遍歷資料夾中的所有文件
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            file_path = os.path.join(folder_path, filename)
            # 提取文件名稱，去掉擴展名
            classroom_name = os.path.splitext(filename)[0]
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            # 檢查數據結構，確保是列表
            if isinstance(data, list):
                for record in data:
                    if "教室" not in record:
                        record["教室"] = classroom_name
            else:
                print(f"Unexpected data format in {file_path}")
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(data, file, ensure_ascii=False, indent=4)

# 從用戶輸入獲取資料夾路徑
folder_path = input("請輸入資料夾路徑: ")
add_classroom_to_all_json(folder_path)
