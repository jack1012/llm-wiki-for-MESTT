const fs = require('fs');
const path = require('fs');
const pathMod = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const SOURCES_DIR = pathMod.join(WIKI_DIR, 'sources');

function checkFileExists(link) {
    // Basic link resolution
    let cleanLink = link.replace('[[', '').replace(']]', '').split('|')[0].trim();
    
    let filePath;
    if (cleanLink.startsWith('card-')) {
        filePath = pathMod.join(WIKI_DIR, 'cards', cleanLink + '.md');
    } else if (cleanLink.startsWith('wiki/concepts/')) {
        filePath = pathMod.join('d:/llm-wiki-en', cleanLink + '.md');
    } else if (cleanLink.startsWith('wiki/entities/')) {
        filePath = pathMod.join('d:/llm-wiki-en', cleanLink + '.md');
    } else if (cleanLink.includes('/')) {
        // Handle other relative paths
        filePath = pathMod.join('d:/llm-wiki-en', cleanLink + '.md');
    } else {
        // Generic concept or entity in current dir context? 
        // Usually concepts/entities are in their folders.
        // Let's check concepts, then entities, then cards.
        const possiblePaths = [
            pathMod.join(WIKI_DIR, 'concepts', cleanLink + '.md'),
            pathMod.join(WIKI_DIR, 'entities', cleanLink + '.md'),
            pathMod.join(WIKI_DIR, 'cards', cleanLink + '.md')
        ];
        return possiblePaths.some(p => fs.existsSync(p));
    }
    
    return fs.existsSync(filePath);
}

const summaries = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
let missingReport = [];

summaries.forEach(file => {
    const content = fs.readFileSync(pathMod.join(SOURCES_DIR, file), 'utf8');
    const links = content.match(/\[\[.+?\]\]/g) || [];
    
    let missingInFile = [];
    links.forEach(link => {
        if (link.includes('index') || link.includes('summary-')) return; // Skip these for now
        
        if (!checkFileExists(link)) {
            missingInFile.push(link);
        }
    });
    
    if (missingInFile.length > 0) {
        missingReport.push({ file, missing: missingInFile });
    }
});

console.log('--- MISSING ASSETS REPORT ---');
missingReport.forEach(r => {
    console.log(`[${r.file}] -> ${r.missing.join(', ')}`);
});
