const fs = require('fs');
const path = require('path');

const indexFile = 'wiki/index.md';
const conceptsDir = 'wiki/concepts';
const sourcesDir = 'wiki/sources';
const entitiesDir = 'wiki/entities';

let content = fs.readFileSync(indexFile, 'utf8');

// Regex for [[Link Name]]
const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

const brokenLinks = [];
const updatedContent = content.replace(linkRegex, (match, p1) => {
    const linkName = p1.trim();
    
    // Check if it's a valid file in any of the directories
    const possiblePaths = [
        path.join(conceptsDir, linkName + '.md'),
        path.join(sourcesDir, linkName + '.md'),
        path.join(entitiesDir, linkName + '.md'),
        path.join('wiki', linkName + '.md')
    ];
    
    const exists = possiblePaths.some(p => fs.existsSync(p));
    
    if (!exists) {
        brokenLinks.push(linkName);
        return `~~[[${linkName}]]~~ (DELETED)`; // Mark for deletion or just return empty
    }
    
    return match;
});

// For cleaning up the list properly, we might want to just remove the lines
const cleanLines = updatedContent.split('\n').filter(line => !line.includes('(DELETED)')).join('\n');

fs.writeFileSync(indexFile, cleanLines);
console.log(`Removed ${brokenLinks.length} broken links from index.md`);
console.log('Broken links:', brokenLinks);
