#!/usr/bin/env node

/**
 * ANALYZE PDF-SUMMARY MISMATCH
 *
 * Find orphaned summaries (no PDF) and missing summaries (PDF but no summary)
 */

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:\\llm-wiki-en\\wiki\\sources';
const PDF_DIR = 'D:\\llm-wiki-en\\raw\\09-archive';

console.log('📋 PHASE 1: Reading all PDFs...\n');

const pdfFiles = fs.readdirSync(PDF_DIR)
  .filter(f => f.endsWith('.pdf'))
  .sort();

console.log(`✅ Found ${pdfFiles.length} PDF files\n`);

console.log('📋 PHASE 2: Reading all summaries and their PDF references...\n');

const summaryFiles = fs.readdirSync(SOURCES_DIR)
  .filter(f => f.endsWith('.md') && f.startsWith('summary-'))
  .sort();

const summaryToPdf = {};
const orphanedSummaries = [];

summaryFiles.forEach(summary => {
  const filepath = path.join(SOURCES_DIR, summary);
  const content = fs.readFileSync(filepath, 'utf8');

  // Extract PDF reference from sources field
  const sourcesMatch = content.match(/^sources:\s*\[(.+?)\]/m);
  if (sourcesMatch) {
    const pdfPath = sourcesMatch[1];
    const pdfName = path.basename(pdfPath);
    summaryToPdf[summary] = pdfName;
  } else {
    orphanedSummaries.push(summary);
  }
});

console.log(`✅ Found ${Object.keys(summaryToPdf).length} summaries with PDF references`);
console.log(`⚠️  Found ${orphanedSummaries.length} orphaned summaries (no PDF reference)\n`);

// ============================================================================
// PHASE 3: VERIFY PDFS EXIST
// ============================================================================

console.log('🔍 PHASE 3: Verifying PDF references...\n');

const pdfSet = new Set(pdfFiles);
const missingPdfSummaries = [];
const validSummaries = [];

Object.entries(summaryToPdf).forEach(([summary, pdfName]) => {
  if (pdfSet.has(pdfName)) {
    validSummaries.push({ summary, pdf: pdfName });
  } else {
    missingPdfSummaries.push({ summary, pdf: pdfName });
  }
});

console.log(`✅ ${validSummaries.length} summaries have valid PDF references`);
console.log(`❌ ${missingPdfSummaries.length} summaries reference missing PDFs\n`);

// ============================================================================
// PHASE 4: FIND UNPAIRED PDFS
// ============================================================================

console.log('🔍 PHASE 4: Finding PDFs without summaries...\n');

const pairedPdfs = new Set(validSummaries.map(s => s.pdf));
const unpairedPdfs = pdfFiles.filter(pdf => !pairedPdfs.has(pdf));

console.log(`📊 PDF-Summary pairing:`);
console.log(`  - Total PDFs: ${pdfFiles.length}`);
console.log(`  - PDFs with summaries: ${pairedPdfs.size}`);
console.log(`  - PDFs without summaries: ${unpairedPdfs.length}\n`);

// ============================================================================
// PHASE 5: GENERATE REPORT
// ============================================================================

console.log('📄 PHASE 5: Generating detailed report...\n');

const reportLines = [
  '# PDF-Summary 匹配分析報告',
  `生成時間: 2026-04-22`,
  '',
  '## 統計摘要',
  '',
  `| 項目 | 數量 |`,
  `|------|------|`,
  `| 總 PDF | ${pdfFiles.length} |`,
  `| 總 Summary | ${summaryFiles.length} |`,
  `| 有效配對 | ${validSummaries.length} |`,
  `| 孤立 Summary（無 PDF） | ${orphanedSummaries.length} |`,
  `| 懸空 Summary（PDF 缺失） | ${missingPdfSummaries.length} |`,
  `| 未配對 PDF（無 Summary） | ${unpairedPdfs.length} |`,
  `| 匹配率 | ${(validSummaries.length / pdfFiles.length * 100).toFixed(1)}% |`,
  '',
  '## 問題列表',
  '',
];

