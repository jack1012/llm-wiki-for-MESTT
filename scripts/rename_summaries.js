const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const SOURCES_DIR = path.join(WIKI_DIR, 'sources');

function getAuthorSurname(authorStr) {
    if (!authorStr) return 'Unknown';
    // Remove potential citations like (2021) or nicknames in brackets
    let cleanAuthor = authorStr.split('(')[0].trim();
    // Split by comma (if "Surname, Firstname") or space
    if (cleanAuthor.includes(',')) {
        return cleanAuthor.split(',')[0].trim();
    }
    const parts = cleanAuthor.split(' ');
    // Return the last part as surname for English names
    return parts[parts.length - 1];
}

function getShortTitle(titleStr) {
    if (!titleStr) return 'Untitled';
    // Remove special chars and keep first 3-5 words
    let words = titleStr.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    return words.slice(0, 4).join('-');
}

const files = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
const mapping = {};

files.forEach(file => {
    const filePath = path.join(SOURCES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Simple YAML parser
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
        
        // Skip Chinese names for this specific surname logic (they usually have their own convention now)
        if (/[\u4e00-\u9fa5]/.test(author)) return;
        
        const surname = getAuthorSurname(author);
        const shortTitle = getShortTitle(title);
        
        const newFileName = `summary-${year}-${surname}-${shortTitle}.md`.replace(/\s+/g, '-');
        
        if (file !== newFileName && !file.includes('陶宏麟')) {
            mapping[file.replace('.md', '')] = newFileName.replace('.md', '');
            console.log(`📌 Plan: ${file} -> ${newFileName}`);
        }
    }
});

// Now execute renaming
for (const [oldName, newName] of Object.entries(mapping)) {
    const oldPath = path.join(SOURCES_DIR, oldName + '.md');
    const newPath = path.join(SOURCES_DIR, newName + '.md');
    
    if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renamed: ${oldName} -> ${newName}`);
    }
}

// Save mapping for next step (link sync)
fs.writeFileSync(path.join('d:/llm-wiki-en/scripts', 'rename_mapping.json'), JSON.stringify(mapping, null, 2));
console.log('--- RENAMING COMPLETE ---');
