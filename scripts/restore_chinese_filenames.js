const fs = require('fs');
const path = require('path');

const DIR = 'wiki/sources';

fs.readdirSync(DIR).forEach(file => {
    if (!file.endsWith('.md')) return;
    
    const fullPath = path.join(DIR, file);
    let content;
    try {
        content = fs.readFileSync(fullPath, 'utf8');
    } catch (e) { return; }

    const yamlMatch = content.match(/^---([\s\S]*?)---/);
    if (yamlMatch) {
        const yamlStr = yamlMatch[1];
        const titleMatch = yamlStr.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/);
        const yearMatch = yamlStr.match(/year:\s*(\d{4})/);
        const authorMatch = yamlStr.match(/author:\s*["']?(.*?)["']?(\r?\n|$)/);

        if (titleMatch && yearMatch) {
            const title = titleMatch[1];
            const year = yearMatch[1];
            let author = authorMatch ? authorMatch[1].split(',')[0].trim() : '未知';
            
            // Explicitly restore Chinese author names for government bodies
            if (author.toLowerCase().includes('moe')) author = '教育部';
            if (author.toLowerCase().includes('control yuan')) author = '監察院';
            if (author.toLowerCase().includes('naer')) author = '國家教育研究院';

            // Check if title or author has Chinese
            if (/[\u4e00-\u9fa5]/.test(title) || /[\u4e00-\u9fa5]/.test(author)) {
                // Sanitize title but keep Chinese
                let cleanTitle = title.replace(/[\\\/:*?"<>|]/g, '-').trim();
                let newName = `summary-${year}-${author}-${cleanTitle}.md`;
                
                const newPath = path.join(DIR, newName);
                if (file !== newName) {
                    console.log(`Restoring Full Chinese: ${file} -> ${newName}`);
                    // If target exists, try to avoid collision
                    if (fs.existsSync(newPath)) {
                        newName = `summary-${year}-${author}-${cleanTitle}-v2.md`;
                    }
                    fs.renameSync(fullPath, path.join(DIR, newName));
                }
            }
        }
    }
});
