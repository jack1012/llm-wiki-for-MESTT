#!/usr/bin/env node

/**
 * SOURCE FILE QUALITY AUDIT
 *
 * Purpose: Assess all 338 source files against V5_Atomic standard
 * Output: Detailed quality report with scoring and optimization priorities
 */

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:\\llm-wiki-en\\wiki\\sources';

// V5_Atomic Standard Checklist
const CRITERIA = {
  'YAML.title': { weight: 1, test: (content) => /^title:/.test(content) },
  'YAML.author': { weight: 1, test: (content) => /^author:/.test(content) },
  'YAML.year': { weight: 1, test: (content) => /^year:/.test(content) },
  'YAML.journal': { weight: 1, test: (content) => /^journal:/.test(content) },
  'YAML.tags': { weight: 1, test: (content) => /^tags:/.test(content) },
  'YAML.doi': { weight: 0.5, test: (content) => /^doi:/.test(content) },
  'YAML.sources': { weight: 1, test: (content) => /^sources:/.test(content) },
  'Core.Problematic': { weight: 2, test: (content) => /## Core Claims[\s\S]*?\*\*Problematic\*\*:/.test(content) },
  'Core.ResearchProblem': { weight: 2, test: (content) => /\*\*Research Problem\*\*:/.test(content) },
  'Core.KeyResults': { weight: 2, test: (content) => /\*\*Key Results\*\*:/.test(content) },
  'Core.Methodology': { weight: 2, test: (content) => /\*\*Methodology\*\*:/.test(content) },
  'Cards.Present': { weight: 3, test: (content) => /## Atomic Knowledge[\s\S]*?\[\[wiki\/cards\//.test(content) },
  'Cards.Count': { weight: 2, test: (content) => {
    const matches = content.match(/\[\[wiki\/cards\/[^\]]+\]\]/g);
    return matches && matches.length >= 2;
  }},
  'Concepts.Present': { weight: 2, test: (content) => /## Extracted Concepts.*?\*\*Concepts\*\*:[\s\S]*?\[\[/.test(content) },
  'Entities.Present': { weight: 2, test: (content) => /\*\*Entities\*\*:[\s\S]*?\[\[/.test(content) },
  'Relations.Present': { weight: 1, test: (content) => /## Relations & Context/.test(content) },
  'EditLog.Present': { weight: 1, test: (content) => /## 創建與編修紀錄/.test(content) },
};

console.log('📋 PHASE 1: Scanning all source files...\n');

const files = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md') && f.startsWith('summary-'))
  .sort();

console.log(`✅ Found ${files.length} source files\n`);

// ============================================================================
// PHASE 2: AUDIT EACH FILE
// ============================================================================

console.log('🔍 PHASE 2: Auditing files against V5_Atomic standard...\n');

const results = [];

files.forEach((file, index) => {
  const filepath = path.join(SOURCES_DIR, file);
  const content = fs.readFileSync(filepath, 'utf8');

  // Score each criterion
  const scores = {};
  let totalScore = 0;
  let maxScore = 0;

  Object.entries(CRITERIA).forEach(([criterion, { weight, test }]) => {
    const passed = test(content);
    scores[criterion] = passed ? weight : 0;
    totalScore += passed ? weight : 0;
    maxScore += weight;
  });

  const percentage = (totalScore / maxScore * 100).toFixed(1);

  // Extract metadata
  const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
  const yearMatch = content.match(/^year:\s*(\d{4})/m);
  const authorMatch = content.match(/^author:\s*"([^"]+)"/m);

  results.push({
    filename: file,
    title: titleMatch ? titleMatch[1] : 'N/A',
    year: yearMatch ? yearMatch[1] : 'N/A',
    author: authorMatch ? authorMatch[1] : 'N/A',
    score: parseFloat(percentage),
    maxScore: maxScore,
    totalScore: totalScore,
    scores: scores,
    size: content.length,
  });

  if ((index + 1) % 50 === 0) {
    process.stdout.write(`\r[${index + 1}/${files.length}] Audited...`);
  }
});

console.log(`\n\n✅ AUDIT COMPLETE\n`);

// ============================================================================
// PHASE 3: CATEGORIZE BY QUALITY TIER
// ============================================================================

console.log('📊 PHASE 3: Categorizing by quality tier...\n');

const byTier = {
  excellent: results.filter(r => r.score >= 90),
  good: results.filter(r => r.score >= 80 && r.score < 90),
  fair: results.filter(r => r.score >= 60 && r.score < 80),
  poor: results.filter(r => r.score < 60),
};

console.log('Quality Distribution:');
console.log(`  ⭐⭐⭐⭐⭐ Excellent (≥90%): ${byTier.excellent.length} files`);
console.log(`  ⭐⭐⭐⭐ Good (80-90%): ${byTier.good.length} files`);
console.log(`  ⭐⭐⭐ Fair (60-80%): ${byTier.fair.length} files`);
console.log(`  ⭐⭐ Poor (<60%): ${byTier.poor.length} files\n`);

// ============================================================================
// PHASE 4: IDENTIFY OPTIMIZATION PRIORITIES
// ============================================================================

console.log('🎯 PHASE 4: Identifying optimization priorities...\n');

// Sort by deficiency
const priorityList = results
  .filter(r => r.score < 95) // Exclude nearly-perfect files
  .sort((a, b) => {
    // Prioritize: high citation + low quality
    const aMissing = 100 - a.score;
    const bMissing = 100 - b.score;
    return bMissing - aMissing;
  });

// Most critical: Tier 1 papers with low scores
const tier1Candidates = [
  'summary-1973-tinto',
  'summary-1975-tinto',
  'summary-1994-crawford',
  'summary-1998-guzman',
  'summary-2008-gueudet',
  'summary-2013-gueudet',
  'summary-2016-hernandez',
  'summary-2018-dimartino',
];

const tier1Issues = [];
tier1Candidates.forEach(prefix => {
  const match = results.find(r => r.filename.startsWith(prefix));
  if (match && match.score < 95) {
    tier1Issues.push(match);
  }
});

console.log(`Critical Issues (Tier 1 papers <95% quality): ${tier1Issues.length}`);
tier1Issues.forEach(issue => {
  console.log(`  ❌ ${issue.filename}`);
  console.log(`     Score: ${issue.score}% | Size: ${issue.size} bytes`);

  // Identify missing criteria
  const missing = Object.entries(issue.scores)
    .filter(([_, score]) => score === 0)
    .map(([criterion, _]) => criterion);

  if (missing.length > 0) {
    console.log(`     Missing: ${missing.join(', ')}`);
  }
  console.log();
});

// ============================================================================
// PHASE 5: GENERATE OPTIMIZATION REPORT
// ============================================================================

console.log('\n📄 PHASE 5: Generating detailed report...\n');

// Sort all results by score
const sorted = [...results].sort((a, b) => a.score - b.score);

// Generate report file
const reportLines = [
  '# Source File Quality Audit Report',
  `Generated: 2026-04-22`,
  `Total Files: ${results.length}`,
  `Average Quality: ${(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}%`,
  '',
  '## Summary by Tier',
  '',
  `### ⭐⭐⭐⭐⭐ Excellent (${byTier.excellent.length} files)`,
  byTier.excellent.map(r => `- ${r.filename} — ${r.score}%`).join('\n'),
  '',
  `### ⭐⭐⭐⭐ Good (${byTier.good.length} files)`,
  byTier.good.slice(0, 10).map(r => `- ${r.filename} — ${r.score}%`).join('\n'),
  byTier.good.length > 10 ? `... and ${byTier.good.length - 10} more` : '',
  '',
  `### ⭐⭐⭐ Fair (${byTier.fair.length} files)`,
  byTier.fair.slice(0, 10).map(r => `- ${r.filename} — ${r.score}%`).join('\n'),
  byTier.fair.length > 10 ? `... and ${byTier.fair.length - 10} more` : '',
  '',
  `### ⭐⭐ Poor (${byTier.poor.length} files)`,
  byTier.poor.slice(0, 15).map(r => `- ${r.filename} — ${r.score}%`).join('\n'),
  byTier.poor.length > 15 ? `... and ${byTier.poor.length - 15} more` : '',
  '',
  '## Critical Issues (Tier 1 Papers)',
  '',
  tier1Issues.map(issue => {
    const missing = Object.entries(issue.scores)
      .filter(([_, score]) => score === 0)
      .map(([criterion, _]) => criterion);
    return `### ${issue.filename}\n- Score: ${issue.score}%\n- Missing: ${missing.join(', ')}`;
  }).join('\n\n'),
  '',
  '## Optimization Strategy',
  '',
  '### Priority 1: Tier 1 Critical Papers',
  `Count: ${tier1Issues.length}`,
  `Impact: ⭐⭐⭐⭐⭐ (Foundational papers)`,
  'Action: Deep optimization to ≥95%',
  '',
  '### Priority 2: Poor Quality Papers',
  `Count: ${byTier.poor.length}`,
  `Impact: ⭐⭐⭐ (Coverage)`,
  'Action: Batch standardization to ≥70%',
  '',
  '### Priority 3: Fair Quality Papers',
  `Count: ${byTier.fair.length}`,
  `Impact: ⭐⭐⭐ (Depth)`,
  'Action: Incremental improvement to ≥80%',
];

const report = reportLines.filter(Boolean).join('\n');
const reportPath = 'D:\\llm-wiki-en\\SOURCE_QUALITY_AUDIT.md';
fs.writeFileSync(reportPath, report, 'utf8');

console.log(`✅ Report written to: ${reportPath}\n`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('📊 FINAL AUDIT SUMMARY');
console.log('======================');
console.log(`Total Files Audited: ${results.length}`);
console.log(`Average Quality Score: ${(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}%`);
console.log(`Files Needing Optimization: ${results.filter(r => r.score < 95).length}`);
console.log(`Critical Issues (Tier 1): ${tier1Issues.length}`);
console.log(`\n✨ Audit complete!`);
