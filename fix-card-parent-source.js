#!/usr/bin/env node

/**
 * FIX CARD PARENT_SOURCE REFERENCES
 *
 * Purpose: Repair 316 broken parent_source references in card files
 * Problem: Cards have parent_source: [[summary-YYYY-author-*]] with wildcard
 * Solution: Match to actual source files and fix references
 */

const fs = require('fs');
const path = require('path');

const CARDS_DIR = 'D:\\llm-wiki-en\\wiki\\cards';
const SOURCES_DIR = 'D:\\llm-wiki-en\\wiki\\sources';

// ============================================================================
// PHASE 1: BUILD SOURCE FILENAME INDEX
// ============================================================================

console.log('📋 PHASE 1: Building source filename index...\n');

const sourceFiles = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md') && f.startsWith('summary-'))
  .reduce((acc, filename) => {
    // Extract YYYY and author from summary-YYYY-author-*.md
    const match = filename.match(/^summary-(\d{4})-([a-z\-]+)-/);
    if (match) {
      const [, year, author] = match;
      const key = `${year}-${author}`;
      acc[key] = filename;
    }
    return acc;
  }, {});

console.log(`✅ Indexed ${Object.keys(sourceFiles).length} source files\n`);

// ============================================================================
// PHASE 2: SCAN CARDS AND FIX REFERENCES
// ============================================================================

console.log('🔧 PHASE 2: Scanning and fixing card files...\n');

const cardFiles = fs.readdirSync(CARDS_DIR)
  .filter(f => f.endsWith('.md'));

let fixed = 0;
let skipped = 0;
let errors = 0;

cardFiles.forEach((cardFile, index) => {
  const cardPath = path.join(CARDS_DIR, cardFile);
  let content = fs.readFileSync(cardPath, 'utf8');

  // Extract current parent_source reference
  const parentMatch = content.match(/parent_source:\s*\[\[([^\]]+)\]\]/);

  if (!parentMatch) {
    skipped++;
    return;
  }

  const currentRef = parentMatch[1];

  // If already fixed (no wildcard), skip
  if (!currentRef.includes('*')) {
    skipped++;
    return;
  }

  // Parse the broken reference: summary-YYYY-author-*
  const refMatch = currentRef.match(/^summary-(\d{4})-([a-z\-]+)-\*$/);
  if (!refMatch) {
    errors++;
    console.log(`⚠️  Cannot parse: ${cardFile} → ${currentRef}`);
    return;
  }

  const [, year, author] = refMatch;
  const key = `${year}-${author}`;

  // Look up correct source filename
  const correctSource = sourceFiles[key];
  if (!correctSource) {
    errors++;
    console.log(`❌ No source found: ${cardFile} → ${key}`);
    return;
  }

  // Extract filename without .md extension for the link
  const correctRef = correctSource.replace('.md', '');
  const newParentSource = `parent_source: [[${correctRef}]]`;

  // Replace in content
  const oldParentSource = parentMatch[0];
  if (oldParentSource !== newParentSource) {
    content = content.replace(oldParentSource, newParentSource);
    fs.writeFileSync(cardPath, content, 'utf8');
    fixed++;

    if (index % 50 === 0) {
      process.stdout.write(`\r[${index}/${cardFiles.length}] Fixed ${fixed} cards...`);
    }
  }
});

console.log(`\n\n✅ PHASE 2 COMPLETE`);
console.log(`   Fixed: ${fixed} cards`);
console.log(`   Skipped: ${skipped} cards (already correct)`);
console.log(`   Errors: ${errors} cards\n`);

// ============================================================================
// PHASE 3: VERIFICATION
// ============================================================================

console.log('✨ PHASE 3: Verifying fixes...\n');

let stillBroken = 0;
cardFiles.forEach(cardFile => {
  const cardPath = path.join(CARDS_DIR, cardFile);
  const content = fs.readFileSync(cardPath, 'utf8');
  const parentMatch = content.match(/parent_source:\s*\[\[([^\]]+)\]\]/);

  if (parentMatch && parentMatch[1].includes('*')) {
    stillBroken++;
    console.log(`❌ Still broken: ${cardFile}`);
  }
});

console.log(`\n📊 VERIFICATION REPORT`);
console.log(`   Total cards: ${cardFiles.length}`);
console.log(`   Fixed: ${fixed}`);
console.log(`   Remaining broken: ${stillBroken}`);
console.log(`   Success rate: ${((fixed / (fixed + stillBroken)) * 100).toFixed(1)}%\n`);

console.log('🚀 Fix operation complete!');
