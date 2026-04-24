const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const SOURCES_DIR = path.join(WIKI_DIR, 'sources');

function getFirstAuthorSurname(authorStr) {
    if (!authorStr) return 'Unknown';
    // Remove "et al.", citations, etc.
    let clean = authorStr.split(/ et al/i)[0].split('(')[0].trim();
    // Get the first person in a list (split by comma or semicolon)
    let firstPerson = clean.split(/[;]| and /i)[0].trim();
    
    // If "Surname, Firstname" format
    if (firstPerson.includes(',')) {
        return firstPerson.split(',')[0].trim();
    }
    
    // If "Firstname Surname" format, take the last word
    const parts = firstPerson.split(/\s+/);
    return parts[parts.length - 1];
}

function getUltraShortTitle(titleStr) {
    if (!titleStr) return 'Study';
    // Keep only 2-3 most significant words
    let words = titleStr.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    return words.slice(0, 3).join('-');
}

const files = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
const mapping = JSON.parse(fs.readFileSync('d:/llm-wiki-en/scripts/rename_mapping.json', 'utf8') || '{}');

files.forEach(file => {
    const filePath = path.join(SOURCES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const yamlMatch = content.match(/^---\s*\n([\s\S]+?)\n---/);
    if (!yamlMatch) return;
    
    const yaml = yamlMatch[1];
    const authorMatch = yaml.match(/^author:\s*"?(.*?)"?\s*$/m);
    const yearMatch = yaml.match(/^year:\s*(\d{4})\s*$/m);
    const titleMatch = yaml.match(/^title:\s*"?(.*?)"?\s*$/m);
    
    if (authorMatch && yearMatch) {
        const author = authorMatch[1];
        const year = yearMatch[1];
        const title = titleMatch ? titleMatch[1] : '';
        if (/[\u4e00-\u9fa5]/.test(author)) return;
        
        const surname = getFirstAuthorSurname(author);
        const shortTitle = getUltraShortTitle(title);
        
        // Final filename construction
        const newBase = `summary-${year}-${surname}-${shortTitle}`.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-');
        const newFileName = newBase + '.md';
        
        if (file !== newFileName && !file.includes('陶宏麟')) {
            // Check if old name is in mapping (recursive renaming)
            const oldBase = file.replace('.md', '');
            mapping[oldBase] = newBase;
            
            const oldPath = path.join(SOURCES_DIR, file);
            const newPath = path.join(SOURCES_DIR, newFileName);
            
            if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
                fs.renameSync(oldPath, newPath);
                console.log(`✨ Refined: ${file} -> ${newFileName}`);
            }
        }
    }
});

fs.writeFileSync('d:/llm-wiki-en/scripts/rename_mapping.json', JSON.stringify(mapping, null, 2));
console.log('--- REFINED RENAMING COMPLETE ---');
