const fs = require('fs');
const path = require('path');

const cardsDir = 'wiki/cards';
let fixedCount = 0;

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(cardsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const originalContent = content;
        
        // 極致修復：針對 PowerShell 產生的各種亂碼殘骸
        content = content.replace(/title: ".*題】/g, 'title: "');
        content = content.replace(/title: .*題】/g, 'title: ');
        content = content.replace(/# Card: .*題】/g, '# Card: ');
        content = content.replace(/## .*題】/g, '## ');
        
        // 針對特定出現的亂碼模式
        content = content.replace(/\?+題】/g, '');
        content = content.replace(/【標題】/g, '');
        content = content.replace(/題】/g, ''); // 處理可能的不可見編碼殘骸
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
        }
    }
});

console.log(`Successfully restored ${fixedCount} cards to clean academic format.`);
