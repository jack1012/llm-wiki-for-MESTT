---
name: ingest
description: 將 raw/ 目錄下的原始資料（主要是數學教育論文）編譯到 wiki/ 中。採原子化建檔（Atomic Ingestion），針對機器檢索優化。支援 `/ingest` 或 `/ingest <path>`。處理後自動歸檔至 raw/09-archive/。
user-invocable: true
---

# ingest 技能 (Lean & Atomic Version)

## 核心工作流
1. **讀取原始檔**：辨識檔案所在的 `raw/` 子目錄以決定類型。
2. **選擇範本**：
   - `01-articles` → 使用 `templets/Paper_Analysis_V5_Atomic.md`
   - `02-books` → 使用 `templets/Book_Analysis_V1.md`
   - `03-reader-notes` → 使用 `templets/Reader_Note_V1.md`
3. **提煉原子知識與對象 (Strict Mandatory Protocol)**：
   - **論文核心**: 必須區分 **Problematic** 與 **Research Problem**。
   - **實體識別 (Entity Quota)**:
     - **全合著者 (All Co-authors)**: 必須為論文的所有合著者建立個別實體頁面。
     - **出版期刊 (Journal)**: 必須建立/更新出版期刊頁面（類別：`Journal`）。
     - **奠基者 (Foundational Figures)**: 必須識別框架中提到的理論鼻祖並建檔。
   - **概念識別 (Concept Quota)**:
     - **關鍵字總量 (Min 5 Concepts)**: 每篇文獻必須產出 **至少 5 個** 概念頁面，包含所有標註關鍵字。
     - **術語深度**: 文獻探討中具備定義地位的學術詞彙必須結晶化。
     - **類別準確**: 嚴格執行 `Theory`, `Phenomenon`, `Methodology`, `Variable`, `Math_Topic`, `Approach` 分類。
   - **卡片規範**: 固定生成 **2 張** 論文卡片 (Paper Cards)。
4. **建立 Source 頁面**：在 `wiki/sources/` 建立摘要，對應所選範本。
5. **建立論文卡片**：在 `wiki/cards/` 建立獨立卡片（<300字）。
6. **更新索引與日誌**：同步 `wiki/index.md` 與 `wiki/log.md`。

## 語言與格式準則
- **英文文獻**：Wiki 內文必須使用**純英文**，但在 YAML 中加入 `aliases: [中文名稱]`。
- **命名規範**：
   - Sources: `summary-{kebab-case-slug}.md`
   - Cards: `paper-card-{author-year-keyword}.md`
   - Concepts/Entities: `Title Case` (e.g., `[[Procept Theory]]`)
- **機器優化**：減少贅字，強化連結與 metadata。

## 執行步驟
1. 讀取並理解原始文獻。
2. 根據 `templets/Paper_Analysis_V5_Atomic.md` 的結構產生 Source 頁面。
3. 產生與該文獻關聯的 Entities（研究者）或 Concepts（理論）。
4. 更新全域索引與日誌。
5. 將原始檔移動至 `raw/09-archive/`。

## 衝突與重複
- 發現既有概念時，採增量更新（Incremental Update）。
- 邏輯嚴重衝突時，暫停並詢問使用者。