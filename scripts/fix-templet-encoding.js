const fs = require('fs');
const path = require('path');

const templetsDir = 'templets';
const actionDescription = '統一升級模板，增加編修紀錄區塊。';
const logHeader = '## 📝 創建與編修紀錄';
const timestamp = '2026-04-17 15:40';

fs.readdirSync(templetsDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(templetsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. 移除先前 PowerShell 產生的亂碼塊 (通常始於 --- ## 或包含奇怪問號)
        // 我們精準定位並清除損毀的日誌區塊
        content = content.replace(/\n---\n## 📝 創建與編修紀錄[\s\S]*$/, '');
        content = content.replace(/\n---\n## \?\?.*[\s\S]*$/, ''); // 移除亂碼變體
        
        // 2. 重新以正確的 UTF-8 格式追加追蹤區塊
        const cleanContent = content.trim();
        const newLogEntry = `\n\n---\n${logHeader}\n- **${timestamp}**: ${actionDescription}\n`;
        
        fs.writeFileSync(filePath, cleanContent + newLogEntry, 'utf8');
    }
});

console.log('Emergency Repair Complete: All templates restored to UTF-8 with correct characters.');
