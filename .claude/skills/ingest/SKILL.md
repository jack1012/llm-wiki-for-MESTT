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
3. **提煉原子知識與對象**：
   - **論文核心**: 區分 **Problematic** 與 **Research Problem**。
   - **實體識別 (Mandatory Entities)**: 必須識別並建立/更新 **Researcher** (作者), **Population** (研究對象), 以及 **Journal** (期刊)。
   - **概念識別 (Mandatory Concepts)**: 必須判定 **Approach** (取向)、涉及的 **Theory** (理論)、**Math_Topic** (數學內容) 與 **Variable** (研究變項)。
   - **數量規範**: 每篇文章固定生成 **2 張** 論文卡片 (Paper Cards)。
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