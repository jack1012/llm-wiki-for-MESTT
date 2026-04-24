#!/usr/bin/env node

/**
 * IDENTIFY DUPLICATE SUMMARIES
 *
 * Find all papers with multiple summary versions
 * Score each version to determine which to keep
 */

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:\\llm-wiki-en\\wiki\\sources';
const PDF_DIR = 'D:\\llm-wiki-en\\raw\\09-archive';

console.log('📋 PHASE 1: Mapping PDF files...\n');

// Get all PDFs and extract author/year
const pdfs = fs.readdirSync(PDF_DIR)
  .filter(f => f.endsWith('.pdf'))
  .sort();

// Parse PDF filenames: YYYY_Author_Title.pdf
const pdfMap = {};
pdfs.forEach(pdf => {
  const match = pdf.match(/^(\d{4})_([A-Za-z\-]+)_(.+)\.pdf$/);
  if (match) {
    const [, year, author, title] = match;
    const key = `${year}-${author}`;
    if (!pdfMap[key]) pdfMap[key] = [];
    pdfMap[key].push(pdf);
  }
});

console.log(`✅ Mapped ${Object.keys(pdfMap).length} unique author-year pairs from ${pdfs.length} PDFs\n`);

// Get all summaries and extract author/year
console.log('📋 PHASE 2: Mapping summary files...\n');

const summaries = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md') && f.startsWith('summary-'))
  .sort();

// Parse summary filenames: summary-YYYY-author-*.md
const summaryMap = {};
summaries.forEach(summary => {
  const match = summary.match(/^summary-(\d{4})-([a-z\-]+)-/);
  if (match) {
    const [, year, author] = match;
    const key = `${year}-${author}`;
    if (!summaryMap[key]) summaryMap[key] = [];
    summaryMap[key].push(summary);
  }
});

console.log(`✅ Mapped ${Object.keys(summaryMap).length} unique author-year pairs from ${summaries.length} summaries\n`);

// ============================================================================
// PHASE 3: FIND DUPLICATES
// ============================================================================

console.log('🔍 PHASE 3: Finding duplicates...\n');

const duplicates = [];
const singletons = [];

Object.entries(summaryMap).forEach(([key, summaryList]) => {
  if (summaryList.length > 1) {
    duplicates.push({ key, summaryList });
  } else {
    singletons.push({ key, summaryList: summaryList[0] });
  }
});

console.log(`📊 Results:`);
console.log(`  - Author-year pairs with 1 summary: ${singletons.length}`);
console.log(`  - Author-year pairs with 2+ summaries: ${duplicates.length}`);
console.log(`  - Total duplicated summaries: ${duplicates.reduce((sum, d) => sum + d.summaryList.length, 0)}\n`);

// ============================================================================
// PHASE 4: QUALITY SCORING
// ============================================================================

console.log('⭐ PHASE 4: Scoring summary quality...\n');

