const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';

const mapping = {
    'summary-2021-陶宏麟-雙二一與學業規避': 'summary-2021-陶宏麟-雙二一與規避行為',
    'summary-2021-陶宏麟-大學雙二一退學制度與學生規避退學行為': 'summary-2021-陶宏麟-雙二一與規避行為',
    'summary-2021-陶宏麟-大學生課程停修分析及其與退學及延畢之關係-以北部某私立大學為例': 'summary-2019-陶宏麟-課程停修與退學',
    'summary-2019-劉宏麟-大學生課程停修分析及其與退學及延畢之關係': 'summary-2019-陶宏麟-課程停修與退學'
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
            
            if (changed) {
                console.log(`✅ Updated links in: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walkDir(WIKI_DIR);
console.log('--- TAO LINK SYNC COMPLETE ---');
