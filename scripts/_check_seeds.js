const fs = require('fs');
const path = require('path');
const cardsDir = 'D:/llm-wiki-en/wiki/cards';

const files = fs.readdirSync(cardsDir);
const seeds = [];

files.forEach(f => {
    if (!f.endsWith('.md')) return;
    const content = fs.readFileSync(path.join(cardsDir, f), 'utf8');
    if (content.includes('status: seed')) {
        seeds.push({ name: f, content });
    }
});

console.log(`Total seed cards: ${seeds.length}`);
seeds.forEach(s => console.log(' -', s.name));
