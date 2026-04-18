const fs = require('fs');
const path = require('path');

const cardsDir = 'wiki/cards';

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(cardsDir, file);
        try {
            const buffer = fs.readFileSync(filePath);
            let content = buffer.toString('utf8');
            
            const lines = content.split(/\r?\n/);
            const newLines = [];
            
            for (let line of lines) {
                // 1. 跳過所有包含損毀特徵或 {{title}} 的行
                if (line.includes('{{title}}') || line.includes('') || line.includes('??') || line.includes('概念')) {
                    // 如果這行是標題，我們稍後手動補回正確的
                    if (line.trim().startsWith('##')) continue;
                    if (line.trim().startsWith('>')) continue;
                    // 如果這一行只是單純的一兩個問號，也跳過
                    if (line.trim().match(/^\?+$/)) continue;
                }
                newLines.push(line);
            }
            
            // 2. 重新尋找插入點，補回標準標題
            // 我們根據卡片的固定結構（Problem/Method）來定位
            let rebuiltContent = newLines.join('\r\n');
            
            // 補回核心概念標題
            rebuiltContent = rebuiltContent.replace(/(- \*\*Problem\*\*)/, '\r\n## 核心概念 (Core Concept: English Body)\r\n> 一卡一概念：一張卡片只談一個概念，避免混雜。\r\n\r\n$1');
            
            // 補回個人思考標題
            rebuiltContent = rebuiltContent.replace(/(- \*\*啟發)/, '\r\n## 個人思考與關聯 (Reflection)\r\n$1');
            
            // 3. 修復 Tags
            rebuiltContent = rebuiltContent.replace(/tags:\s*\[(.*?)\]/g, (match, p1) => {
                const cleanedTags = p1.replace(/#/g, '').replace(/\?/g, '').trim();
                return `tags: [${cleanedTags}]`;
            });

            // 4. 清除檔案中殘留的單獨問號
            rebuiltContent = rebuiltContent.replace(/\r\n\?\r\n/g, '\r\n');

            fs.writeFileSync(filePath, rebuiltContent, 'utf8');
            console.log(`Reconstructed: ${file}`);
        } catch (err) {
            console.error(`Error on ${file}: ${err.message}`);
        }
    }
});
