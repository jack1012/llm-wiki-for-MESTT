#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * ingest 自動化流水線 (Pipeline V1.0)
 * 處理 raw/01-articles/ 中的所有文獻
 * 為每篇生成：Source 頁面 + 5 Concepts + 2 Cards + Entity 更新
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class IngestPipeline {
  constructor(vaultRoot = ".") {
    this.vaultRoot = vaultRoot;
    this.rawDir = path.join(vaultRoot, "raw", "01-articles");
    this.wikiDir = path.join(vaultRoot, "wiki");
    this.sourcesDir = path.join(this.wikiDir, "sources");
    this.conceptsDir = path.join(this.wikiDir, "concepts");
    this.cardsDir = path.join(this.wikiDir, "cards");
    this.entitiesDir = path.join(this.wikiDir, "entities");
    this.archiveDir = path.join(vaultRoot, "raw", "09-archive");

    this.report = {
      processed: [],
      failed: [],
      timestamp: new Date().toISOString().split("T")[0],
      stats: {
        sourcesCreated: 0,
        conceptsCreated: 0,
        cardsCreated: 0,
        entitiesUpdated: 0
      }
    };

    this.trackerPath = path.join(vaultRoot, "wiki", "INGEST_TRACKER.md");
    this.tracker = this.loadTracker();
  }

  /**
   * 載入 INGEST_TRACKER.md 並提取案號
   */
  loadTracker() {
    if (!fs.existsSync(this.trackerPath)) {
      return { maxId: 90, entries: {} };
    }

    const content = fs.readFileSync(this.trackerPath, "utf-8");
    const lines = content.split("\n");
    let maxId = 90;

    for (const line of lines) {
      const match = line.match(/^\|\s*\*\*(\d+)\*\*/);
      if (match) {
        maxId = Math.max(maxId, parseInt(match[1]));
      }
    }

    return { maxId, entries: {} };
  }

  /**
   * 從檔案名解析元數據
   */
  parseMetadata(filename) {
    const nameWithoutExt = path.parse(filename).name;
    const parts = nameWithoutExt.split("_");

    if (parts.length < 3) return null;

    const year = parts[0];
    const author = parts[1];
    const titleParts = parts.slice(2);
    const title = titleParts.join(" ");

    return { year, author, title, filename };
  }

  /**
   * 提取 PDF 文本（前 3000 字）
   */
  extractPdfText(filePath) {
    try {
      const tempFile = `/tmp/${path.basename(filePath, ".pdf")}.txt`;
      execSync(`pdftotext -l 5 "${filePath}" "${tempFile}" 2>/dev/null`, {
        stdio: "pipe"
      });

      if (fs.existsSync(tempFile)) {
        const text = fs
          .readFileSync(tempFile, "utf-8")
          .slice(0, 3000);
        fs.unlinkSync(tempFile);
        return text;
      }
    } catch (e) {
      // 若失敗，返回空字符串
    }
    return "";
  }

  /**
   * 生成 Source slug
   */
  generateSourceSlug(metadata) {
    const authorSlug = metadata.author
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 15);
    const titleSlug = metadata.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 30);

    return `summary-${metadata.year}-${authorSlug}-${titleSlug}`;
  }

  /**
   * 創建 Source 頁面（Pass 1-2 框架）
   */
  createSourcePage(metadata, pdfText, caseId) {
    const slug = this.generateSourceSlug(metadata);
    const filePath = path.join(this.sourcesDir, `${slug}.md`);

    // 檢查是否已存在
    if (fs.existsSync(filePath)) {
      return { slug, status: "skipped", reason: "existing" };
    }

    // 提取摘要和關鍵詞
    const { abstract, keywords } = this.extractAbstractAndKeywords(pdfText, metadata);

    // 建立 Source 頁面
    const frontmatter = `---
title: "${metadata.title}"
aliases: []
type: source
author: "${metadata.author}"
year: ${metadata.year}
journal: "TBD"
doi: "N/A"
tags: [Source, STT, "Case-${caseId}"]
sources: [raw/01-articles/${metadata.filename}]
last_updated: ${this.report.timestamp}
case_id: ${caseId}
---

## Pass 1: Profile (元數據提取)
- **標題**: ${metadata.title}
- **作者**: ${metadata.author}
- **年份**: ${metadata.year}
- **研究領域**: Secondary-to-Tertiary Transition Mathematics Education
- **研究國家/地區**: TBD (待補充)

## Pass 2: Core Analysis (5W1H)
- **What**: ${abstract || "待補充"}
- **Why**:
- **Who**: ${metadata.author}
- **Where**:
- **When**: ${metadata.year}
- **How**:

## Pass 3: Critical Review (待補充)
### APA Citation
\`\`\`
${metadata.author} (${metadata.year}). ${metadata.title}.
\`\`\`

### Core Claims
*待人工補充*

## Pass 4: Models & Variables (待補充)
### 核心變項
*待人工提取*

### 理論模型
\`\`\`mermaid
graph TD
    A[待補充] --> B[研究發現]
\`\`\`

## 提取的概念與實體
### 關鍵詞
${keywords.map(kw => `- ${kw}`).join("\n")}

### 相關概念 (待建立連結)
*待人工建立*

### 相關實體 (待建立連結)
- Author: [[${metadata.author}]]

---

## 📝 創建與編修紀錄
- **${this.report.timestamp}**: Pass 1-2 自動框架化，案號 ${caseId}
- **備註**: 待人工補充 Pass 3-4 與相關實體/概念連結
`;

    try {
      fs.writeFileSync(filePath, frontmatter, "utf-8");
      this.report.stats.sourcesCreated++;
      return { slug, status: "created", path: filePath };
    } catch (err) {
      return { slug, status: "error", error: err.message };
    }
  }

  /**
   * 提取摘要和關鍵詞
   */
  extractAbstractAndKeywords(text, metadata) {
    // 簡化版：取前 50 個詞
    const words = (text || "").match(/\b\w+\b/g) || [];
    const abstract = words.slice(0, 50).join(" ");

    // 從標題提取關鍵詞
    const titleKeywords = metadata.title
      .split(" ")
      .filter(w => w.length > 4);

    return {
      abstract: abstract || `Study on ${metadata.title}`,
      keywords: [...new Set(titleKeywords)].slice(0, 8)
    };
  }

  /**
   * 為文獻生成 5 個概念框架
   */
  createConceptFrameworks(metadata, caseId) {
    const concepts = [
      {
        name: `STT in ${metadata.year}`,
        description: "Secondary-to-Tertiary Transition context"
      },
      {
        name: `${metadata.author} Framework`,
        description: `Research approach by ${metadata.author}`
      },
      {
        name: "Student Transition Challenges",
        description: "Difficulties in mathematics transition"
      },
      {
        name: "Educational Policy",
        description: "Policy implications from research"
      },
      {
        name: "Resilience in Mathematics",
        description: "Student resilience and support"
      }
    ];

    const createdConcepts = [];

    for (const concept of concepts) {
      const conceptSlug = concept.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      const conceptPath = path.join(
        this.conceptsDir,
        `${conceptSlug}.md`
      );

      // 如果概念頁面已存在，跳過
      if (fs.existsSync(conceptPath)) {
        continue;
      }

      const conceptContent = `---
title: "${concept.name}"
type: concept
tags: [Concept, STT]
sources: []
last_updated: ${this.report.timestamp}
---

# ${concept.name}

## 定義
${concept.description}

## 相關研究
### 源自文獻
- [[summary-${this.generateSourceSlug(metadata)}]] (Case-${caseId})

## 理論背景
*待補充*

## 應用場景
*待補充*

---
## 📝 創建與編修紀錄
- **${this.report.timestamp}**: 自動框架化，來自 Case-${caseId}
`;

      try {
        fs.writeFileSync(conceptPath, conceptContent, "utf-8");
        this.report.stats.conceptsCreated++;
        createdConcepts.push(conceptSlug);
      } catch (err) {
        console.error(`Failed to create concept ${conceptSlug}:`, err.message);
      }
    }

    return createdConcepts;
  }

  /**
   * 為文獻生成 2 張研究卡片
   */
  createResearchCards(metadata, sourceSlug, caseId) {
    const cards = [
      {
        title: `${metadata.author} ${metadata.year} - Research Problem`,
        slug: `card-${metadata.year}-${metadata.author.toLowerCase()}-problem`
      },
      {
        title: `${metadata.author} ${metadata.year} - Key Findings`,
        slug: `card-${metadata.year}-${metadata.author.toLowerCase()}-findings`
      }
    ];

    const createdCards = [];

    for (const card of cards) {
      const cardPath = path.join(
        this.cardsDir,
        `${card.slug}.md`
      );

      // 如果卡片已存在，跳過
      if (fs.existsSync(cardPath)) {
        continue;
      }

      const cardContent = `---
title: "${card.title}"
type: card
parent_source: "[[${sourceSlug}]]"
case_id: ${caseId}
tags: [Card, Research]
last_updated: ${this.report.timestamp}
---

# ${card.title}

## Parent Source
[[${sourceSlug}]]

## Content
*待補充*

## Related Concepts
*待補充*

---
## 📝 創建與編修紀錄
- **${this.report.timestamp}**: 自動框架化，來自 Case-${caseId}
`;

      try {
        fs.writeFileSync(cardPath, cardContent, "utf-8");
        this.report.stats.cardsCreated++;
        createdCards.push(card.slug);
      } catch (err) {
        console.error(`Failed to create card ${card.slug}:`, err.message);
      }
    }

    return createdCards;
  }

  /**
   * 主流程：處理一篇文獻
   */
  processPaper(filePath, caseId) {
    const filename = path.basename(filePath);
    const metadata = this.parseMetadata(filename);

    if (!metadata) {
      return { filename, status: "failed", reason: "parse_error" };
    }

    // 提取 PDF 文本
    const pdfText = this.extractPdfText(filePath);

    // Pass 1-2: 建立 Source 頁面
    const sourceResult = this.createSourcePage(metadata, pdfText, caseId);
    if (sourceResult.status === "error") {
      return { filename, status: "failed", reason: sourceResult.error };
    }

    // 建立 5 個概念框架
    const conceptsCreated = this.createConceptFrameworks(metadata, caseId);

    // 建立 2 張卡片
    const cardsCreated = this.createResearchCards(
      metadata,
      sourceResult.slug,
      caseId
    );

    this.report.processed.push({
      caseId,
      filename,
      sourceSlug: sourceResult.slug,
      conceptsCreated,
      cardsCreated,
      status: "framework_created"
    });

    return {
      filename,
      status: "success",
      caseId,
      sourceSlug: sourceResult.slug
    };
  }

  /**
   * 執行完整流水線
   */
  run(limit = null) {
    if (!fs.existsSync(this.rawDir)) {
      console.log(`❌ ${this.rawDir} 不存在`);
      return;
    }

    const files = fs
      .readdirSync(this.rawDir)
      .filter(f => f.endsWith(".pdf"))
      .sort();

    const filesToProcess = limit ? files.slice(0, limit) : files;

    console.log(
      `\n🚀 開始 ingest 流水線\n📂 處理: ${this.rawDir}\n📊 檔案數: ${filesToProcess.length}\n`
    );

    for (let idx = 0; idx < filesToProcess.length; idx++) {
      const filename = filesToProcess[idx];
      const filePath = path.join(this.rawDir, filename);
      const caseId = this.tracker.maxId + idx + 1;

      process.stdout.write(
        `[${String(idx + 1).padStart(3, " ")}/${filesToProcess.length}] ${filename.padEnd(80)} `
      );

      try {
        const result = this.processPaper(filePath, caseId);
        if (result.status === "success") {
          console.log(`✅ [Case-${result.caseId}]`);
        } else {
          console.log(`⚠️  ${result.reason}`);
        }
      } catch (err) {
        console.log(`❌ ${err.message}`);
        this.report.failed.push({ filename, error: err.message });
      }
    }

    // 生成報告
    this.printReport(filesToProcess.length);
  }

  /**
   * 生成報告
   */
  printReport(totalFiles) {
    const reportText = `
## 📋 Ingest Pipeline 報告 — ${this.report.timestamp}

### ✅ 自動化框架化完成
- **掃描檔案**: ${totalFiles} 篇
- **成功處理**: ${this.report.processed.length} 篇
- **失敗**: ${this.report.failed.length} 篇

### 📊 產出統計
- **Source 頁面**: ${this.report.stats.sourcesCreated} 個
- **Concept 框架**: ${this.report.stats.conceptsCreated} 個
- **Research Card**: ${this.report.stats.cardsCreated} 個

### 📝 下一步
1. 檢視 wiki/sources/ 中的框架頁面
2. 手動補充 Pass 3-4 內容（Critical Review & Models）
3. 建立實體與概念的完整連結
4. 更新 wiki/index.md
5. 執行 lint 檢查

### 🎯 框架化頁面列表
${this.report.processed
  .slice(0, 10)
  .map(
    item =>
      `- [Case-${item.caseId}] ${item.filename}\n  - Source: [[${item.sourceSlug}]]\n  - Concepts: ${item.conceptsCreated.length}, Cards: ${item.cardsCreated.length}`
  )
  .join("\n")}
${this.report.processed.length > 10 ? `\n... 及其他 ${this.report.processed.length - 10} 篇` : ""}

---
**報告時間**: ${new Date().toLocaleString()}
`;

    console.log(reportText);

    const reportPath = path.join(
      this.vaultRoot,
      `PIPELINE_REPORT_${this.report.timestamp}.md`
    );
    fs.writeFileSync(reportPath, reportText, "utf-8");
    console.log(`\n✅ 報告已保存到：${reportPath}`);
  }
}

// Main
const limit = process.argv[2] ? parseInt(process.argv[2]) : null;

const pipeline = new IngestPipeline(".");
pipeline.run(limit);
