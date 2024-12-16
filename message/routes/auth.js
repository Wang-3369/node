const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const passwordFile = path.join(__dirname, '..', 'data', 'password.json');
const saltRounds = 10;

// 處理登入請求
// 處理登入請求
function handleLogin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '使用者名稱與密碼為必填項目' });
    }

    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            console.error('無法讀取密碼檔案:', err);
            return res.status(500).json({ success: false, message: '無法讀取密碼檔案' });
        }

        try {
            const users = JSON.parse(data);

            const user = users.find(u => u.username === username);
            if (!user) {
                return res.status(401).json({ success: false, message: '使用者名稱或密碼錯誤' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.error('密碼比對錯誤:', err);
                    return res.status(500).json({ success: false, message: '伺服器錯誤' });
                }

                if (result) {
                    // 登入成功，設置登入狀態
                    res.cookie('loggedIn', 'true');
                    return res.status(200).json({ success: true, message: '登入成功' });
                } else {
                    return res.status(401).json({ success: false, message: '使用者名稱或密碼錯誤' });
                }
            });
        } catch (e) {
            console.error('JSON 解析錯誤:', e);
            return res.status(500).json({ success: false, message: '伺服器錯誤' });
        }
    });
}




// 處理註冊請求
function handleRegister(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('使用者名稱與密碼為必填項目');
    }

    fs.readFile(passwordFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('無法讀取密碼檔案');
        }

        try {
            const users = JSON.parse(data);
            const existingUser = users.find(u => u.username === username);

            if (existingUser) {
                return res.status(400).send('使用者名稱已存在');
            }

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('密碼加密失敗');
                }

                users.push({ username, password: hashedPassword });

                fs.writeFile(passwordFile, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        return res.status(500).send('無法儲存使用者資訊');
                    }

                    return res.send('註冊成功');
                });
            });
        } catch (e) {
            console.error('JSON 解析失敗:', e);
            return res.status(500).send('伺服器錯誤');
        }
    });
}

module.exports = { handleLogin, handleRegister };
