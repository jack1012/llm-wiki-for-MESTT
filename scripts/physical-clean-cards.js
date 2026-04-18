const fs = require('fs');
const path = require('path');

const cardsDir = 'wiki/cards';

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(cardsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 分割 YAML 與 Body
        const parts = content.split('---\r\n\r\n');
        if (parts.length < 2) return;
        
        const frontmatter = parts[0];
        let body = parts[1];
        
        // 1. 強放重建標題 (如果之前沒成功)
        body = body.replace(/##.*?概念.*/g, '## 核心概念 (Core Concept: English Body)\n> 一卡一概念：一張卡片只談一個概念，避免混雜。\n');
        body = body.replace(/##.*?Reflection.*/g, '## 個人思考與關聯 (Reflection)');
        
        // 2. 修復標籤 (Tags) 裡面的 #
        let fixedFrontmatter = frontmatter.replace(/tags:\s*\[(.*?)\]/g, (match, p1) => {
            const cleanedTags = p1.replace(/#/g, '').replace(/\?/g, '').trim();
            return `tags: [${cleanedTags}]`;
        });

        // 3. 移除損毀的中文字
        let fixedBody = body.replace(/[^\x00-\x7F\u4e00-\u9fa5\s\p{P}「」『』【】（）]*/gu, '');
        fixedBody = fixedBody.replace(/\?+/g, '');

        fs.writeFileSync(filePath, fixedFrontmatter + '---\r\n\r\n' + fixedBody, 'utf8');
        console.log(`Physically Cleaned: ${file}`);
    }
});
