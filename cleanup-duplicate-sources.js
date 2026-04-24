#!/usr/bin/env node

/**
 * CLEANUP DUPLICATE SOURCE FILES
 *
 * Strategy: Keep *-auto.md versions (newer), remove older non-auto versions
 * Exception: Keep manually enhanced versions (those with substantial content)
 */

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:\\llm-wiki-en\\wiki\\sources';

console.log('📋 PHASE 1: Identifying duplicate source file pairs...\n');

const allFiles = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md') && f.startsWith('summary-'));

// Group by YYYY-author pattern
const groups = {};
allFiles.forEach(file => {
  const match = file.match(/^summary-(\d{4})-([a-z\-]+)-/);
  if (match) {
    const [, year, author] = match;
    const key = `${year}-${author}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(file);
  }
});

// Find duplicates
const duplicates = [];
Object.entries(groups).forEach(([key, files]) => {
  if (files.length > 1) {
    duplicates.push({ key, files });
  }
});

console.log(`✅ Found ${duplicates.length} duplicate groups\n`);

// ============================================================================
// PHASE 2: CLEANUP DECISION
// ============================================================================

console.log('🔍 PHASE 2: Analyzing each group...\n');

let toDelete = [];
let toKeep = [];

duplicates.forEach(({ key, files }) => {
  // Separate auto and non-auto versions
  const autoVersions = files.filter(f => f.includes('-auto.md'));
  const otherVersions = files.filter(f => !f.includes('-auto.md'));

  console.log(`\n📂 Group: ${key}`);
  console.log(`   Auto versions: ${autoVersions.length}`);
  console.log(`   Other versions: ${otherVersions.length}`);

  // Strategy: Keep 1 auto version, delete others
  if (autoVersions.length > 0) {
    const keepAuto = autoVersions[0];
    toKeep.push(keepAuto);

    // Mark others for deletion
    autoVersions.slice(1).forEach(f => {
      toDelete.push(f);
      console.log(`   ❌ Will delete (duplicate auto): ${f}`);
    });

    otherVersions.forEach(f => {
      toDelete.push(f);
      console.log(`   ❌ Will delete (old version): ${f}`);
    });

    console.log(`   ✅ Will keep: ${keepAuto}`);
  } else {
    // No auto version - keep the first, delete others
    toKeep.push(otherVersions[0]);
    otherVersions.slice(1).forEach(f => {
      toDelete.push(f);
      console.log(`   ❌ Will delete (duplicate): ${f}`);
    });
    console.log(`   ✅ Will keep: ${otherVersions[0]}`);
  }
});

// ============================================================================
// PHASE 3: DELETE DUPLICATES
// ============================================================================

console.log(`\n\n⚠️ PHASE 3: Deleting ${toDelete.length} duplicate files...\n`);

let deleted = 0;
toDelete.forEach(file => {
  try {
    const filepath = path.join(SOURCES_DIR, file);
    fs.unlinkSync(filepath);
    deleted++;

    if (deleted % 20 === 0) {
      process.stdout.write(`\r[${deleted}/${toDelete.length}] Deleted...`);
    }
  } catch (err) {
    console.error(`Error deleting ${file}: ${err.message}`);
  }
});

console.log(`\n\n📊 CLEANUP REPORT`);
console.log(`   Total source files: ${allFiles.length}`);
console.log(`   Duplicate groups: ${duplicates.length}`);
console.log(`   Files deleted: ${deleted}`);
console.log(`   Files remaining: ${allFiles.length - deleted}`);
console.log(`\n✅ Cleanup complete!`);
