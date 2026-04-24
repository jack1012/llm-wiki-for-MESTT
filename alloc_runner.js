#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * alloc 技能實作 — 文件分派與預處理
 * 版本：2.0 (規範檢查 + 自動分類)
 */

const fs = require("fs");
const path = require("path");

class AllocRunner {
  constructor(vaultRoot = ".") {
    this.vaultRoot = vaultRoot;
    this.inboxDir = path.join(vaultRoot, "inbox");
    this.rawDir = path.join(vaultRoot, "raw");
    this.report = {
      compliant: [],
      nonCompliant: [],
      errors: [],
      timestamp: new Date().toISOString().split("T")[0]
    };
  }

  /**
   * 檢查檔案名稱是否符合規範：YYYY_Author_Title.ext
   * @returns {[boolean, string]} [isCompliant, reason]
   */
  validateFilename(filename) {
    const nameWithoutExt = path.parse(filename).name;

    // 檢查是否以 4 位數年份開頭
    if (!/^\d{4}/.test(nameWithoutExt)) {
      return [false, "缺少年份（4位數開頭）"];
    }

    // 檢查是否包含特殊問題字符
    const problematicChars = /[\[\]\(\)%"'|:?*&]/;
    if (problematicChars.test(filename)) {
      return [false, "包含特殊字符"];
    }

    // 檢查至少有 3 個基本部分（YYYY_Author_Title）
    const parts = nameWithoutExt.split("_");
    if (parts.length < 3) {
      return [false, "檔名結構不完整（缺年份/作者/標題）"];
    }

    return [true, "規範"];
  }

  /**
   * 簡易語言檢測
   */
  detectLanguage(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;

    const total = chineseChars + englishChars;
    if (total === 0) return "unknown";

    return chineseChars / total > 0.4 ? "中文" : "english";
  }

  /**
   * 根據檔名啟發式分類
   */
  classifyContent(filename) {
    const lower = filename.toLowerCase();

    // 根據副檔名和內容特徵推斷
    if (
      lower.includes("transcript") ||
      lower.includes("轉錄") ||
      lower.includes("podcast")
    ) {
      return "transcripts";
    }
    if (
      lower.includes("book") ||
      lower.includes("chapter") ||
      lower.includes("書") ||
      lower.includes("章")
    ) {
      return "book";
    }
    // 預設：PDF 檔案通常是論文，MD/TXT 是文章
    if (filename.endsWith(".pdf")) {
      return "papers";
    }
    return "articles";
  }

  /**
   * 根據規範狀態和類型決定目標目錄
   */
  determineTargetDir(isCompliant, fileType) {
    if (!isCompliant) {
      return path.join(this.rawDir, "99-fixme");
    }

    const typeMapping = {
      articles: "01-articles",
      papers: "02-book",      // 注意：實際目錄是 02-book
      transcripts: "03-notes",
      book: "02-book"
    };

    const subdir = typeMapping[fileType] || "01-articles";
    return path.join(this.rawDir, subdir);
  }

  /**
   * 執行 alloc 流程
   */
  run(dryRun = false) {
    if (!fs.existsSync(this.inboxDir)) {
      console.log(`❌ inbox/ 目錄不存在：${this.inboxDir}`);
      return;
    }

    console.log(`\n🔍 掃描 ${this.inboxDir} 中的檔案...`);

    const files = fs
      .readdirSync(this.inboxDir)
      .filter(f => {
        const stat = fs.statSync(path.join(this.inboxDir, f));
        return stat.isFile();
      })
      .sort();

    console.log(`   找到 ${files.length} 個檔案\n`);

    for (let idx = 0; idx < files.length; idx++) {
      const filename = files[idx];
      const filePath = path.join(this.inboxDir, filename);

      // 步驟 1：檢查檔案名稱規範
      const [isCompliant, validateReason] = this.validateFilename(filename);

      const paddedIdx = String(idx + 1).padStart(3, " ");
      const paddedFilename = filename.padEnd(60, " ");

      if (isCompliant) {
        // 步驟 2：識別屬性
        const language = this.detectLanguage(filename);
        const contentType = this.classifyContent(filename);

        // 步驟 3：決定目標目錄
        const targetDir = this.determineTargetDir(true, contentType);
        const targetDirName = path.basename(targetDir);

        console.log(
          `[${paddedIdx}/${files.length}] ${paddedFilename} ✅ [${language}] ${contentType.padEnd(12, " ")} → ${targetDirName}`
        );

        this.report.compliant.push({
          filename,
          language,
          type: contentType,
          target: path.relative(this.vaultRoot, targetDir)
        });

        // 實際移動檔案（除非 dry_run）
        if (!dryRun) {
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const targetPath = path.join(targetDir, filename);
          fs.renameSync(filePath, targetPath);
        }
      } else {
        const targetDirName = "99-fixme";
        console.log(
          `[${paddedIdx}/${files.length}] ${paddedFilename} ⚠️  ${validateReason.padEnd(30, " ")} → ${targetDirName}`
        );

        this.report.nonCompliant.push({
          filename,
          reason: validateReason
        });

        // 實際移動檔案（除非 dry_run）
        if (!dryRun) {
          const targetDir = path.join(this.rawDir, "99-fixme");
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          const targetPath = path.join(targetDir, filename);
          fs.renameSync(filePath, targetPath);
        }
      }
    }

    // 生成報告
    this.printReport();
  }

  /**
   * 生成分派報告
   */
  printReport() {
    const compliantCount = this.report.compliant.length;
    const nonCompliantCount = this.report.nonCompliant.length;
    const total = compliantCount + nonCompliantCount;

    let reportText = `
## 📦 alloc 分派報告 — ${this.report.timestamp}

### ✅ 規範檔案已分派 (${compliantCount} 個)
`;

    // 按類型分組
    const byType = {};
    for (const item of this.report.compliant) {
      const t = item.type;
      if (!byType[t]) byType[t] = [];
      byType[t].push(item.filename);
    }

    for (const [typeName, files] of Object.entries(byType).sort()) {
      reportText += `\n#### ${typeName} (${files.length} 個)\n`;
      const displayFiles = files.slice(0, 5);
      for (const filename of displayFiles) {
        reportText += `- ${filename}\n`;
      }
      if (files.length > 5) {
        reportText += `- ... 及其他 ${files.length - 5} 個\n`;
      }
    }

    if (nonCompliantCount > 0) {
      reportText += `
### ⚠️ 非規範檔案已移至待處理 (${nonCompliantCount} 個)
檔案名稱有問題，已移到 \`99-fixme/\` 待人工確認與重命名：
`;
      const displayNonCompliant = this.report.nonCompliant.slice(0, 10);
      for (const item of displayNonCompliant) {
        reportText += `- ${item.filename} — ${item.reason}\n`;
      }
      if (nonCompliantCount > 10) {
        reportText += `- ... 及其他 ${nonCompliantCount - 10} 個\n`;
      }
    }

    reportText += `
### 📊 統計
- 總計處理：${total} 個檔案
- 規範分派：${compliantCount} 個 (${((100 * compliantCount) / total).toFixed(1)}%)
- 非規範移至 99-fixme：${nonCompliantCount} 個 (${((100 * nonCompliantCount) / total).toFixed(1)}%)
`;

    console.log(reportText);

    // 保存報告到文件
    const reportPath = path.join(this.vaultRoot, "ALLOC_REPORT.md");
    fs.writeFileSync(reportPath, reportText, "utf-8");

    console.log(`\n✅ 報告已保存到：${reportPath}`);
  }
}

// Main
const dryRun = process.argv.includes("--dry-run");

if (dryRun) {
  console.log("🔄 [DRY RUN] 將預覽分類結果，不實際移動檔案\n");
}

const runner = new AllocRunner(".");
runner.run(dryRun);
