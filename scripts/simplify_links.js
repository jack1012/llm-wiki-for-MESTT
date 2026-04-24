const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';

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
            
            // Regex to match [[wiki/concepts/Name]] or [[wiki/entities/Name]]
            const regex = /\[\[wiki\/(concepts|entities)\/(.+?)\]\]/g;
            
            if (regex.test(content)) {
                content = content.replace(regex, (match, type, name) => {
                    // Extract name, handle aliases if any (though path-based usually don't have them in the path part)
                    return `[[${name}]]`;
                });
                changed = true;
            }
            
            if (changed) {
                console.log(`✨ Simplified links in: ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walkDir(WIKI_DIR);
console.log('--- LINK SIMPLIFICATION COMPLETE ---');
