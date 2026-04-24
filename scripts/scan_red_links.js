const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const SOURCES_DIR = path.join(WIKI_DIR, 'sources');

const redLinks = [];

// Get all files in wiki to check existence
function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(file.replace('.md', '').toLowerCase());
        }
    });
    return results;
}

const allExistingFiles = new Set(getAllFiles(WIKI_DIR));

const summaries = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));

summaries.forEach(file => {
    const content = fs.readFileSync(path.join(SOURCES_DIR, file), 'utf8');
    const links = content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g);
    
    if (links) {
        links.forEach(link => {
            let target = link.replace('[[', '').replace(']]', '').split('|')[0].trim();
            // Handle subdirectories in links
            const basename = path.basename(target).toLowerCase();
            
            if (!allExistingFiles.has(basename) && !target.includes('http') && !target.includes('index')) {
                redLinks.push({
                    source: file,
                    target: target
                });
            }
        });
    }
});

console.log('--- RED LINKS FOUND ---');
redLinks.forEach(rl => {
    // Only show interesting ones (cards, concepts)
    if (rl.target.startsWith('card-') || !rl.target.includes('/')) {
        console.log(`[${rl.source}] -> [[${rl.target}]]`);
    }
});
