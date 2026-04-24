#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'D:\llm-wiki-en\wiki\sources';

// 孤立 Summary（無 PDF 參考）
const orphanedSummaries = [
  'summary-2008-hernandez-unpacking-discourses.md',
  'summary-2019-dimartino-crisis-stt.md',
  'summary-2019-schueler-meyer-interest.md',
  'summary-2021-dimartino-review.md',
  'summary-2021-geisler-that-wasnt-the-math.md',
  'summary-2021-neumann-resilience.md',
  'summary-2023-geisler-affect-development.md',
  'summary-2023-geisler-role-of-beliefs.md',
  'summary-2023-liebendoerfer-interest.md'
];

// 懸空 Summary（PDF 不存在）- 只列出前 20 個示例
const suspendedSummaries = [
  'summary-1973-tinto-auto.md',
  'summary-1975-tinto-auto.md',
  'summary-1980-super-auto.md',
  'summary-1994-crawford-auto.md',
  'summary-1998-guzman-auto.md',
  'summary-1998-tall-difficulties.md',
  'summary-2001-hoyles-auto.md',
  'summary-2003-graven-auto.md',
  'summary-2003-lyness-auto.md',
  'summary-2004-gruenwald-auto.md',
  'summary-2005-kajander-auto.md',
  'summary-2006-chevallard-auto.md',
  'summary-2007-sfard-auto.md',
  'summary-2008-clark-auto.md',
  'summary-2008-godfrey-auto.md',
  'summary-2008-goodyknoontz-auto.md',
  'summary-2008-gruenwald-reducing-gap.md',
  'summary-2008-gueudet-auto.md',
  'summary-2008-jones-auto.md',
  'summary-2009-artigue-auto.md'
];

// 掃描完整列表（所有 *-auto.md 和已知孤立的）
const allFiles = fs.readdirSync(SOURCES_DIR);
const allAutoFiles = allFiles.filter(f => f.endsWith('-auto.md'));

console.log('📋 PHASE 1: 掃描所有需要刪除的檔案\n');
console.log(`✅ 找到 ${allAutoFiles.length} 個 auto 版本檔案`);
console.log(`✅ 找到 ${orphanedSummaries.length} 個孤立 Summary\n`);

// 收集所有要刪除的檔案
const filesToDelete = new Set([...allAutoFiles, ...orphanedSummaries]);

console.log('🗑️  PHASE 2: 執行刪除操作\n');

let deletedCount = 0;
let failedCount = 0;
const deletedFiles = [];
const failedFiles = [];

filesToDelete.forEach(file => {
  const filepath = path.join(SOURCES_DIR, file);
  if (fs.existsSync(filepath)) {
    try {
      fs.unlinkSync(filepath);
      deletedCount++;
      deletedFiles.push(file);
    } catch (e) {
      failedCount++;
      failedFiles.push({ file, error: e.message });
    }
  }
});

console.log(`✅ 成功刪除: ${deletedCount} 個檔案`);
if (failedCount > 0) {
  console.log(`❌ 失敗: ${failedCount} 個檔案\n`);
  failedFiles.forEach(({ file, error }) => {
    console.log(`  - ${file}: ${error}`);
  });
} else {
  console.log(`❌ 失敗: 0 個檔案\n`);
}

// 驗證結果
const remainingFiles = fs.readdirSync(SOURCES_DIR).filter(f => f.endsWith('.md'));
console.log(`\n📊 清理後統計：`);
console.log(`  - 刪除: ${deletedCount} 個檔案`);
console.log(`  - 保留: ${remainingFiles.length} 個檔案`);
console.log(`  - 預期保留: 148 個有效 Summary\n`);

// 輸出詳細清單（前 20 個）
console.log('✅ 已刪除檔案清單（前 20 個）：');
deletedFiles.slice(0, 20).forEach(f => {
  console.log(`  - ${f}`);
});
if (deletedFiles.length > 20) {
  console.log(`  ... 還有 ${deletedFiles.length - 20} 個\n`);
}

// 寫入清理記錄
const reportLines = [
  '# Summary 清理報告',
  `生成時間: ${new Date().toISOString().split('T')[0]}`,
  '',
  '## 清理統計',
  '',
  `| 項目 | 數量 |`,
  `|------|------|`,
  `| 刪除的 auto 版本 | ${allAutoFiles.length} |`,
  `| 刪除的孤立 Summary | ${orphanedSummaries.length} |`,
  `| 總計刪除 | ${deletedCount} |`,
  `| 保留的有效 Summary | ${remainingFiles.length} |`,
  '',
  '## 已刪除檔案清單',
  ''
];

deletedFiles.forEach(f => {
  reportLines.push(`- \`${f}\``);
});

if (failedFiles.length > 0) {
  reportLines.push('');
  reportLines.push('## 刪除失敗的檔案');
  reportLines.push('');
  failedFiles.forEach(({ file, error }) => {
    reportLines.push(`- \`${file}\`: ${error}`);
  });
}

fs.writeFileSync('D:\llm-wiki-en\SUMMARY_CLEANUP_REPORT.md', reportLines.join('\n'), 'utf8');

console.log('✅ 詳細報告已寫入: SUMMARY_CLEANUP_REPORT.md');
