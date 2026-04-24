const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'wiki/sources';
const TRACKER_PATH = 'scratch/v7_upgrade_tracker.json';

// Function to safely sanitize filenames for Windows
function safeSanitize(str) {
    if (!str) return 'Unknown';
    // Keep only alphanumeric, Chinese characters, spaces, and dots/hyphens
    // Replace EVERYTHING ELSE with a hyphen
    return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\.\-]/g, '-').trim();
}

function truncate(str, maxLen = 40) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen);
}

function getAuthor(authorStr) {
    if (!authorStr) return '未知';
    let author = authorStr.split(',')[0].split(';')[0].split('(')[0].trim();
    author = author.replace(/["']/g, '');
    
    const mapping = {
        'moe': '教育部',
        'control yuan': '監察院',
        'naer': '國家教育研究院',
        'ho wen-lueh': '何溫略',
        'tao hung-lin': '陶宏麟',
        'tseng chung-hsin': '曾中信',
        'kuo-li': '郭忠潔',
        'tai hung-chun': '戴育賢',
        'hung jui-chien': '洪如玉'
    };

    for (const [key, val] of Object.entries(mapping)) {
        if (author.toLowerCase().includes(key)) return val;
    }
    return author;
}

console.log('--- Starting Defensive Chinese Literature Calibration ---');

let tracker = [];
if (fs.existsSync(TRACKER_PATH)) {
    try {
        tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
    } catch (e) { console.error('Tracker read error'); }
}

const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md'));
const renameMap = {}; 

files.forEach(file => {
    const fullPath = path.join(SOURCE_DIR, file);
    
    // Check if file still exists (might have been moved in a previous step)
    if (!fs.existsSync(fullPath)) return;

    let content;
    try {
        content = fs.readFileSync(fullPath, 'utf8');
    } catch (e) {
        console.log(`[SKIP] Could not read ${file}`);
        return;
    }
    
    const yamlMatch = content.match(/^---([\s\S]*?)---/);
    if (!yamlMatch) return;

    const yamlStr = yamlMatch[1];
    const titleMatch = yamlStr.match(/title:\s*["']?([\s\S]*?)["']?(\r?\n|$)/);
    const yearMatch = yamlStr.match(/year:\s*(\d{4})/);
    const authorMatch = yamlStr.match(/author:\s*["']?([\s\S]*?)["']?(\r?\n|$)/);

    if (titleMatch && yearMatch) {
        let title = titleMatch[1].trim();
        const year = yearMatch[1];
        let author = getAuthor(authorMatch ? authorMatch[1] : null);

        // Process if contains Chinese or corrupted
        if (/[\u4e00-\u9fa5]/.test(title) || /[\u4e00-\u9fa5]/.test(author) || /[^\x00-\x7F]/.test(file)) {
            let cleanAuthor = safeSanitize(author);
            let cleanTitle = truncate(safeSanitize(title));
            let newBaseName = `summary-${year}-${cleanAuthor}-${cleanTitle}.md`;
            
            let newName = newBaseName;
            let counter = 1;
            while (fs.existsSync(path.join(SOURCE_DIR, newName)) && newName !== file) {
                newName = newBaseName.replace('.md', `-v${++counter}.md`);
            }

            if (file !== newName) {
                try {
                    console.log(`[RENAME] ${file} -> ${newName}`);
                    fs.renameSync(fullPath, path.join(SOURCE_DIR, newName));
                    renameMap[file] = newName;
                } catch (e) {
                    console.error(`[ERROR] Failed to rename ${file}: ${e.message}`);
                }
            }
        }
    }
});

// Update Tracker
if (Object.keys(renameMap).length > 0) {
    let updatedCount = 0;
    tracker.forEach(item => {
        if (renameMap[item.filename]) {
            item.filename = renameMap[item.filename];
            updatedCount++;
        }
    });
    try {
        fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2));
        console.log(`[TRACKER] Updated ${updatedCount} entries.`);
    } catch (e) { console.error('Tracker write error'); }
}

console.log('--- Calibration Complete ---');
