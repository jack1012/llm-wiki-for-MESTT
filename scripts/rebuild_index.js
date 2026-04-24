const fs = require('fs');
const path = require('path');

const indexFile = 'wiki/index.md';
const folders = ['wiki/concepts', 'wiki/sources', 'wiki/entities', 'wiki/cards'];

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
}

const allItems = {
    Concepts: getFiles('wiki/concepts'),
    Sources: getFiles('wiki/sources'),
    Entities: getFiles('wiki/entities'),
    Cards: getFiles('wiki/cards')
};

let newIndex = `---
title: "Global Index - LLM-Wiki for MESTT"
last_updated: ${new Date().toISOString().split('T')[0]}
---
# Global Index

## 📚 Sources
Total: ${allItems.Sources.length} papers
${allItems.Sources.sort().map(s => `- [[${s}]]`).join('\n')}

## 📇 Atomic Research Cards
Total: ${allItems.Cards.length} cards
${allItems.Cards.sort().map(c => `- [[${c}]]`).join('\n')}

## 🧩 Concepts
Total: ${allItems.Concepts.length} concepts

${generateAlphabeticalList(allItems.Concepts)}

## 👤 Entities
Total: ${allItems.Entities.length} entities
${allItems.Entities.sort().map(e => `- [[${e}]]`).join('\n')}

---
[[index|Back to Index]]
`;

function generateAlphabeticalList(items) {
    const sorted = items.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    const grouped = {};
    sorted.forEach(item => {
        const firstChar = item.charAt(0).toUpperCase();
        const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    let output = '';
    Object.keys(grouped).sort().forEach(key => {
        output += `### ${key}\n`;
        output += grouped[key].map(item => `- [[${item}]]`).join('\n');
        output += '\n\n';
    });
    return output;
}

fs.writeFileSync(indexFile, newIndex);
console.log('Index rebuilt successfully.');
