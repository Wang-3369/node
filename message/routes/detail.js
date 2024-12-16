const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/detail', (req, res) => {
    const iframe = req.query.iframe; // 獲取 iframe 參數
    const courseDetails = req.query.courseDetails ? JSON.parse(decodeURIComponent(req.query.courseDetails)) : null; // 解析課程詳細資料

    if (!iframe || !courseDetails) {
        return res.status(400).send('缺少 iframe 或課程資訊');
    }

    // 解析節數和星期
    const weekMapping = {
        "星期1": "01", "星期2": "02", "星期3": "03", "星期4": "04",
        "星期5": "05", "星期6": "06", "星期7": "07"
    };
    
    // 根據節數格式提取節次數字
    const periodMapping = {
        "第一節08:20~09:10":"01",
        "第二節09:20~10:10":"02",
        "第三節10:20~11:10":"03",
        "第四節11:15~12:05":"04",
        "第五節12:10~13:00":"05",
        "第六節13:10~14:00":"06",
        "第七節14:10~15:00":"07",
        "第八節15:10~16:00": "08",
        "第九節16:05~16:55":"09",
        "第十節17:30~18:20":"10"
    };

    const weekday = weekMapping[courseDetails['星期']];
    const period = periodMapping[courseDetails['節數']] || "00"; // 默認節數為 "00" 以防找不到對應的節數

    // 根據星期和節次來構造檔案名稱
    const filename = `data${weekday}_${period}_c.json`;
    const dataDir = path.join(__dirname,'..', 'data'); // 假設資料夾位於當前目錄下的 'data' 目錄
    const filePath = path.join(dataDir, `week${weekday}`, filename);

    // 檢查檔案是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`檔案不存在: ${filePath}`);
            // 如果找不到檔案，顯示課程詳細資料
            return res.send(`
                <!DOCTYPE html>
                <html lang="zh-TW">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>課程詳細資訊</title>
                    <style>
                        /* 全局樣式設定 */
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            overflow-y: auto; /* 允許頁面垂直滾動 */
                            box-sizing: border-box;
                        }

                        h1 {
                            font-size: 2rem;
                            color: #444;
                            margin-bottom: 20px;
                        }

                        #map-container {
                            width: 80%;
                            max-width: 1000px;
                            height: 550px;
                            background-color: #e0e0e0;
                            border: 2px solid #ccc;
                            border-radius: 10px;
                            overflow: hidden;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .course-info {
                            margin-top: 20px;
                            font-size: 1.2rem;
                            color: #333;
                            width:60%;
                            max-height: 300px; /* 限制課程資訊的顯示高度 */
                            overflow-y: auto; /* 當內容超過時出現滾動條 */
                        }

                        .back-button {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            text-decoration: none;
                            margin-top: 20px;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: background-color 0.3s;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <h1>課程詳細資訊</h1>
                    <div id="map-container">
                        ${iframe} <!-- 插入地圖 -->
                    </div>
                    <div class="course-info">
                        <h2>課程資訊</h2>
                        <p><strong>節數:</strong> ${courseDetails.節數}</p>
                        <p><strong>星期:</strong> ${courseDetails.星期}</p>
                        <p><strong>課程名稱:</strong> ${courseDetails.課程名稱}</p>
                        <p><strong>課號:</strong> ${courseDetails.課號}</p>
                        <p><strong>開課單位:</strong> ${courseDetails.開課單位}</p>
                        <p><strong>教室:</strong> ${courseDetails.教室}</p>
                    </div>
                    <a href="/" class="back-button">返回首頁</a>
                </body>
                </html>
            `);
        }

        // 如果檔案存在，合併資料
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(`讀取檔案錯誤: ${filePath}`);
                return res.send('無法讀取檔案');
            }
            const courseData = JSON.parse(data);
            const matchingCourse = courseData.find(course => course.課號 === courseDetails.課號);  // 使用 courseData 來尋找課程
            if (!matchingCourse) {
                return res.status(404).send('課程資料未找到');
            }
            const mergedData = { ...courseDetails, ...matchingCourse }; // 確保合併資料時不丟失星期、教室、節數

            res.send(`
                <!DOCTYPE html>
                <html lang="zh-TW">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>課程詳細資訊</title>
                    <style>
                        /* 全局樣式設定 */
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            overflow-y: auto; /* 允許頁面垂直滾動 */
                            box-sizing: border-box;
                        }

                        h1 {
                            font-size: 2rem;
                            color: #444;
                            margin-bottom: 20px;
                        }

                        #map-container {
                            width: 80%;
                            max-width: 1000px;
                            height: 550px;
                            background-color: #e0e0e0;
                            border: 2px solid #ccc;
                            border-radius: 10px;
                            overflow: hidden;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .course-info {
                            margin-top: 20px;
                            font-size: 1.2rem;
                            color: #333;
                            width:60%;
                            max-height: 300px; /* 限制課程資訊的顯示高度 */
                            overflow-y: auto; /* 當內容超過時出現滾動條 */
                        }

                        .back-button {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            text-decoration: none;
                            margin-top: 20px;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: background-color 0.3s;
                        }

                        .back-button:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <h1>課程詳細資訊</h1>
                    <div id="map-container">
                        ${iframe} <!-- 插入地圖 -->
                    </div>
                    <div class="course-info">
                        <h2>課程資訊</h2>
                        <p><strong>節數:</strong> ${courseDetails.節數}</p>
                        <p><strong>星期:</strong> ${courseDetails.星期}</p>
                        <p><strong>課程名稱:</strong> ${mergedData.課名}</p>
                        <p><strong>課號:</strong> ${mergedData.課號}</p>
                        <p><strong>開課單位:</strong> ${mergedData.開課單位}</p>
                        <p><strong>授課老師:</strong> ${mergedData.授課老師}</p>
                        <p><strong>學分:</strong> ${mergedData.學分}</p>
                        <p><strong>人數限制:</strong> ${mergedData.人數限制上限} - ${mergedData.人數限制下限}</p>
                        <p><strong>時數:</strong> ${mergedData.時數}</p>
                        <p><strong>教室:</strong> ${courseDetails.教室}</p>
                    </div>
                    <a href="/" class="back-button">返回首頁</a>
                </body>
                </html>
            `);
        });
    });
});

module.exports = router;
