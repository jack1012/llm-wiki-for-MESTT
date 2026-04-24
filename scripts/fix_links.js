const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'wiki/sources';
const WIKI_DIR = 'wiki';

// 1. Build a robust map
let fileMap = {};
fs.readdirSync(SOURCES_DIR).forEach(f => {
    if (!f.endsWith('.md')) return;
    const content = fs.readFileSync(path.join(SOURCES_DIR, f), 'utf8');
    const tMatch = content.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/);
    const yMatch = content.match(/year:\s*(\d{4})/);
    if (tMatch && yMatch) {
        const title = tMatch[1].toLowerCase();
        const year = yMatch[1];
        fileMap[f.replace('.md', '')] = { title, year };
    }
});

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            const linkRegex = /\[\[(summary-.*?)(\|.*?)?\]\]/g;
            content = content.replace(linkRegex, (match, p1, p2) => {
                const oldName = p1;
                // If the file actually exists, don't change it!
                if (fs.existsSync(path.join(SOURCES_DIR, oldName + '.md'))) {
                    return match;
                }

                // If broken, find best match based on year and part of the name
                const yearMatch = oldName.match(/(\d{4})/);
                if (!yearMatch) return match;
                const year = yearMatch[1];
                
                for (let [newName, info] of Object.entries(fileMap)) {
                    if (info.year === year) {
                        // Check if the oldName (broken) contains key authors or words from the newName
                        const oldParts = oldName.toLowerCase().split('-');
                        const newParts = newName.toLowerCase().split('-');
                        const intersection = oldParts.filter(x => newParts.includes(x) && x !== 'summary' && x !== year);
                        
                        if (intersection.length >= 2) {
                            console.log(`Precise Fix: ${oldName} -> ${newName} in ${file}`);
                            return `[[${newName}${p2 || ''}]]`;
                        }
                    }
                }
                return match;
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}

walk(WIKI_DIR);
console.log('Precise Link Fix Complete.');
