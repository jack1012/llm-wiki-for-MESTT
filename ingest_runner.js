#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * ingest 技能實作 — 文獻知識編譯
 * 版本：1.0 (從 raw/ 編譯到 wiki/)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class IngestRunner {
  constructor(vaultRoot = ".") {
    this.vaultRoot = vaultRoot;
    this.rawDir = path.join(vaultRoot, "raw");
    this.wikiDir = path.join(vaultRoot, "wiki");
    this.sourcesDir = path.join(this.wikiDir, "sources");
    this.entitiesDir = path.join(this.wikiDir, "entities");
    this.conceptsDir = path.join(this.wikiDir, "concepts");

    this.report = {
      processed: [],
      failed: [],
      skipped: [],
      newEntities: [],
      newConcepts: [],
      timestamp: new Date().toISOString().split("T")[0]
    };
  }

  /**
   * 從文件名解析元數據
   * 格式：YYYY_Author_Title.pdf
   */
  parseFilename(filename) {
    const nameWithoutExt = path.parse(filename).name;
    const parts = nameWithoutExt.split("_");

    if (parts.length < 3) {
      return null;
    }

    const year = parts[0];
    const author = parts[1];
    const titleParts = parts.slice(2);
    const title = titleParts.join(" ");

    return { year, author, title };
  }

  /**
   * 檢測文本語言
   */
  detectLanguage(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const total = chineseChars + englishChars;

    if (total === 0) return "unknown";
    return chineseChars / total > 0.4 ? "chinese" : "english";
  }

  /**
   * 從文本提取摘要和關鍵詞
   */
  extractAbstractAndKeywords(text) {
    const lines = text.split("\n");

    // 尋找 Abstract 段落
    let abstractStart = -1;
    let abstractEnd = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (
        line.includes("abstract") ||
        line.includes("摘要") ||
        line.includes("overview")
      ) {
        abstractStart = i;
        break;
      }
    }

    // 簡化版本：取前 500 個詞作為摘要
    const words = text.match(/\b\w+\b/g) || [];
    const abstractText = words.slice(0, 100).join(" ");

    // 提取關鍵詞（簡化：使用 Introduction 前的詞）
    const keywords = this.extractKeywords(text);

    return {
      abstract: abstractText || "Abstract not available",
      keywords: keywords,
      language: this.detectLanguage(text)
    };
  }

  /**
   * 簡單的關鍵詞提取
   */
  extractKeywords(text) {
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being"
    ]);

    // 提取單詞並過濾短詞
    const words = text
      .split(/\s+/)
      .filter(w => w.length > 5 && !commonWords.has(w.toLowerCase()))
      .slice(0, 20);

    // 提取名詞（簡化：大寫開頭的詞）
    const properNouns = words.filter(w => /^[A-Z]/.test(w));

    return [...new Set([...properNouns, ...words])].slice(0, 10);
  }

  /**
   * 從文件名生成 slug（用於檔案名）
   */
  generateSlug(filename) {
    const metadata = this.parseFilename(filename);
    if (!metadata) return null;

    const yearAuthorTitle = `${metadata.year}-${metadata.author
      .toLowerCase()
      .replace(/\s+/g, "-")}-${metadata.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 30)}`;

    return `summary-${yearAuthorTitle}`;
  }

  /**
   * 建立來源頁面
   */
  createSourcePage(filename, filePath, metadata, contentInfo) {
    const slug = this.generateSlug(filename);
    if (!slug) return null;

    const sourcePath = path.join(this.sourcesDir, `${slug}.md`);

    // 檢查是否已存在
    if (fs.existsSync(sourcePath)) {
      this.report.skipped.push({
        filename,
        reason: "Source page already exists"
      });
      return slug;
    }

    // 建立 YAML frontmatter
    const frontmatter = `---
title: "${metadata.title}"
aliases: []
type: source
author: "${metadata.author}"
year: ${metadata.year}
journal: "TBD"
doi: "N/A"
tags: [Source, STT]
sources: [${path.relative(this.vaultRoot, filePath).replace(/\\/g, "/")}]
last_updated: ${this.report.timestamp}
---

## Core Claims (${contentInfo.language === "chinese" ? "Chinese/English" : "English Only"})
${this.formatAbstract(contentInfo.abstract)}

## Key Concepts & Keywords
${contentInfo.keywords.map(kw => `- [[${kw}]]`).join("\n")}

## Extracted Entities
*To be populated by manual review*

## 創建與編修紀錄
- **${this.report.timestamp}**: 初次 ingest，自動提取元數據

`;

    // 寫入檔案
    try {
      this.sourcesDir && !fs.existsSync(this.sourcesDir) && fs.mkdirSync(this.sourcesDir, { recursive: true });
      fs.writeFileSync(sourcePath, frontmatter, "utf-8");
      return slug;
    } catch (err) {
      this.report.failed.push({
        filename,
        error: err.message
      });
      return null;
    }
  }

  /**
   * 格式化摘要文本
   */
  formatAbstract(abstract) {
    if (!abstract || abstract.length === 0) {
      return "- *Abstract content to be extracted from PDF*";
    }

    // 分行，每行最多 80 個字符
    const lines = abstract.match(/.{1,80}/g) || [abstract];
    return "- " + lines.join("\n- ");
  }

  /**
   * 運行 ingest 流程
   */
  run(dryRun = false) {
    console.log(`\n🔍 開始掃描 ${this.rawDir}...`);

    // 掃描所有 PDF
    const pdfFiles = this.findAllPdfs(this.rawDir);
    console.log(`   找到 ${pdfFiles.length} 個 PDF 檔案\n`);

    let processed = 0;
    let failed = 0;

    for (let idx = 0; idx < pdfFiles.length; idx++) {
      const filePath = pdfFiles[idx];
      const filename = path.basename(filePath);
      const relPath = path.relative(this.vaultRoot, filePath);

      process.stdout.write(
        `[${String(idx + 1).padStart(3, " ")}/${pdfFiles.length}] ${filename.padEnd(80)} `
      );

      try {
        // 步驟 1：解析文件名
        const metadata = this.parseFilename(filename);
        if (!metadata) {
          console.log("❌ 無法解析檔名");
          failed++;
          continue;
        }

        // 步驟 2：提取 PDF 文本（簡化版本）
        let text = "";
        try {
          // 使用 pdftotext 提取前 5000 個字符
          const tempFile = `/tmp/${path.basename(filePath, ".pdf")}.txt`;
          execSync(`pdftotext -l 3 "${filePath}" "${tempFile}" 2>/dev/null`, {
            stdio: "pipe"
          });

          if (fs.existsSync(tempFile)) {
            text = fs
              .readFileSync(tempFile, "utf-8")
              .slice(0, 5000);
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          // 如果 pdftotext 失敗，繼續使用檔名元數據
          text = filename;
        }

        // 步驟 3：提取內容信息
        const contentInfo = this.extractAbstractAndKeywords(text);

        // 步驟 4：建立來源頁面
        if (!dryRun) {
          const slug = this.createSourcePage(filename, filePath, metadata, contentInfo);
          if (slug) {
            console.log(
              `✅ [${metadata.year}] [${contentInfo.language}]`
            );
            this.report.processed.push({
              filename,
              metadata,
              slug
            });
            processed++;
          } else {
            failed++;
          }
        } else {
          console.log(
            `✅ [DRY] [${metadata.year}] [${contentInfo.language}]`
          );
          processed++;
        }
      } catch (err) {
        console.log(`❌ ${err.message}`);
        this.report.failed.push({
          filename,
          error: err.message
        });
        failed++;
      }
    }

    // 生成報告
    this.printReport(processed, failed, pdfFiles.length);
  }

  /**
   * 遞歸掃描所有 PDF 檔案
   */
  findAllPdfs(dir) {
    const pdfs = [];

    const traverse = (currentDir) => {
      const files = fs.readdirSync(currentDir);
      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          traverse(filePath);
        } else if (file.endsWith(".pdf")) {
          pdfs.push(filePath);
        }
      }
    };

    traverse(dir);
    return pdfs.sort();
  }

  /**
   * 生成報告
   */
  printReport(processed, failed, total) {
    const reportText = `
## 📋 ingest 報告 — ${this.report.timestamp}

### ✅ 成功處理
- 總計：${processed} 個文獻
- 新建來源頁面：${this.report.processed.length} 個
- 已跳過（重複）：${this.report.skipped.length} 個

### ❌ 失敗
- 無法解析：${failed} 個

### 📊 統計
- 掃描總數：${total}
- 成功率：${((100 * processed) / total).toFixed(1)}%

### 📝 下一步
1. 檢視 wiki/sources/ 中新建的頁面
2. 手動補充摘要和關鍵詞
3. 建立實體和概念頁面
4. 同步 wiki/index.md

---
**報告時間**: ${new Date().toLocaleString()}
`;

    console.log(reportText);

    const reportPath = path.join(
      this.vaultRoot,
      `INGEST_REPORT_${this.report.timestamp}.md`
    );
    fs.writeFileSync(reportPath, reportText, "utf-8");
    console.log(`✅ 報告已保存到：${reportPath}`);
  }
}

// Main
const dryRun = process.argv.includes("--dry-run");

if (dryRun) {
  console.log("🔄 [DRY RUN] 預覽 ingest 結果，不實際建立頁面\n");
}

const runner = new IngestRunner(".");
runner.run(dryRun);
