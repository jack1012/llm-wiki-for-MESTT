const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const mapping = JSON.parse(fs.readFileSync('d:/llm-wiki-en/scripts/rename_mapping.json', 'utf8') || '{}');

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
                if (oldName === newName) continue;
                
                // Match [[oldName]]
                if (content.includes(`[[${oldName}]]`)) {
                    content = content.split(`[[${oldName}]]`).join(`[[${newName}]]`);
                    changed = true;
                }
                // Match [[oldName|alias]]
                if (content.includes(`[[${oldName}|`)) {
                    content = content.split(`[[${oldName}|`).join(`[[${newName}|`);
                    changed = true;
                }
            }
            
            if (changed) {
                console.log(`✅ Synced links in: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

console.log(`🔍 Starting global link sync for ${Object.keys(mapping).length} renames...`);
walkDir(WIKI_DIR);
console.log('--- GLOBAL SYNC COMPLETE ---');
