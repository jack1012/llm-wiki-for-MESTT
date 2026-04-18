---
name: ingest
description: 將 raw/ 目錄下的原始資料編譯到 wiki/ 中。支援 `/ingest` 或 `/ingest <path>`。
user-invocable: true
---

# ingest 技能 (V2.0 - 自動化歸檔與深度合併版)

## 核心工作流：Inbox & Archive

你正在維護一個 **LLM Wiki**。`raw/` 目錄是收件箱，`wiki/` 是編譯輸出層。

**目錄結構與歸檔律令：**
- `raw/01-articles/` / `raw/02-papers/` / `raw/03-transcripts/` — 待處理原始檔。
- `raw/09-archive/` — **已處理檔案的強制歸檔目錄**。
- **強制位移規則**：凡是 `/ingest` 完成的檔案，必須在該對話結束前，由 AI 執行 `mv` 或 `Move-Item` 指令移入 `09-archive/`。**不再需要手動在進度表中勾選歸檔項。**

## 觸發邏輯

1. **`/ingest <path>`**：處理指定案號檔案。
2. **隱式觸發**：當識別到新上傳的文獻時自動啟動。

## ⚠️ 步驟 0：Alloc (案號分配與標準化命名)
在開始分析前，必須確認檔案已符合規範：
1. **檢查案號**：若未分配案號，從 `INGEST_TRACKER.md` 取得下一個編號。
2. **強制重命名**：將檔案重新命名為 `[案號] 作者 - 年份 - 標題.pdf` (ASCII 規範)。
3. **登錄**：將基礎資訊登錄至 `INGEST_TRACKER.md`，狀態設為 `🏗️`。

## 🚀 兩階段編譯流水線

對每個檔案，嚴格分兩次輸出執行：

### 第一階段：來源摘要與學術分析 (Pass 1-4)

#### 📛 Source 檔案命名規範（強制）
Source 檔案必須嚴格遵循以下格式：
```
summary-{YYYY}-{author}-{short-title}.md
```
- **YYYY**：論文出版年份（4 位數字），**必須緊接在 `summary-` 之後**
- **author**：第一作者姓氏（小寫，kebab-case）
- **short-title**：2-4 個英文單字的標題簡稱（小寫，kebab-case）

**正確範例**：
- `summary-2023-geisler-beliefs-path.md`
- `summary-2016-gueudet-survey.md`
- `summary-2009-artigue-bosch-networking.md`

**錯誤範例**：
- ✗ `summary-geisler-beliefs-path-2023.md`（年份不在前面）
- ✗ `summary-affective-variables-in-transition.md`（缺少年份和作者）
- ✗ `summary-mathematical-crisis-stt.md`（缺少年份和作者）

產出並建立 `wiki/sources/summary-{YYYY}-{author}-{short-title}.md`：
- **Pass 1: Profile** (元數據提取)
- **Pass 2: Analysis** (5W1H 深度導航)
- **Pass 3: Critical Review** (APA 引用與核心評論)
- **Pass 4: Models & Variables** (Mermaid 模型視覺化)

### 第二階段：知識網格化 (5 Concepts + 2 Cards)
根據摘要，進一步產出：
1. **5 個概念頁面** (`wiki/concepts/`)：
   - **深度合併原則**：若概念頁面已存在，**禁止**僅添加來源連結。必須從本文獻中提取「新的看法」、「新的應用脈絡」或「新的理論演進」進行增量補充。
2. **2 張原子研究卡片** (`wiki/cards/`)：
   - 每張卡片開頭必須包含 `Parent Source: [[summary-source-slug]]`。
3. **實體頁面更新** (`wiki/entities/`)：
   - **新職位/面向原則**：若研究者/機構實體已存在，必須更新其最新的學術職位、研究興趣的轉移或在本文獻中展現的新研究面向。

---

### 步驟 5：索引同步與物理歸檔 (阻塞性步驟)

1. **更新 `wiki/index.md`**。
2. **寫入 `wiki/log.md`**。
3. **終極步驟：強制移動檔案**
   - 執行：`Move-Item "d:\llm-wiki-en\raw\path\file.pdf" "d:\llm-wiki-en\raw\09-archive\"`
   - 更新 `INGEST_TRACKER.md` 狀態為 `✅ COMPLETED`。

## 注意事項
- **禁止跨語言分析**：英文文獻用英文寫 Body，中文文獻用中文。
- **Title Case 命名**：實體與概念命名一律首字母大寫，單字間留空格。
- **雙向連結飽和度**：連結必須在內文中自然嵌入，不得產生孤立頁面。