function scoreQuality(filename) {
  const filepath = path.join(SOURCES_DIR, filename);
  const content = fs.readFileSync(filepath, 'utf8');

  let score = 0;

  // Check for completeness
  if (content.match(/^title:/m)) score += 10;
  if (content.match(/^author:/m)) score += 10;
  if (content.match(/^year:/m)) score += 10;
  if (content.match(/^journal:/m)) score += 10;
  if (content.match(/^doi:/m)) score += 5;

  // Check Core Claims depth
  const problematicMatch = content.match(/\*\*Problematic\*\*:\s*(.+?)(?=\n|$)/);
  if (problematicMatch && problematicMatch[1].length > 50) score += 8;

  const rqMatch = content.match(/\*\*Research Problem\*\*:\s*(.+?)(?=\n|$)/);
  if (rqMatch && rqMatch[1].length > 50) score += 8;

  const krMatch = content.match(/\*\*Key Results\*\*:\s*(.+?)(?=\n|$)/);
  if (krMatch && krMatch[1].length > 80) score += 8;

  const methodMatch = content.match(/\*\*Methodology\*\*:\s*(.+?)(?=\n|$)/);
  if (methodMatch && methodMatch[1].length > 40) score += 8;

  // Check Cards
  const cardMatches = content.match(/\[\[wiki\/cards\/[^\]]+\]\]/g);
  if (cardMatches && cardMatches.length >= 2) score += 10;

  // Check Concepts
  if (content.match(/\*\*Concepts\*\*:/)) score += 5;
  const conceptLinks = content.match(/\[\[(?!wiki)/g);
  if (conceptLinks && conceptLinks.length >= 3) score += 5;

  // Check Relations
  if (content.match(/## Relations & Context/)) score += 5;

  // Check Edit log
  if (content.match(/## 創建與編修紀錄/)) score += 3;

  // File size indicator (larger usually means more complete)
  if (content.length > 2000) score += 5;
  if (content.length > 4000) score += 5;

  return score;
}

// ============================================================================
// PHASE 5: RECOMMEND CONSOLIDATION
// ============================================================================

console.log('🎯 PHASE 5: Consolidation recommendations\n');

const consolidationPlan = [];

duplicates.forEach(({ key, summaryList }) => {
  const scored = summaryList.map(filename => ({
    filename,
    score: scoreQuality(filename),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const toDelete = scored.slice(1);

  consolidationPlan.push({
    key,
    best,
    toDelete,
  });
});

// Group by deletion count
const byDeleteCount = {};
consolidationPlan.forEach(item => {
  const count = item.toDelete.length;
  if (!byDeleteCount[count]) byDeleteCount[count] = [];
  byDeleteCount[count].push(item);
});

console.log('重複模式：\n');
Object.keys(byDeleteCount).sort((a, b) => b - a).forEach(count => {
  console.log(`  ${byDeleteCount[count].length} 個作者對有 ${parseInt(count) + 1} 個版本`);
});

console.log('\n詳細建議（前 20 個重複群組）：\n');

consolidationPlan.slice(0, 20).forEach(({ key, best, toDelete }) => {
  console.log(`📂 ${key}`);
  console.log(`  ✅ 保留: ${best.filename} (分數: ${best.score})`);
  toDelete.forEach(d => {
    console.log(`  ❌ 刪除: ${d.filename} (分數: ${d.score})`);
  });
  console.log();
});

if (consolidationPlan.length > 20) {
  console.log(`... 還有 ${consolidationPlan.length - 20} 個重複群組\n`);
}

// ============================================================================
// SUMMARY
// ============================================================================

const totalToDelete = consolidationPlan.reduce((sum, item) => sum + item.toDelete.length, 0);

console.log('📊 統計：');
console.log(`  當前 Summary 個數: ${summaries.length}`);
console.log(`  PDF 個數: ${pdfs.length}`);
console.log(`  重複的 Summary: ${totalToDelete}`);
console.log(`  合併後 Summary 個數: ${summaries.length - totalToDelete}`);
console.log(`  對齐差距: ${pdfs.length - (summaries.length - totalToDelete)} 篇\n`);

// Write consolidation plan
const reportLines = [
  '# Summary 合併計劃',
  `生成時間: 2026-04-22`,
  `當前 Summary: ${summaries.length} 個`,
  `當前 PDF: ${pdfs.length} 個`,
  `需要合併: ${consolidationPlan.length} 個重複群組`,
  `需要刪除: ${totalToDelete} 個文件`,
  `合併後: ${summaries.length - totalToDelete} 個 Summary`,
  '',
  '## 詳細合併清單',
  '',
];

consolidationPlan.forEach(({ key, best, toDelete }) => {
  reportLines.push(`### ${key}`);
  reportLines.push(`**保留 (分數 ${best.score}):** ${best.filename}`);
  reportLines.push(`**刪除 (${toDelete.length} 個):**`);
  toDelete.forEach(d => {
    reportLines.push(`  - ${d.filename} (分數 ${d.score})`);
  });
  reportLines.push('');
});

fs.writeFileSync('D:\\llm-wiki-en\\SUMMARY_CONSOLIDATION_PLAN.md', reportLines.join('\n'), 'utf8');

console.log('✅ 詳細計劃已寫入: SUMMARY_CONSOLIDATION_PLAN.md');
console.log('\n✨ 準備好執行合併了嗎？');