if (orphanedSummaries.length > 0) {
  reportLines.push(`### 孤立 Summary（${orphanedSummaries.length} 個 — 無 PDF 參考）`);
  reportLines.push('');
  orphanedSummaries.slice(0, 30).forEach(s => {
    reportLines.push(`- \`${s}\``);
  });
  if (orphanedSummaries.length > 30) {
    reportLines.push(`... 還有 ${orphanedSummaries.length - 30} 個`);
  }
  reportLines.push('');
  reportLines.push('**建議**: 檢查這些文件是否應該存在，或是補充 PDF 參考');
  reportLines.push('');
}

if (missingPdfSummaries.length > 0) {
  reportLines.push(`### 懸空 Summary（${missingPdfSummaries.length} 個 — PDF 不存在）`);
  reportLines.push('');
  missingPdfSummaries.slice(0, 20).forEach(item => {
    reportLines.push(`- \`${item.summary}\` → 缺失: \`${item.pdf}\``);
  });
  if (missingPdfSummaries.length > 20) {
    reportLines.push(`... 還有 ${missingPdfSummaries.length - 20} 個`);
  }
  reportLines.push('');
  reportLines.push('**建議**: 刪除這些 summary 文件或查找缺失的 PDF');
  reportLines.push('');
}

if (unpairedPdfs.length > 0) {
  reportLines.push(`### 未配對 PDF（${unpairedPdfs.length} 個 — 無對應 Summary）`);
  reportLines.push('');
  unpairedPdfs.slice(0, 30).forEach(pdf => {
    reportLines.push(`- \`${pdf}\``);
  });
  if (unpairedPdfs.length > 30) {
    reportLines.push(`... 還有 ${unpairedPdfs.length - 30} 個`);
  }
  reportLines.push('');
  reportLines.push('**建議**: 這些 PDF 還沒被自動化腳本處理（可能是因為編碼錯誤）');
  reportLines.push('');
}

reportLines.push('## 建議的清理步驟');
reportLines.push('');
reportLines.push('### 第 1 步：刪除問題 Summary（${missingPdfSummaries.length + orphanedSummaries.length} 個）');
reportLines.push('```bash');
reportLines.push('# 刪除懸空 Summary');
missingPdfSummaries.slice(0, 10).forEach(item => {
  reportLines.push(`rm wiki/sources/${item.summary}.md`);
});
reportLines.push('');
reportLines.push('# 刪除孤立 Summary（審查後）');
orphanedSummaries.slice(0, 10).forEach(s => {
  reportLines.push(`rm wiki/sources/${s}.md`);
});
reportLines.push('```');
reportLines.push('');
reportLines.push('### 第 2 步：處理未配對的 PDF');
reportLines.push(`需要處理: ${unpairedPdfs.length} 個 PDF`);
reportLines.push('```bash');
reportLines.push('# 運行自動化腳本處理失敗的 PDF（重命名或轉換格式）');
reportLines.push('```');
reportLines.push('');

fs.writeFileSync('D:\\llm-wiki-en\\PDF_SUMMARY_MISMATCH_REPORT.md', reportLines.join('\n'), 'utf8');

console.log('📊 完整報告:');
console.log(`  ✅ 有效配對: ${validSummaries.length}`);
console.log(`  ❌ 孤立 Summary: ${orphanedSummaries.length}`);
console.log(`  ❌ 懸空 Summary: ${missingPdfSummaries.length}`);
console.log(`  ❌ 未配對 PDF: ${unpairedPdfs.length}`);
console.log(`  📈 匹配率: ${(validSummaries.length / pdfFiles.length * 100).toFixed(1)}%\n`);

console.log(`✅ 詳細報告: PDF_SUMMARY_MISMATCH_REPORT.md\n`);

console.log('💡 建議方案：');
console.log('  1. 刪除 ${missingPdfSummaries.length + orphanedSummaries.length} 個問題 Summary');
console.log('  2. 保留 ${validSummaries.length} 個有效的配對');
console.log('  3. 處理 ${unpairedPdfs.length} 個未配對的 PDF（重新命名或修復編碼）');
console.log(`\n最終結果: ${validSummaries.length + unpairedPdfs.length} 個論文對應的 Summary\n`);
