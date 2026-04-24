const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';

const mapping = {
    '為與延畢之關係-以北部某私立大學為例': 'summary-2019-陶宏麟-課程停修與退學'
};

function walkDir(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;
            
            for (const [oldName, newName] of Object.entries(mapping)) {
                if (content.includes(`[[${oldName}]]`)) {
                    content = content.split(`[[${oldName}]]`).join(`[[${newName}]]`);
                    changed = true;
                }
                if (content.includes(`[[${oldName}|`)) {
                    content = content.split(`[[${oldName}|`).join(`[[${newName}|`);
                    changed = true;
                }
            }
            
            // Also clean up empty links [[]]
            if (content.includes('[[]]')) {
                content = content.split('[[]]').join('');
                changed = true;
            }
            
            if (changed) {
                console.log(`✅ Updated/Cleaned: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walkDir(WIKI_DIR);
console.log('--- GLOBAL CLEANUP COMPLETE ---');
