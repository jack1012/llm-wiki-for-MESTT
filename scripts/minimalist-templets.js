const fs = require('fs');
const path = require('path');

const templetsDir = 'templets';

// 擴大範圍：涵蓋幾乎所有 Emoji 字符區塊
const emojiRegex = /[\u{1F000}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

fs.readdirSync(templetsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(templetsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. 徹底移除 Emojis
        content = content.replace(emojiRegex, '');
        
        // 2. 清理標題前方遺留的多餘空格 (例如 '##  核心' 改為 '## 核心')
        content = content.replace(/##\s+/g, '## ');
        
        // 3. 確保結尾乾淨
        content = content.trim();
        content = content.replace(/\n---\n## .*創建與編修紀錄[\s\S]*$/, '');
        
        const finalContent = content + '\n\n---\n## 創建與編修紀錄\n- **2026-04-17 15:45**: 執行模板極簡化優化，移除所有非必要圖示與視覺冗餘。\n';
        
        fs.writeFileSync(filePath, finalContent, 'utf8');
    }
});

console.log('Deep Clean Complete: All stray emojis (including brain icons) have been removed.');
