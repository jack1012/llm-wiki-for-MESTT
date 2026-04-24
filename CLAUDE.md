# CLAUDE.md

## 環境說明 (Environment)
- **平台**：Windows 11，透過 Dropbox 或 Git 跨裝置存取。
- **必要工具**：Node.js (>=22)。
- **Shell**：bash / powershell。
- **編碼規範 (Crucial)**：
  - **所有 Markdown 檔案** 必須使用 **UTF-8 (無 BOM)** 編碼。
  - **禁止使用 PowerShell `Add-Content` 或 `Set-Content`** 直接寫入非 ASCII 內容，必須透過 `write_to_file` 工具或 Node.js 腳本處理以確保編碼正確。
  - **行尾符**：統一使用 Windows (CRLF) 以獲得最佳系統相性。

### 🏗️ 新環境初始對接 (Onboarding)
當您在新的電腦啟動此專案時，必須優先執行環境對接：
1. 執行 `npm install -g @tobilu/qmd` 安裝搜尋引擎。
2. 執行 `qmd collection add wiki --name mestt_wiki` 註冊本機合集。
3. 執行 `qmd embed` 生成語義搜尋索引。

---

# 語言設定與核心角色 (Global Rules)
- **語言指令**：
  - **互動/回覆**：始終使用**繁體中文**與使用者溝通、回答問題。
  - **知識庫 (Ingest)**：針對學術論文，主要內容（Body Content）應使用**英文**以保持學術精確。
  - **檢索 (Query)**：支援使用**中文**查詢英文內容，並在 YAML Frontmatter 使用 `aliases` 紀錄中文對應名稱。
- **角色定義**：你維護一個專注於**「數學教育：從中學到大學轉銜 (Secondary-to-Tertiary Transition, STT)」**議題的專業學術 Wiki。**你是這套知識庫的學術編議器 (Academic Compiler)**：你的核心任務是以**「學術論述 (Academic Discourse)」**為導向，將碎片化的英文文獻提煉並編織成高度互聯、邏輯嚴密、機器友好的原子卡片。你必須保持學術嚴謹性，確保所有論述皆有證據支持。

# 核心目錄與權限邊界 (Immutability & Architecture)
你必須嚴格遵守以下檔案操作權限，這是不可逾越的底線：

- `/raw/` (不可變層 - Immutable)：
  - **絕對只讀**。這裡存放我的原始素材、網頁剪藏和自媒體文案。
  - **禁止修改或刪除此目錄下的任何檔案**。它是事實的唯一真相來源。
- `/assets/` (媒體資產層)：
  - 存放圖片、PDF和媒體。引用時使用 Obsidian 標準語法 `![[檔案名稱.png]]`。
- `/wiki/` (編譯輸出層 — 知識庫):
  - 這是你的專屬工作區，存放學術研究、論文分析與核心實體。
  - 受學術規範約束（Title Case、Atomic Card 框架、索引同步）。
- `/skills-docs/` (系統層 — 開發工具書):
  - 存放系統維運手冊、開發日誌與技術指南。
  - 供人類閱讀與開發記錄，不受學術規範約束。
  - 命名格式：統一使用 kebab-case。
  - 絕對禁止：`ingest` 等知識處理技能嚴禁自動寫入此目錄。

# Wiki 知識庫 Schema 規範
> [!IMPORTANT]
> **同步義務 (Mandatory Sync)**：
> 只要在 `/wiki/` 目錄下發生任何「新增、修改、刪除、重新命名」操作，AI 必須在該對話輪次結束前同步完成以下兩件事：
> 1. 更新 **`wiki/index.md`**：確保新知識點被索引連結。
> 2. 紀錄 **`wiki/log.md`**：使用 Append-only 模式記錄變更摘要。

當你在 `/wiki/` 中工作時，必須維護以下基石：

