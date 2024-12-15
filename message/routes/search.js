const fs = require('fs');
const path = require('path');

// 处理搜索请求
async function handleSearch(req, res) {
    const query = req.body;  // 获取查询条件

    // 数据存放路径
    const dataDir = path.join(__dirname, '..', 'data', 'class');

    let searchResults = [];

    // 确保至少输入一个查询条件
    if (Object.values(query).every(value => value.trim() === '')) {
        return res.status(400).json({ error: "请输入至少一个搜索关键词" });
    }

    try {
        const folders = await fs.promises.readdir(dataDir);  // 使用 promises 处理异步操作

        for (const folder of folders) {
            const folderPath = path.join(dataDir, folder);
            let folderMatchCount = 0;  // 记录每个文件夹匹配的课程数量

            if (fs.statSync(folderPath).isDirectory()) {
                const files = await fs.promises.readdir(folderPath);

                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const filePath = path.join(folderPath, file);
                        const data = await fs.promises.readFile(filePath, 'utf8');

                        try {
                            const jsonData = JSON.parse(data);

                            // 确保 jsonData 是一个数组（课程列表）
                            if (Array.isArray(jsonData)) {
                                for (const course of jsonData) {
                                    const normalizedQuery = Object.fromEntries(
                                        Object.entries(query).map(([key, value]) => [key, value.trim().toLowerCase()])
                                    );

                                    const normalizedData = {
                                        '課號': course['課號'] && course['課號'].trim().toLowerCase(),
                                        '課程名稱': course['課程名稱'] && course['課程名稱'].trim().toLowerCase(),
                                        '開課單位': course['開課單位'] && course['開課單位'].trim().toLowerCase(),
                                        '星期': course['星期'] && course['星期'].trim().toLowerCase(),
                                        '節數': course['節數'] && course['節數'].trim().toLowerCase(),
                                        '授課老師': course['授課老師'] && course['授課老師'].trim().toLowerCase(),
                                        '教室': course['教室'] && course['教室'].trim().toLowerCase()
                                    };

                                    // 根据查询条件包含匹配字段
                                    const match = Object.entries(normalizedQuery).every(([key, value]) => {
                                        if (value === "") return true; // 如果查询条件为空，跳过该字段匹配
                                        return normalizedData[key]?.includes(value) || false; // 包含匹配
                                    });

                                    if (match) {
                                        searchResults.push(course); // 如果匹配，将数据添加到结果中
                                        folderMatchCount++; // 增加该文件夹的匹配课程计数
                                    }
                                }
                            }
                        } catch (e) {
                            // 只输出 JSON 解析失败的错误，而不输出过多调试信息
                            console.error('JSON 解析失败:', e);
                        }
                    }
                }

                // 打印文件夹名称和匹配的课程数量
                console.log(`${folder}: 匹配到 ${folderMatchCount} 个课程`);
            }
        }

        // 如果没有找到相关课程，返回相应的消息
        if (searchResults.length === 0) {
            console.log("没有找到相关课程"); // 确保没有找到时输出
            return res.status(200).json({ message: "没有找到相关课程" });
        }

        // 返回搜索结果
        res.json(searchResults);
    } catch (err) {
        // 只输出读取文件的错误，而不输出过多信息
        console.error('读取文件出错:', err);
        res.status(500).json({ error: "无法读取数据文件夹" });
    }
}

// 导出 handleSearch 函数
module.exports = { handleSearch };
