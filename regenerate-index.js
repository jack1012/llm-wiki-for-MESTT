#!/usr/bin/env node

/**
 * REGENERATE WIKI/INDEX.MD
 *
 * Purpose: Create comprehensive index registering all 338 sources + 770 cards
 * Method: Scan directories and generate structured index
 */

const fs = require('fs');
const path = require('path');

const WIKI_DIR = 'D:\\llm-wiki-en\\wiki';
const SOURCES_DIR = path.join(WIKI_DIR, 'sources');
const CARDS_DIR = path.join(WIKI_DIR, 'cards');
const CONCEPTS_DIR = path.join(WIKI_DIR, 'concepts');
const ENTITIES_DIR = path.join(WIKI_DIR, 'entities');
const SYNTHESES_DIR = path.join(WIKI_DIR, 'syntheses');

console.log('📋 PHASE 1: Scanning directories...\n');

// Scan sources
const sources = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''))
  .sort();

// Scan cards
const cards = fs.readdirSync(CARDS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''))
  .sort();

// Scan concepts
const concepts = fs.readdirSync(CONCEPTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''))
  .filter(f => f !== 'index')
  .sort();

// Scan entities
const entities = fs.readdirSync(ENTITIES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''))
  .filter(f => f !== 'index')
  .sort();

// Scan syntheses
const syntheses = fs.readdirSync(SYNTHESES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''))
  .sort();

console.log(`✅ Scanned directories:`);
console.log(`   Sources: ${sources.length}`);
console.log(`   Cards: ${cards.length}`);
console.log(`   Concepts: ${concepts.length}`);
console.log(`   Entities: ${entities.length}`);
console.log(`   Syntheses: ${syntheses.length}\n`);

// ============================================================================
// PHASE 2: GENERATE INDEX MARKDOWN
// ============================================================================

console.log('📝 PHASE 2: Generating index markdown...\n');

const indexLines = [
  '---',
  'title: "Global Index - LLM-Wiki for MESTT"',
  `last_updated: 2026-04-22`,
  '---',
  '',
  '# Global Index',
  '',
  '## 📚 Sources (V5_Atomic)',
  `Total: ${sources.length} papers across 1973-2024`,
  '',
];

// Group sources by decade
const sourcesByDecade = {};
sources.forEach(source => {
  const match = source.match(/summary-(\d{4})-/);
  if (match) {
    const year = parseInt(match[1]);
    const decade = Math.floor(year / 10) * 10;
    if (!sourcesByDecade[decade]) sourcesByDecade[decade] = [];
    sourcesByDecade[decade].push(source);
  }
});

Object.keys(sourcesByDecade)
  .sort()
  .reverse()
  .forEach(decade => {
    indexLines.push(`### ${decade}s`);
    sourcesByDecade[decade].forEach(source => {
      indexLines.push(`- [[${source}]]`);
    });
    indexLines.push('');
  });

// Cards section
indexLines.push('## 🃏 Atomic Research Cards');
indexLines.push(`Total: ${cards.length} cards`);
indexLines.push('');
indexLines.push('### Card Index (by Type)');
indexLines.push('');

// Separate cards by type
const autoCards = cards.filter(c => c.includes('-concept-'));
const otherCards = cards.filter(c => !c.includes('-concept-'));

if (autoCards.length > 0) {
  indexLines.push(`#### Auto-Generated Cards (${autoCards.length})`);
  autoCards.forEach(card => {
    indexLines.push(`- [[${card}]]`);
  });
  indexLines.push('');
}

if (otherCards.length > 0) {
  indexLines.push(`#### Manual Research Cards (${otherCards.length})`);
  otherCards.forEach(card => {
    indexLines.push(`- [[${card}]]`);
  });
  indexLines.push('');
}

// Concepts section
indexLines.push('## 💡 Concepts');
indexLines.push(`Total: ${concepts.length} concepts`);
indexLines.push('');

// Group concepts by first letter
const conceptsByLetter = {};
concepts.forEach(concept => {
  const firstLetter = concept.charAt(0).toUpperCase();
  if (!conceptsByLetter[firstLetter]) conceptsByLetter[firstLetter] = [];
  conceptsByLetter[firstLetter].push(concept);
});

Object.keys(conceptsByLetter).sort().forEach(letter => {
  indexLines.push(`### ${letter}`);
  conceptsByLetter[letter].forEach(concept => {
    indexLines.push(`- [[${concept}]]`);
  });
  indexLines.push('');
});

// Entities section
indexLines.push('## 👥 Entities');
indexLines.push(`Total: ${entities.length} entities (researchers, institutions, journals)`);
indexLines.push('');

// Group entities
const researchers = entities.filter(e =>
  !e.includes('University') && !e.includes('Institution') && !e.includes('Journal') && !e.includes('Center') && !e.includes('School')
);
const institutions = entities.filter(e =>
  e.includes('University') || e.includes('Institution') || e.includes('Center') || e.includes('School')
);
const journals = entities.filter(e =>
  e.includes('Journal') || e.includes('Mathematics') && e.includes('Education')
);

if (researchers.length > 0) {
  indexLines.push(`### Researchers (${researchers.length})`);
  researchers.slice(0, 50).forEach(r => {
    indexLines.push(`- [[${r}]]`);
  });
  if (researchers.length > 50) {
    indexLines.push(`... and ${researchers.length - 50} more`);
  }
  indexLines.push('');
}

if (institutions.length > 0) {
  indexLines.push(`### Institutions (${institutions.length})`);
  institutions.slice(0, 30).forEach(i => {
    indexLines.push(`- [[${i}]]`);
  });
  if (institutions.length > 30) {
    indexLines.push(`... and ${institutions.length - 30} more`);
  }
  indexLines.push('');
}

if (journals.length > 0) {
  indexLines.push(`### Journals (${journals.length})`);
  journals.forEach(j => {
    indexLines.push(`- [[${j}]]`);
  });
  indexLines.push('');
}

// Syntheses section
if (syntheses.length > 0) {
  indexLines.push('## 📊 Syntheses & Maps');
  indexLines.push(`Total: ${syntheses.length} comprehensive analyses`);
  indexLines.push('');
  syntheses.forEach(s => {
    indexLines.push(`- [[${s}]]`);
  });
  indexLines.push('');
}

// Footer
indexLines.push('---');
indexLines.push('[[wiki/index|🏠 Return to Wiki Home]]');
indexLines.push('');

const indexContent = indexLines.join('\n');

// ============================================================================
// PHASE 3: WRITE INDEX FILE
// ============================================================================

console.log('💾 PHASE 3: Writing index file...\n');

const indexPath = path.join(WIKI_DIR, 'index.md');
fs.writeFileSync(indexPath, indexContent, 'utf8');

console.log('✅ Index file written');
console.log(`   Path: ${indexPath}`);
console.log(`   Size: ${indexContent.length} bytes`);
console.log(`   Lines: ${indexLines.length}\n`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('📊 INDEX REGENERATION SUMMARY');
console.log('================================');
console.log(`✅ Sources registered: ${sources.length}`);
console.log(`✅ Cards registered: ${cards.length}`);
console.log(`✅ Concepts indexed: ${concepts.length}`);
console.log(`✅ Entities indexed: ${entities.length}`);
console.log(`✅ Syntheses linked: ${syntheses.length}`);
console.log(`\n🎉 Total pages in index: ${sources.length + cards.length + concepts.length + entities.length + syntheses.length}\n`);

console.log('✨ Index regeneration complete!');