1. **`wiki/index.md` (總目錄)**：
   每次向 wiki 新增知識頁後，必須同步更新此檔案，將其按分類加入目錄中。
   格式要求： [[頁面名稱]] — 一句話描述。
    - Entities/Concepts: 使用 Title Case 命名（單字首字母大寫，單字間使用空白）。
    - Sources/Syntheses: 使用 kebab-case 命名。
    範例：
    ```markdown
    # Wiki Index

    ## Sources
    - [[summary-source-slug]] — 該資料的核心主旨摘要。

    ## Entities
    - [[Entity Name]] (或 [[Author Name]]) — 實體身份或核心功能。

    ## Concepts
    - [[Concept Name]] — 概念或框架的核心定義。

    ## Syntheses
    - [[synthesis-slug]] — 該頁面回答的複雜問題。
    ```
2. **`wiki/log.md` (操作日誌)**：
    只能追加寫入（Append-only）。每次操作後記錄：`## [YYYY-MM-DD] <動作> | <操作簡述>`。
    操作類型： ingest, query, lint, sync
    範例：
    ```markdown
    ## [2026-04-11] ingest | 引入專案 Claude Code 核心概念
    - **變更**: 新增 [[ClaudeCode]], [[summary-claude-code-docs]]; 更新 [[index.md]]
    - **衝突**: 無 (或: 衝突 [[RAG架構]], 已標註)

    ## [2026-04-11] query | 解析 Karpathy LLM-Wiki 理念
    - **輸出**: 已儲存至 [[分析-karpathy-wiki-philosophy]]

    ## [2026-04-11] lint | 周度健康檢查
    - **結果**: 修復 2 處死連結，發現 1 個孤兒頁面 [[UnlinkedPage]]
    ```
3. **內容分類**：
   - `/wiki/concepts/`：存放框架、取向、理論、研究變項、數學主題。
     - **Categories**: `Theory`, `Phenomenon`, `Methodology`, `Variable`, `Math_Topic`, `Approach`
   - `/wiki/entities/`：存放人物、機構、研究對象、期刊。
     - **Categories**: `Researcher`, `Institution`, `Population`, `Journal`
   - `/wiki/sources/`：存放文獻提煉摘要（Articles, Books, Reader Notes）。
4. **強制雙向連結與紀錄**：
   每一個 wiki 頁面必須包含 `## 關聯連結` (於 `index` 檔) 或 `---` 分隔線。最下方必須包含 `## 📝 創建與編修紀錄` 區塊，詳實記錄變動。
5. **矛盾處理原則**：
   如果新攝入的知識與舊知識衝突，不要靜默覆蓋。在頁面中新建 `## 知識衝突` 區塊，將兩種說法都保留並做對比。

# 工作流指令說明 (Workflows / Skills)
當被要求執行以下操作時，請遵循核心邏輯（未來可能由專用 Agent Skills 接管）：

- `/alloc`：文件預處理與自動分派。掃描 `inbox/` 目錄，**強制執行 ASCII 命名規範**：
  - **格式**：`YYYY_Author_ShortTitle.pdf` (例如 `2023_Geisler_Affect_Trajectory.pdf`)。
  - **淨化**：移除所有變音符號 (ü->u)、特殊字元與空白。
  - **功能**：根據內容識別屬性並移動至 `raw/` 對應子目錄。
- `/ingest <路徑>`：將 `raw/` 視為代碼，`wiki/` 視為編譯產物。讀取原始檔後，將其核心價值編譯、合併到 `wiki/` 的相關頁面中（若概念已存在則進行增量合併，而非重複創檔）。必須同步維護 index 和 links。
- `/query <問題>`：**深度檢索與知識合成迴圈**。
  1. 呼叫 `qmd` 引擎進行語義掃描。
  2. 綜合相關文獻給出詳盡回答（必須標註引用）。
  3. **持久化步驟**：主動提示使用者將回答內容寫入 `wiki/syntheses/` 下。
  4. **同步步驟**：一旦存檔，必須同步更新 `index.md` 與 `log.md`。
- `/lint`：全域掃描 `wiki/` 目錄（主動忽略 `skills-docs/`），找出孤立頁面、死連結以及邏輯衝突，並向我報告。

