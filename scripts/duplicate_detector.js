const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'wiki/sources';

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function detectDuplicates() {
    const files = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
    let meta = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(SOURCES_DIR, file), 'utf8');
        const yamlMatch = content.match(/^---([\s\S]*?)---/);
        
        if (yamlMatch) {
            const yamlStr = yamlMatch[1];
            const title = (yamlStr.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/) || [])[1];
            const author = (yamlStr.match(/author:\s*["']?(.*?)["']?(\r?\n|$)/) || [])[1];
            const year = (yamlStr.match(/year:\s*(\d{4})/) || [])[1];

            meta.push({
                file,
                title,
                normTitle: normalize(title),
                author: (author || '').split(',')[0].trim(), // First author
                year
            });
        }
    });

    let duplicates = [];
    for (let i = 0; i < meta.length; i++) {
        for (let j = i + 1; j < meta.length; j++) {
            const a = meta[i];
            const b = meta[j];

            // Strategy 1: Title similarity
            const isSameTitle = (a.normTitle === b.normTitle) && a.normTitle !== '';
            
            // Strategy 2: Same Author + Year + Similar Title (partial)
            const isSameAuthorYear = (a.author === b.author && a.year === b.year && a.author !== '');
            const isSimilarTitle = a.normTitle.includes(b.normTitle) || b.normTitle.includes(a.normTitle);

            if (isSameTitle || (isSameAuthorYear && isSimilarTitle)) {
                duplicates.push({
                    pair: [a.file, b.file],
                    reason: isSameTitle ? 'Exact Title Match' : 'Author/Year Match + Similar Title',
                    details: `Year: ${a.year}, Author: ${a.author}`
                });
            }
        }
    }

    console.log(JSON.stringify(duplicates, null, 2));
}

detectDuplicates();
