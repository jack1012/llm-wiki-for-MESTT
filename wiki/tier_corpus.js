const fs = require('fs');
const path = require('path');

const sourcesDir = 'd:\\llm-wiki-en\\wiki\\sources';
const outputFile = 'd:\\llm-wiki-en\\wiki\\temp_metadata.json';
const tableFile = 'd:\\llm-wiki-en\\wiki\\syntheses\\stt-full-corpus-table.md';

const tier1Authors = [
    'Artigue', 'Gueudet', 'Winslow', 'Tall', 'Di Martino', 'Rach', 'Geisler', 
    'Klymchuk', 'Biehler', 'Nieminen', 'Tall', 'Castela', 'Biza', 'Jaworski'
];

const tier2Keywords = [
    'affect', 'identity', 'institutional', 'bridging', 'transition', 
    'first-year', 'dropout', 'retention', 'praxeological', 'belief'
];

function extractMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    let metadata = { filename };
    
    const idMatch = filename.match(/summary-(\d{4}-.*?)\.md/);
    metadata.id = idMatch ? idMatch[1].toLowerCase() : filename;

    const fmMatch = content.match(/---\s*([\s\S]*?)\s*---/);
    if (fmMatch) {
        const fm = fmMatch[1];
        const authorMatch = fm.match(/author:\s*\"(.*?)\"/);
        const yearMatch = fm.match(/year:\s*(\d{4})/);
        const titleMatch = fm.match(/title:\s*\"(.*?)\"/);
        
        metadata.author = authorMatch ? authorMatch[1] : '資料缺失';
        metadata.year = yearMatch ? yearMatch[1] : '資料缺失';
        metadata.topic = titleMatch ? titleMatch[1] : '資料缺失';
    } else {
        metadata.author = '資料缺失';
        metadata.year = '資料缺失';
        metadata.topic = '資料缺失';
    }

    metadata.problematic = '資料缺失...';
    metadata.method = '資料缺失...';
    metadata.results = '資料缺失...';
    
    const ccMatch = content.match(/## (Core Claims|核心主張).*?\n([\s\S]*?)(?=\n##|\Z)/i);
    if (ccMatch) {
        const cc = ccMatch[2];
        const pMatch = cc.match(/- \*\*(Problematic|問題意識|研究問題)\*\*:\s*([\s\S]*?)(?=\n-|\Z)/);
        const mMatch = cc.match(/- \*\*(Methodology|研究方法|研究設計|審計發現)\*\*:\s*([\s\S]*?)(?=\n-|\Z)/);
        const rMatch = cc.match(/- \*\*(Key Results|關鍵結果|主要發現|主要結果)\*\*:\s*([\s\S]*?)(?=\n-|\Z)/);
        
        if (pMatch) metadata.problematic = pMatch[2].trim().replace(/\n/g, ' ');
        if (mMatch) metadata.method = mMatch[2].trim().replace(/\n/g, ' ');
        if (rMatch) metadata.results = rMatch[2].trim().replace(/\n/g, ' ');
    }

    const isComplete = !metadata.results.includes('資料缺失') && !metadata.problematic.includes('資料缺失');
    metadata.notes = isComplete ? '資料完整' : '資料不完整';
    
    return metadata;
}

function assignTier(m) {
    const author = m.author || '';
    const id = m.id || '';
    const topic = m.topic || '';
    
    if (tier1Authors.some(a => author.includes(a)) || 
        ['2013-gueudet', '2001-artigue', '2023-geisler', '2019-dimartino', '1991-tall', '2023-rach'].some(k => id.includes(k))) {
        return 'Tier 1';
    }
    
    if (tier2Keywords.some(k => topic.toLowerCase().includes(k) || id.includes(k))) {
        return 'Tier 2';
    }
    
    return 'Tier 3';
}

const files = fs.readdirSync(sourcesDir);
const results = files
    .filter(f => f.startsWith('summary-') && f.endsWith('.md'))
    .map(f => extractMetadata(path.join(sourcesDir, f)));

results.sort((a, b) => {
    if (b.year !== a.year) return b.year.localeCompare(a.year);
    return a.author.localeCompare(b.author);
});

let tableContent = `# STT 文獻總表 (Full Corpus Table - Hierarchical Tiers)\n\n`;
tableContent += `| Tier | ID | Author | Year | Topic | Problematic | Method | Results | Notes |\n`;
tableContent += `|:---:|:---|:---|:---|:---|:---|:---|:---|:---|\n`;

results.forEach(m => {
    const tier = assignTier(m);
    const row = [
        tier,
        m.id,
        m.author,
        m.year,
        m.topic,
        m.problematic,
        m.method,
        m.results,
        m.notes
    ];
    const cleanRow = row.map(cell => String(cell).replace(/\|/g, '\\|').replace(/\n/g, ' '));
    tableContent += `| ${cleanRow.join(' | ')} |\n`;
});

fs.writeFileSync(tableFile, tableContent, 'utf-8');
console.log(`Successfully tiered and updated ${results.length} papers.`);