# 論文卡片 (Paper Cards — 卡片盒筆記) 規範
每張卡片應作為獨立檔案存在於 `wiki/cards/`，並遵循以下結構：
1. **標題 (Title)**：`## 概念名稱` (YAML 中的 title 也需同步，不加任何標籤符號)。
2. **來源 (Source)**：全合著者 (年份), [[出版期刊]], p. 頁碼 (或連結).
3. **想法/連結 (Thought/Link)**：啟發與想法、知識缺口、個人評論、與其他文獻的聯想。

### 🏆 最高優先級規則 (Highest Priority Rules)
- **實體化強制性 (Mandatory Materialization)**：每篇文章分析時，**必須同步** 產出所有作者、期刊、研究機構的實體頁面 (`wiki/entities/`)。
- **概念飽和度 (Concept Saturation)**：每篇文章必須提取 **至少 5 個** 關鍵字並實體化為概念頁面 (`wiki/concepts/`)，內容需包含學術定義與 STT 關聯。
- **強制雙向來源與貢獻追蹤 (Annotated Bidirectional Traceability)**：
  - 當建立/更新 Concept 或 Entity 時，**必須** 在其底層區塊（如 `源出處 & 相關文獻` 或 `相關著作與貢獻`），新增當前處理文章的連結。**嚴禁只放空連結**。
  - 對於 Concept：連結後方必須補充說明「這篇文章對這個概念有什麼特別的想法、批判、或應用」。
  - 對於 Entity (如 Researcher)：連結後方必須補充說明「該學者在這篇文章中提出了什麼核心洞見與貢獻」。
  - 當建立 Summary 文章時，**必須** 有專門區塊列出從本文提取的所有 Concepts 與 Entities，形成雙向錨定。
- **關鍵字飽和度 (Keyword Density)**：在 Source Summary 與 Paper Cards 中，必須大量嵌入並鏈結學術變項與關鍵字。
- **零遺漏同步 (Zero-gap Sync)**：檔案寫入、原子卡片生成、與 Index 索引同步必須在同一次對話任務中完整執行。
- **全量歸檔義務 (Recursive Archive Duty)**：任何被處理完畢的原始檔案，不論原先位於 `raw/` 下的哪個子目錄，一律必須立即移動至 `raw/09-archive/`。`raw/` 應僅保留「待處理」內容。
- **單一摘要義務 (Single Summary Duty)**：每一篇文獻在 `wiki/sources/` 中必須有且僅有一個摘要檔案。若發現重複，須立即整併。
- **原子補完義務 (Atomic Completion Duty)**：嚴禁遺留「紅鏈」。如果摘要中提到了新的 Card 或 Concept，AI 必須在該對話輪次結束前建立這些檔案。
- **精簡連結規則 (Simple Link Rule)**：內部連結僅使用 `[[Filename]]` 或 `[[Keyword]]`，**嚴禁** 包含 `wiki/concepts/` 等路徑前綴。
- **命名規範 (Naming Convention)**：
  - 英文文獻卡片：`card-YYYY-Author-ShortTitle.md`
  - 中文文獻卡片：`card-YYYY-中文作者-中文標題.md` (例如：`card-2023-吳明錡-大一意義感真空.md`)
- **證據導向增量合併 (Evidence-Based Merging)**：Card/Concept/Entity 必須根據文獻實體化。若卡片已存在，必須在原有內容後「增補」新證據，並論述與既有內容的關係（支持、修正或衝突）。
- **利用 CLI 工具**：優先使用 `qmd` 或 `grep` 進行知識查重，以減少 Token 損耗並確保一致性。


# 頁面 Frontmatter (YAML) 規範
所有生成的 wiki 頁面必須包含以下 YAML 頭部：
---
title: "English Title"
aliases: [中文名稱1, 中文名稱2]
type: concept | entity | source | synthesis | paper_card
tags: [keywords_in_english]
sources: [relative_path_to_raw]
last_updated: YYYY-MM-DD
---
