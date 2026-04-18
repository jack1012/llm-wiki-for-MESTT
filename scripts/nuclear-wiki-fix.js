const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.md')) {
            try {
                // 1. 強放讀取為 Buffer (二進位)
                const buffer = fs.readFileSync(fullPath);
                
                // 2. 移除損毀的 UTF-8 位元組序列 (使用 Node.js 的 toString('utf8') 會自動處理)
                let content = buffer.toString('utf8');
                
                // 3. 移除任何可能殘留的亂碼與替代字元 (\ufffd)
                content = content.replace(/\?\?題】/g, '');
                content = content.replace(/\ufffd/g, ''); 
                
                // 4. 統一換行符為 CRLF (適合 Windows 版 Obsidian)
                content = content.replace(/\r?\n/g, '\r\n');
                
                // 5. 強制以 UTF-8 (無 BOM) 重新寫入
                fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
                console.log(`Fixed: ${fullPath}`);
            } catch (err) {
                console.error(`Error fixing ${fullPath}: ${err.message}`);
            }
        }
    });
}

console.log('Starting full wiki encoding sanitation...');
processDirectory('wiki');
console.log('Sanitation complete.');
