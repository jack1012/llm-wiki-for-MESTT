const fs = require('fs');
const path = require('path');
const base = 'D:/llm-wiki-en/wiki/sources';
const summaries = fs.readdirSync(base).filter(f => f.startsWith('summary-2021') && /[\u4e00-\u9fff]/.test(f));
console.log('=== 2021 Chinese Summaries ===');
summaries.forEach(f => {
    const c = fs.readFileSync(path.join(base, f), 'utf8');
    const m = c.match(/title: "([^"]+)"/);
    console.log((m ? m[1] : 'NO TITLE') + ' | ' + f.substring(0, 60));
});

console.log('\n=== 2021 Chinese PDFs ===');
const archiveBase = 'D:/llm-wiki-en/raw/09-archive';
const pdfs = fs.readdirSync(archiveBase).filter(f => f.startsWith('2021') && /[\u4e00-\u9fff]/.test(f));
pdfs.forEach(f => console.log(f));
