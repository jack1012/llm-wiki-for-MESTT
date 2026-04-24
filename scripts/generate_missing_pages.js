const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'wiki/sources';
const CARDS_DIR = 'wiki/cards';
const CONCEPTS_DIR = 'wiki/concepts';
const ENTITIES_DIR = 'wiki/entities';

// Ensure directories exist
[CARDS_DIR, CONCEPTS_DIR, ENTITIES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md'));
let missingCount = { cards: 0, concepts: 0, entities: 0 };

files.forEach(file => {
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
    
    // Match [[Link]] or [[Link|Alias]]
    const links = [...content.matchAll(/\[\[(.*?)\]\]/g)].map(m => m[1].split('|')[0].trim());

    links.forEach(link => {
        if (link === 'index' || link === 'wiki/index') return;
        if (link.startsWith('summary-')) return; // ignore other summaries

        // Determine type and target path
        let targetDir = ENTITIES_DIR;
        let fileName = link + '.md';
        let type = 'entity';

        if (link.startsWith('card-') || link.includes('Card') || link.includes('card_')) {
            targetDir = CARDS_DIR;
            type = 'card';
            // clean prefix if needed, but usually we keep it
            fileName = link.replace('wiki/cards/', '') + '.md';
        } else if (link.startsWith('wiki/concepts/') || content.includes(`[[${link}]]`) && content.split(`[[${link}]]`)[0].slice(-20).includes('Concepts')) {
            targetDir = CONCEPTS_DIR;
            type = 'concept';
            fileName = link.replace('wiki/concepts/', '') + '.md';
        }

        // Clean filename for Windows
        fileName = fileName.replace(/[\\\/:*?"<>|]/g, '-');
        const targetPath = path.join(targetDir, fileName);

        if (!fs.existsSync(targetPath)) {
            // Generate basic template
            const title = path.basename(fileName, '.md').replace(/-/g, ' ');
            const template = `---
title: "${title}"
type: ${type}
status: seed
last_updated: ${new Date().toISOString().split('T')[0]}
---

# ${title}

> [!NOTE]
> 此頁面由系統自動生成，為來自文獻分析的原子知識點或核心概念。尚待進一步擴充與合成。

## 核心定義 (Core Definition)
- 

## 關聯文獻 (Related Sources)
- [[${file.replace('.md', '')}]]

## 生涯發展觀點 (Career Perspective)
- 
`;
            fs.writeFileSync(targetPath, template);
            console.log(`[CREATED] ${type}: ${fileName}`);
            missingCount[type + 's']++;
        } else {
            // If exists, just append the source link if it's not there
            let existingContent = fs.readFileSync(targetPath, 'utf8');
            const sourceLink = `[[${file.replace('.md', '')}]]`;
            if (!existingContent.includes(sourceLink) && existingContent.includes('## 關聯文獻')) {
                existingContent = existingContent.replace('## 關聯文獻', `## 關聯文獻\n- ${sourceLink}`);
                fs.writeFileSync(targetPath, existingContent);
            }
        }
    });
});

console.log('--- Missing Pages Generation Complete ---');
console.log(`Created Cards: ${missingCount.cards}`);
console.log(`Created Concepts: ${missingCount.concepts}`);
console.log(`Created Entities: ${missingCount.entities}`);
