document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('detailedSearchForm');  // 查詢表單
    const resultsTable = document.getElementById('resultsTable').querySelector('tbody');  // 查詢結果區域

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();  // 阻止表單默認提交

        // 收集表單中的所有查詢條件
        const query = {
            teacher: document.getElementById('teacher').value.trim(),
            courseName: document.getElementById('courseName').value.trim(),
            courseCode: document.getElementById('courseCode').value.trim(),
            courseTime: document.getElementById('courseTime').value.trim(),
            department: document.getElementById('department').value.trim()
        };

        // 去除空值條件
        const validQuery = Object.fromEntries(Object.entries(query).filter(([key, value]) => value !== ''));

        if (Object.keys(validQuery).length === 0) {
            alert("請至少輸入一個查詢條件");
            return;
        }

        // 發送請求到後端
        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validQuery)
        })
        .then(response => response.json())
        .then(data => {
            // 清空現有的結果
            resultsTable.innerHTML = '';

            if (data.length === 0) {
                resultsTable.innerHTML = '<tr><td colspan="5">沒有找到相關課程</td></tr>';
            } else {
                // 展示搜索結果
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item['節數']}</td>
                        <td>${item['星期']}</td>
                        <td>${item['課程名稱']}</td>
                        <td>${item['課號']}</td>
                        <td>${item['開課單位']}</td>
                    `;
                    resultsTable.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("查詢失敗，請稍後再試");
        });
    });
});
