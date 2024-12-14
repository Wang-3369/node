const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// 密码文件路径
const passwordFile = path.join(__dirname, '..', 'data', 'password.json');
const saltRounds = 10; // 盐值的复杂度

// 处理登录请求
function handleLogin(req, res) {
    const { username, password } = req.body;

    // 检查用户名和密码是否提供
    if (!username || !password) {
        return res.status(400).send('用户名和密码是必填项');
    }

    // 读取密码文件
    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('无法读取密码文件');
        }

        try {
            const users = JSON.parse(data);

            // 查找用户
            const user = users.find(u => u.username === username);
            if (user) {
                // 验证密码
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // 登录成功
                        return res.send('登录成功');
                    } else {
                        // 密码错误
                        return res.status(401).send('用户名或密码错误');
                    }
                });
            } else {
                // 用户不存在
                return res.status(401).send('用户名或密码错误');
            }
        } catch (e) {
            console.error('JSON 解析失败:', e);
            return res.status(500).send('服务器错误');
        }
    });
}

// 处理注册请求
function handleRegister(req, res) {
    const { username, password } = req.body;

    // 检查用户名和密码是否提供
    if (!username || !password) {
        return res.status(400).send('用户名和密码是必填项');
    }

    // 读取密码文件
    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('无法读取密码文件');
        }

        try {
            const users = JSON.parse(data);

            // 检查用户名是否已存在
            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                return res.status(400).send('用户名已存在');
            }

            // 使用 bcrypt 加密密码
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('密码加密失败');
                }

                // 将新用户添加到用户列表
                users.push({ username, password: hashedPassword });

                // 保存更新后的用户列表到文件
                fs.writeFile(passwordFile, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        return res.status(500).send('无法保存用户信息');
                    }

                    return res.send('注册成功');
                });
            });
        } catch (e) {
            console.error('JSON 解析失败:', e);
            return res.status(500).send('服务器错误');
        }
    });
}

module.exports = { handleLogin, handleRegister };
