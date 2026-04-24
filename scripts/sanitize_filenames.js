const fs = require('fs');
const path = require('path');

const DIR = 'wiki/sources';

function smartSlugify(author, title, year) {
    let a = author.toLowerCase();
    let t = title.toLowerCase();
    
    let slugA = 'unknown';
    if (a.includes('教育部')) slugA = 'moe';
    else if (a.includes('監察院')) slugA = 'control-yuan';
    else if (a.includes('國家教育研究院')) slugA = 'naer';
    else {
        slugA = a.replace(/[^\w\s-]/g, '').trim().split(/\s+/)[0];
    }

    // Keep numbers in title (important for years like 106, 108)
    let slugT = t.replace(/[^\w\s-]/g, ' ')
                 .trim()
                 .split(/\s+/)
                 .slice(0, 5)
                 .join('-');

    return `summary-${year}-${slugA}-${slugT}`.toLowerCase().replace(/-+/g, '-');
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));
let count = {};

files.forEach(file => {
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
            const year = yearMatch[1];
            const author = authorMatch ? authorMatch[1] : 'unknown';
            const title = titleMatch[1];
            
            let baseName = smartSlugify(author, title, year);
            
            if (!count[baseName]) {
                count[baseName] = 1;
            } else {
                count[baseName]++;
                baseName += `-${count[baseName]}`;
            }

            let newName = `${baseName}.md`;
            const newPath = path.join(DIR, newName);

            if (file !== newName) {
                console.log(`Smart Rename: ${file} -> ${newName}`);
                fs.renameSync(fullPath, newPath);
            }
        }
    }
});
