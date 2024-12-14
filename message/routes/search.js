// routes/search.js
const fs = require('fs');
const path = require('path');

// 处理搜索请求
function handleSearch(req, res) {
    const { query } = req.body;

    if (!query) {
        return res.status(400).send('请输入搜索关键词');
    }

    // 数据存放路径
    const dataDir = path.join(__dirname, '..', 'data', 'class');

    let searchResults = [];

    // 遍历所有文件夹
    fs.readdir(dataDir, (err, folders) => {
        if (err) {
            return res.status(500).send('无法读取数据文件夹');
        }

        let folderCount = 0;
        let totalFolders = folders.length;

        folders.forEach((folder) => {
            const folderPath = path.join(dataDir, folder);
            
            // 确保只处理文件夹
            if (fs.statSync(folderPath).isDirectory()) {
                // 遍历文件夹中的所有文件
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        return res.status(500).send('无法读取文件');
                    }

                    // 过滤出所有 JSON 文件
                    const jsonFiles = files.filter(file => file.endsWith('.json'));

                    jsonFiles.forEach((file) => {
                        const filePath = path.join(folderPath, file);

                        // 读取每个 JSON 文件的内容
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                return res.status(500).send('无法读取文件内容');
                            }

                            try {
                                const jsonData = JSON.parse(data);

                                // 检查是否包含查询关键词（这里假设你要根据课程名称进行搜索）
                                if (jsonData['課程名稱'] && jsonData['課程名稱'].includes(query)) {
                                    searchResults.push(jsonData);
                                }
                            } catch (e) {
                                console.error('JSON 解析失败:', e);
                            }

                            folderCount++;
                            // 当所有文件都处理完时，返回搜索结果
                            if (folderCount === totalFolders * jsonFiles.length) {
                                res.json(searchResults);
                            }
                        });
                    });
                });
            }
        });
    });
}

module.exports = { handleSearch };
