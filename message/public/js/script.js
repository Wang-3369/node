document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton'); // 搜索按鈕
    const resultsContainer = document.getElementById('resultsTable'); // 顯示結果的區域

    // 獲取所有查詢輸入框
    const inputs = {
        '授課老師': document.getElementById('teacher'),
        '課程名稱': document.getElementById('courseName'),
        '課號': document.getElementById('courseCode'),
        '節數': document.getElementById('courseTime'),
        '開課單位': document.getElementById('department'),
        '教室': document.getElementById('location')
    };

    // 確保按鈕存在
    if (searchButton) {
        searchButton.addEventListener('click', function (event) {
            event.preventDefault(); // 防止表單自動提交
            localStorage.removeItem('searchResults');
            const query = {};

            // 收集輸入框的值
            for (const [key, input] of Object.entries(inputs)) {
                if (input) {
                    const value = input.value.trim();
                    if (value) {
                        query[key] = value;
                    }
                }
            }

            if (Object.keys(query).length === 0) {
                alert("請輸入至少一個搜索關鍵詞");
                return;
            }

            // 發起 fetch 請求到伺服器
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query) // 發送查詢條件
            })
                .then(response => response.json()) // 解析 JSON 響應
                .then(data => {
                    const tbody = resultsContainer.querySelector('tbody');
                    tbody.innerHTML = ""; // 清空當前的搜索結果

                    if (data.message) {
                        tbody.innerHTML = "<tr><td colspan='6'>" + data.message + "</td></tr>";
                    } else if (data.length === 0) {
                        tbody.innerHTML = "<tr><td colspan='6'>沒有找到相關課程</td></tr>";
                    } else {
                        // 存儲所有課程資料的陣列
                        const courses = [];

                        // 使用 Promise.all 來處理所有的教室查詢
                        const classroomPromises = data.map(item => {
                            return fetch('/mapsearch', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ '教室': item['教室'] }) // 發送教室查詢
                            })
                                .then(response => response.json()) // 解析 JSON 響應
                                .then(mapData => {
                                    const iframeContent = mapData.iframe;
                                    const classroomLink = `<button id="showMapBtn" class="map-btn" data-iframe="${encodeURIComponent(iframeContent)}">${item['教室']}</button>`;

                                    // 插入行資料
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${item['節數']}</td>
                                        <td>${item['星期']}</td>
                                        <td>${item['課程名稱']}</td>
                                        <td>${item['課號']}</td>
                                        <td>${item['開課單位']}</td>
                                        <td>${classroomLink}</td>
                                    `;
                                    tbody.appendChild(row);
                                    const detailLink = row.querySelector('.map-btn');
                                    detailLink.addEventListener('click', function(event) {
                                        event.preventDefault();
                                        const iframeData = this.getAttribute('data-iframe'); // 獲取 iframe 資料
                                        const courseDetails = encodeURIComponent(JSON.stringify(item)); // 將課程資訊轉換為 JSON 並編碼
                                        // 跳轉到 detail 頁面，並附加課程資訊
                                        window.location.href = `/detail?iframe=${iframeData}&courseDetails=${courseDetails}`;
                                    });
                                    
                                    // 添加到課程陣列，方便存到 localStorage
                                    courses.push({
                                        節數: item['節數'],
                                        星期: item['星期'],
                                        課程名稱: item['課程名稱'],
                                        課號: item['課號'],
                                        開課單位: item['開課單位'],
                                        教室: item['教室'] // 原始教室名稱（不包含連結）
                                    });
                                })
                                .catch(error => {
                                    console.error('Error fetching map data:', error.message);
                                    // 错误处理，确保渲染一个空的链接或默认的链接
                                });
                        });

                        // 等待所有教室查询完成
                        Promise.all(classroomPromises)
                            .then(() => {
                                // 將課程資料存儲到 localStorage
                                localStorage.setItem('searchResults', JSON.stringify(courses));
                                alert('搜索結果已保存到 localStorage');
                            })
                            .catch(error => {
                                console.error('Error processing search results:', error.message);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error.message);
                    alert('無法獲取數據，請稍後再試'); // 彈出錯誤資訊
                });
        });
    } else {
        console.error("搜索按鈕沒有找到！");
    }
});
