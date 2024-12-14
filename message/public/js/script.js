document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');  // 搜索按钮
    const resultsContainer = document.getElementById('resultsTable');  // 显示结果的区域

    // 获取所有查询输入框
    const inputs = {
        teacher: document.getElementById('teacher'),
        courseName: document.getElementById('courseName'),
        courseCode: document.getElementById('courseCode'),
        courseTime: document.getElementById('courseTime'),
        department: document.getElementById('department')
    };

    // 确保按钮存在
    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault();  // 防止表单自动提交

            const query = {};

            // 收集输入框的值
            for (const [key, input] of Object.entries(inputs)) {
                if (input) {
                    const value = input.value.trim();
                    if (value) {
                        query[key] = value;
                    }
                }
            }

            if (Object.keys(query).length === 0) {
                alert("请输入至少一个搜索关键词");
                return;
            }

            // 发起 fetch 请求到服务器
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)  // 发送查询条件
            })
            .then(response => response.json())  // 解析 JSON 响应
            .then(data => {
                const tbody = resultsContainer.querySelector('tbody');
                tbody.innerHTML = "";  // 清空当前的搜索结果

                if (data.message) {
                    tbody.innerHTML = "<tr><td colspan='5'>" + data.message + "</td></tr>";
                } else if (data.length === 0) {
                    tbody.innerHTML = "<tr><td colspan='5'>没有找到相关课程</td></tr>";
                } else {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item['節數']}</td>
                            <td>${item['星期']}</td>
                            <td>${item['課程名稱']}</td>
                            <td>${item['課號']}</td>
                            <td>${item['開課單位']}</td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error.message);
                alert(error.message);  // 弹出错误信息
            });
        });
    } else {
        console.error("搜索按钮没有找到！");
    }
});
