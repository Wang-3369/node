const fs = require('fs');
const path = require('path');

// 处理地图搜索请求
async function maplink(req, res) {
    const query = req.body;  // 获取查询条件
    const searchKey = query['教室'];  // 用户输入的教室代号，如 ACTCER 或 CE200
    //console.log('Received:', query);
    //console.log('Received search key:', searchKey); // 调试：输出用户输入的查询条件

    // 提取前三个字母
    const searchPrefix = searchKey.substring(0, 3);  // 获取前三个字母（例如：ACT 或 CE）
    //console.log('Extracted prefix:', searchPrefix); // 调试：查看提取的前三个字母

    // 数据存放路径
    const coursesFilePath = path.join(__dirname, '..', 'data', 'map', 'map.json');
    
    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '無法讀取資料' });
        }
    
        try {
            const parsedData = JSON.parse(data);  // 解析读取的 JSON 数据
            //console.log('Parsed data:', parsedData);  // 调试：查看解析后的数据

            // 查找包含前缀的对象
            let iframeData;
            parsedData.forEach(item => {
                // 获取对象的所有属性（key）
                const keys = Object.keys(item);
                keys.forEach(key => {
                    if (key.startsWith(searchPrefix)) {  // 如果key的前缀与输入匹配
                        iframeData = item[key];
                    }
                });
            });
            
            //console.log('iframeData found:', iframeData); // 调试：查看 iframeData

            if (iframeData) {
                return res.json({ iframe: iframeData });  // 返回对应的 iframe
            } else {
                return res.status(404).json({ message: '未找到匹配的教室' });
            }
    
        } catch (parseError) {
            console.error('資料解析錯誤:', parseError);
            return res.status(500).json({ message: '資料解析錯誤' });
        }
    });
}

// 导出 maplink 函数
module.exports = { maplink };
