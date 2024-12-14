const express = require('express');
const path = require('path');
const { handleLogin, handleRegister } = require('./routes/auth');
const { handleSearch } = require('./routes/search');
const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 解析 POST 请求的 body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

// 登录和注册请求处理
app.post('/login', handleLogin);
app.post('/register', handleRegister);

// 搜索请求处理
app.post('/search', handleSearch);

// 404 错误页面
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
});

// 启动服务器
const port = 8088;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
