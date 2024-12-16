const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { handleSearch } = require('./routes/search');
const { handleLogin, handleRegister } = require('./routes/auth');
const { maplink } = require('./routes/mapsearch'); // 引入 maplink 函数
const detailRoute = require('./routes/detail'); // 引入 detail 路由

const app = express();
const port = 3000;

// 中介軟體設置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // 提供靜態檔案服務

// 路由設置
app.post('/login', handleLogin);
app.post('/register', handleRegister);
app.post('/search', handleSearch); // 綁定搜尋路由
app.post('/mapsearch', maplink); // 新增 mapsearch 路由
// 新增 detail 路由
app.use('/', detailRoute); // 掛載 detail 路由
// 首頁路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// 其他頁面路由
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'report.html'));
});


// 错误处理（404）
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在運行於 http://localhost:${port}`);
});
