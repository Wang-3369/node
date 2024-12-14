const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const passwordFile = path.join(__dirname, 'data', 'password.json');
const saltRounds = 10;

// 引入 search.js
const { handleSearch } = require('./routes/search');

// 中间件设置
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files like CSS, JS

// 登录处理函数
function handleLogin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('用户名和密码是必填项');
    }

    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('无法读取密码文件');
        }

        try {
            const users = JSON.parse(data);

            const user = users.find(u => u.username === username);
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // 登录成功，返回成功信息
                        res.json({ success: true, username });
                        res.redirect('/');  // 登入成功後跳轉到首頁
                    } else {
                        return res.status(401).send('用户名或密码错误');
                    }
                });
            } else {
                return res.status(401).send('用户名或密码错误');
            }
        } catch (e) {
            console.error('JSON 解析失败:', e);
            return res.status(500).send('服务器错误');
        }
    });
}

// 注册处理函数
function handleRegister(req, res) {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).send('用户名和密码是必填项');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('密码不一致');
    }

    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('无法读取密码文件');
        }

        try {
            const users = JSON.parse(data);

            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                return res.status(400).send('用户名已存在');
            }

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('密码加密失败');
                }

                users.push({ username, password: hashedPassword });

                fs.writeFile(passwordFile, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        return res.status(500).send('无法保存用户信息');
                    }

                    res.redirect('/login');  // 註冊成功後重定向到登入頁
                });
            });
        } catch (e) {
            console.error('JSON 解析失败:', e);
            return res.status(500).send('服务器错误');
        }
    });
}

// 路由设置
app.post('/login', handleLogin);
app.post('/register', handleRegister);

// 搜索路由
app.post('/search', handleSearch);  // 绑定搜索路由

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, 'view', 'login.html');
    console.log('Login page path:', loginPath); // 打印路径确认
    res.sendFile(loginPath);
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'report.html'));
});
// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});
