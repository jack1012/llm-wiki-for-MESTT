const fs = require('fs');
const path = require('path');

const cardsDir = 'wiki/cards';

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(cardsDir, file);
        try {
            const buffer = fs.readFileSync(filePath);
            let content = buffer.toString('utf8');
            
            // 1. 修復 YAML Tags: 移除括號內的 #
            // 將 tags: [#A, #B] 變為 tags: [A, B]
            content = content.replace(/tags:\s*\[(.*?)\]/g, (match, p1) => {
                const cleanedTags = p1.replace(/#/g, '').trim();
                return `tags: [${cleanedTags}]`;
            });
            
            // 2. 刪除所有含有 {{title}} 的整行內容
            const lines = content.split(/\r?\n/);
            const filteredLines = lines.filter(line => !line.includes('{{title}}'));
            content = filteredLines.join('\r\n');
            
            // 3. 深度清洗與「標題重建」 (Restoring corrupted headers)
            content = content.replace(/\ufffd/g, ''); 
            content = content.replace(/##\s+.*?概念/g, '## 核心概念 (Core Concept: English Body)');
            content = content.replace(/> 一.*?概念/g, '> 一卡一概念：一張卡片只談一個概念，避免混雜。');
            content = content.replace(/##\s+.*?個人思考/g, '## 個人思考與關聯 (Reflection)');
            content = content.replace(/- \*\*啟發.*?想法\*\*/g, '- **啟發與想法**');
            content = content.replace(/- \*\*知識.*?缺口\*\*/g, '- **知識缺口**');
            content = content.replace(/- \*\*評論\*\*/g, '- **評論**');
            
            // 4. 通用去垢（移除其餘不明亂碼）
            content = content.replace(/\?\?+題】/g, '');
            content = content.replace(/[^\x00-\x7F\u4e00-\u9fa5\s\p{P}「」『』【】（）]/gu, ''); 
            
            // 4. 強制寫回標準 UTF-8
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Cleaned & Standardized: ${file}`);
        } catch (err) {
            console.error(`Error on ${file}: ${err.message}`);
        }
    }
});
