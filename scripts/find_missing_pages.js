const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'd:/llm-wiki-en/wiki';
const SOURCES_DIR = path.join(WIKI_DIR, 'sources');
const CARDS_DIR = path.join(WIKI_DIR, 'cards');
const CONCEPTS_DIR = path.join(WIKI_DIR, 'concepts');

const mentionedCards = new Set();
const mentionedConcepts = new Set();

// 1. Scan summaries for links
const summaries = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
summaries.forEach(file => {
    const content = fs.readFileSync(path.join(SOURCES_DIR, file), 'utf8');
    
    // Extract [[card-*]]
    const cardMatches = content.match(/\[\[(card-[^\]|]+)\]\]/g);
    if (cardMatches) {
        cardMatches.forEach(m => mentionedCards.add(m.replace('[[', '').replace(']]', '').trim()));
    }

    // Extract [[wiki/concepts/*]] or [[Concept Name]] in specific sections
    // This is trickier, let's look for concepts in "Extracted Concepts" section
    const conceptSection = content.split('## Extracted Concepts')[1] || '';
    const conceptMatches = conceptSection.match(/\[\[([^\]|]+)\]\]/g);
    if (conceptMatches) {
        conceptMatches.forEach(m => {
            let name = m.replace('[[', '').replace(']]', '').trim();
            if (name.startsWith('wiki/concepts/')) name = name.replace('wiki/concepts/', '');
            mentionedConcepts.add(name);
        });
    }
});

// 2. Check existence
const missingCards = [];
mentionedCards.forEach(card => {
    const filePath = path.join(CARDS_DIR, card + '.md');
    if (!fs.existsSync(filePath)) {
        missingCards.push(card);
    }
});

const missingConcepts = [];
mentionedConcepts.forEach(concept => {
    const filePath = path.join(CONCEPTS_DIR, concept + '.md');
    if (!fs.existsSync(filePath)) {
        missingConcepts.push(concept);
    }
});

console.log('--- MISSING CARDS ---');
missingCards.sort().forEach(c => console.log(c));
console.log('\n--- MISSING CONCEPTS ---');
missingConcepts.sort().forEach(c => console.log(c));
