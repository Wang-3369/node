// 確保 DOM 元素完全加載
document.addEventListener("DOMContentLoaded", () => {
    // 表單提交處理
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.querySelector('form[action="/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 搜尋功能
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
});

// 登入表單提交處理
function handleLogin(event) {
    event.preventDefault();  // 防止表單默認提交行為

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("用戶名和密碼是必填項！");
        return;
    }

    // 使用 Fetch API 提交登入表單
    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('登入成功');
            window.location.href = '/home'; // 成功後跳轉到首頁
        } else {
            alert('登入失敗');
        }
    })
    .catch(error => {
        console.error('錯誤:', error);
        alert('伺服器錯誤，請稍後再試');
    });
}

// 註冊表單提交處理
function handleRegister(event) {
    event.preventDefault();  // 防止表單默認提交行為

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        alert("所有字段均為必填項！");
        return;
    }

    if (password !== confirmPassword) {
        alert("密碼和確認密碼不匹配！");
        return;
    }

    // 使用 Fetch API 提交註冊表單
    fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('註冊成功！');
            window.location.href = '/login'; // 註冊後跳轉到登入頁面
        } else {
            alert('註冊失敗');
        }
    })
    .catch(error => {
        console.error('錯誤:', error);
        alert('伺服器錯誤，請稍後再試');
    });
}

// 搜尋功能
function handleSearch() {
    const teacher = document.getElementById('teacher').value;
    const courseName = document.getElementById('courseName').value;
    const courseCode = document.getElementById('courseCode').value;
    const courseTime = document.getElementById('courseTime').value;
    const department = document.getElementById('department').value;

    // 在這裡根據輸入的條件來構造搜尋 API 的 URL 或請求
    const query = new URLSearchParams({
        teacher, courseName, courseCode, courseTime, department
    }).toString();

    // 這是示範，實際情況會根據具體後端 API 進行調整
    fetch(`/api/search?${query}`)
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => {
        console.error('搜尋錯誤:', error);
        alert('搜尋失敗');
    });
}

// 顯示搜尋結果
function displayResults(data) {
    const resultContainer = document.getElementById('resultContainer').querySelector('tbody');
    resultContainer.innerHTML = ''; // 清空結果區域

    if (data && data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.teacher}</td>
                <td>${item.courseName}</td>
                <td>${item.courseCode}</td>
                <td>${item.courseTime}</td>
                <td>${item.department}</td>
            `;
            resultContainer.appendChild(row);
        });
    } else {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = `<td colspan="5" style="text-align:center;">沒有找到相關結果</td>`;
        resultContainer.appendChild(noResultsRow);
    }
}
