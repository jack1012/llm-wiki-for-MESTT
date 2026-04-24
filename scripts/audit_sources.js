const fs = require('fs');
const path = require('path');
const sourcesDir = 'wiki/sources';
const files = fs.readdirSync(sourcesDir).filter(f => f.endsWith('.md'));

let emptyOrStubFiles = [];
let improperlyNamedFiles = [];

files.forEach(file => {
    // Check 1: Naming anomalies
    // Good format: summary-YYYY-Author-Title.md
    // Bad format: contains "--", "()", space after dash, missing author, missing title
    const badNameRegex = /--|\(|\)| \.md|  /;
    const structRegex = /^summary-\d{4}-.+-.+\.md$/;
    
    if (!structRegex.test(file) || badNameRegex.test(file)) {
        improperlyNamedFiles.push(file);
    }
    
    // Check 2: Empty or Stub content
    const content = fs.readFileSync(path.join(sourcesDir, file), 'utf8');
    if (content.includes('journal: "TBD"') || 
        content.includes('[Entities to be extracted') ||
        content.length < 800) {
        
        emptyOrStubFiles.push(file);
    }
});

console.log('=== AUDIT RESULTS ===');
console.log(`1. Improperly Named Files (${improperlyNamedFiles.length}):`);
improperlyNamedFiles.forEach(f => console.log('   - ' + f));

console.log(`\n2. Empty or Stub Files (Awaiting Upgrade) (${emptyOrStubFiles.length}):`);
emptyOrStubFiles.slice(0, 20).forEach(f => console.log('   - ' + f));
if(emptyOrStubFiles.length > 20) console.log(`   ... and ${emptyOrStubFiles.length - 20} more.`);
