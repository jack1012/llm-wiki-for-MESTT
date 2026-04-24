const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';

const mapping = {
    'card-2019-劉宏麟-findings': 'card-2019-陶宏麟-研究發現',
    'card-2019-劉宏麟-problem': 'card-2019-陶宏麟-研究問題'
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
            
            // Fix text "劉宏麟" to "陶宏麟"
            if (content.includes('劉宏麟')) {
                content = content.split('劉宏麟').join('陶宏麟');
                changed = true;
            }
            
            if (changed) {
                console.log(`✅ Fixed name/links in: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walkDir(WIKI_DIR);
console.log('--- NAME FIX COMPLETE ---');
