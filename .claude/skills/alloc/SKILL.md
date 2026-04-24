---
name: alloc
description: 在 ingest 之前，將 inbox/ 目錄中的待分類檔案進行名稱規範檢查、屬性識別、並分派到 raw/ 或 99-fixme/ 對應的子目錄。支援 `/alloc` (掃描整個 inbox/) 或 `/alloc <path>` (處理指定檔案)。當使用者提到"整理檔案"、"分類檔案"、"準備攝取"時，也應該觸發此技能。
user-invocable: true
---

# alloc 技能 — 文件分派與預處理

統一入口，用於在正式的知識編譯（ingest）前，對 inbox/ 中的待處理檔案進行名稱規範檢查、屬性識別和自動分派。

## 核心工作流：準備層 (Preparation Layer)

**目錄結構約定：**
```
F:\Dropbox\claude_code\
├── inbox/                      ← 待分類檔案收件箱（輸入）
├── raw/
│   ├── 01-articles/            ← 網頁文章、blog、新聞
│   ├── 02-papers/              ← 學術論文、研究報告、PDF
│   ├── 03-transcripts/         ← 影片轉錄、語音文稿
│   ├── 04-book/                ← 書籍摘要、電子書章節
│   └── 09-archive/             ← 已處理檔案歸檔
├── 99-fixme/                   ← 檔案名稱問題的檔案（待人工確認）
└── wiki/                       ← 編譯輸出層
```

## 觸發邏輯

1. **使用者執行 `/alloc`**：掃描 `inbox/` 下所有待分類檔案
2. **使用者執行 `/alloc <path>`**：僅處理指定檔案
3. **隱式觸發**：使用者說"整理檔案"、"準備攝取"、"分類這些資料"時，自動執行 alloc

## 分派流水線

對每個待分類檔案，按以下三步驟執行：

### 步驟 1：檢查檔案名稱規範 (validate-name)

**目的**：檢查檔案名稱是否符合學術文獻命名規範。不符合的檔案移到 `99-fixme/` 待人工確認。

**規範標準**：`YYYY_Author_Surname_ShortTitle.extension`

**檢查規則**：
1. **年份 (YYYY)**：檔名以 4 位數年份開頭（如 `2023`）
2. **作者 (Author)**：有明確的作者或組織名稱
3. **標題簡述 (ShortTitle)**：包含有意義的內容描述
4. **字元檢查 (ASCII-friendly)**：
   - ❌ **有特殊問題字符**：`[ ] ( ) % " ' | : ? * &` 等非 ASCII 字符，或包含明顯錯誤命名
   - ✓ **可接受**：年份_作者_標題 的基本格式，縱使不完全規範也可接受

**規範判定邏輯**：
| 檔名範例 | 判定 | 行動 |
| :--- | :--- | :--- |
| `2021_Geisler_AffectDevelopment.pdf` | ✅ 規範 | 正常分類到 `raw/` |
| `Development_of_affect_at_the_transition...pdf` | ⚠️ 年份缺失 | 移到 `99-fixme/` |
| `[PDF] 2021-Nature-Rolka & Geisler.pdf` | ⚠️ 特殊字符 | 移到 `99-fixme/` |
| `Journal_für_Mathematik_Didaktik.md` | ⚠️ 缺年份和作者 | 移到 `99-fixme/` |
| `2024_Students_Resilience.pdf` | ✅ 規範 | 正常分類到 `raw/` |

**注意**：只有明顯不符合「年份_作者_標題」基本結構的檔案才移到 `99-fixme/`。不會強制修改檔名，保留原始檔名不變。

### 步驟 2：識別檔案屬性 (scan)

**目的**：讀取檔案內容，判定其語言和知識類型，決定應分派到哪個 raw/ 子目錄。

**屬性維度 1：語言 (language)**
- `english` — 英文內容
- `中文` — 繁體中文或簡體中文內容

**識別方法**：
- 讀取檔案的前 500 字元或標題
- 計算英文字符 vs 中文字符的比例
- 若超過 60% 英文 → english；若超過 60% 中文 → 中文
- 混合內容時，以主要語言判定

**屬性維度 2：內容類型 (type)**
- `articles` — 網頁文章、部落格、評論、新聞報導
  - 特徵：較短、時效性、評論觀點、網頁源
- `papers` — 學術論文、研究報告、調查、技術文件
  - 特徵：有摘要、引用、實驗數據、正式結構
- `transcripts` — 影片轉錄、播客文稿、演講稿
  - 特徵：時間戳、發言人標籤、口頭語言
- `book` — 書籍摘要、電子書章節、教科書內容
  - 特徵：長篇、章節編號、系統教學、書籍參考

**識別流程**：
1. 檢查檔案名稱中的線索（如 `transcript`, `paper`, `article`）
2. 閱讀檔案標題、開頭段落或 frontmatter
3. 尋找結構指標（摘要、引用、章節號等）
4. 根據內容與風格綜合判定

**範例識別**：
```
✓ "Development of affect at the transition to university mathematics..."
  → type: papers (有摘要結構、學術用語)
  → language: english

✓ "一個統一的入口，用於管理、追蹤、查詢所有已安裝的 Claude Code skills"
  → type: articles (文檔、說明文)
  → language: 中文

✓ "[00:15] Alice: 今天我們來討論機器學習..."
  → type: transcripts (時間戳、發言人)
  → language: 中文
```

### 步驟 3：移動檔案 (move)

**目的**：根據步驟 1 的規範檢查和步驟 2 的內容識別，將檔案移動到對應的目錄。

**移動規則**：
```
檔案規範檢查 + 內容識別結果 → 目標目錄

alloc 流程中的 language 屬性用於日後 ingest 時的翻譯決策，
目前 move 步驟僅根據 type 判定目錄，不依賴 language。
```

**目錄對應**：
| 規範狀態 | 內容類型 | 目標目錄 | 預期檔案格式 |
|---------|---------|---------|-----------|
| ✅ 規範 | articles | `raw/01-articles/` | `.md`, `.txt` |
| ✅ 規範 | papers | `raw/02-papers/` | `.pdf`, `.md` |
| ✅ 規範 | transcripts | `raw/03-transcripts/` | `.md`, `.txt` |
| ✅ 規範 | book | `raw/04-book/` | `.md`, `.pdf` |
| ⚠️ 不規範 | (任意) | `99-fixme/` | 所有格式 |

**範例操作**：
```
✅ 規範檔案：
inbox/2024_Geisler_StudentResilience.pdf
  ↓ (validate: 規範)
  ↓ (scan: type=papers, language=english)
  ↓ (move)
raw/02-papers/2024_Geisler_StudentResilience.pdf

⚠️ 不規範檔案（保留原始檔名）：
inbox/Development_of_affect_at_the_transition.pdf
  ↓ (validate: 缺年份和作者，不規範)
  ↓ (move)
99-fixme/Development_of_affect_at_the_transition.pdf

inbox/[PDF] 2021-Study-Effect.pdf
  ↓ (validate: 包含特殊字符，不規範)
  ↓ (move)
99-fixme/[PDF] 2021-Study-Effect.pdf
```

## 輸出與報告

完成分派後，生成結構化報告：

```markdown
## 📦 alloc 分派報告 — YYYY-MM-DD

### ✅ 規範檔案已分派 (N 個)
- 2024_Geisler_StudentResilience.pdf → `raw/02-papers/`
- student_research_notes.md → `raw/01-articles/`

### ⚠️ 不規範檔案已移至待處理 (N 個)
檔案名稱有問題，已移到 `99-fixme/` 待人工確認與重命名：
- Development_of_affect_at_the_transition.pdf — 缺年份與作者
- [PDF] 2021-Study-Effect.pdf — 包含特殊字符

### ❌ 無法處理 (N 個)
- corrupted.pdf — 無法讀取，請確認檔案完整性

### 📊 統計
- 總計處理：N 個檔案
- 規範分派：X 個 (X%)
- 不規範移至 99-fixme：Y 個 (Y%)
- 無法處理：Z 個 (Z%)
```

**99-fixme 目錄說明**：
不規範的檔案保留原始檔名，供人工檢查與決策。可執行以下操作：
1. 手動重命名為規範格式後，移到 `raw/` 對應子目錄
2. 或在 `/alloc` 時使用 `--type=papers` 等參數直接指定類型進行重新處理

## 與 ingest 的銜接

alloc 完成後，所有檔案已整齊放在 raw/ 對應子目錄中，準備就緒。

使用者可隨後執行：
```
/ingest
```

ingest skill 會自動掃描 raw/01-articles, raw/02-papers 等，開始知識編譯流程。

## 注意事項

- ✅ **保留原始檔名**：不強制重命名，只進行規範檢查
- ✅ 規範的檔案移到 `raw/` 對應子目錄
- ✅ 不規範的檔案移到 `99-fixme/` 供人工確認
- ✅ 識別時優先檢查 frontmatter 中的 metadata（如有）
- ✅ 對於混合語言或模糊類型的檔案，保守判定並報告
- ❌ 不要修改原始檔內部的文字內容
- ❌ 不要刪除或丟棄任何檔案，只進行移動
- ❌ 如果 inbox/ 目錄不存在，應建立提示而非創建

## 參數配置

| 參數 | 類型 | 說明 | 預設值 |
|------|------|------|--------|
| `path` | string | 指定檔案或目錄路徑（相對 vault root） | `inbox/` |
| `auto_confirm` | boolean | 是否自動確認分派（否則暫停询問） | `false` |
| `report_format` | string | 報告格式：`brief` \| `detailed` | `detailed` |

## 故障排除

**Q: 為什麼我的檔案被移到 99-fixme？**
A: 檔案名稱不符合基本規範 `YYYY_Author_Title` 格式。常見原因：
- 缺少年份（4 位數開頭）
- 缺少作者或組織名稱
- 包含 `[ ] ( ) % " ' | : ? *` 等特殊字符
- 純粹是描述性標題，沒有明確的出版信息

**Q: 如何處理 99-fixme 中的檔案？**
A: 有兩個選項：
1. **手動重命名後移回**：改為 `YYYY_Author_ShortTitle.ext` 格式後，重新執行 `/alloc 99-fixme/` 
2. **指定內容類型重新處理**：`/alloc 99-fixme/myfile.pdf --type=papers` 會忽略名稱檢查，直接分類

**Q: 如何判定一份文件是 paper 還是 article？**
A: 
- Papers 通常有**摘要 (abstract)**、**引用 (references)**、**作者和機構信息**、或**圖表和資料表**
- Articles 通常是**評論性質**、**無引用清單**、或**時效性較強** (新聞、部落格)

**Q: 如何處理多語言檔案？**
A: alloc 優先判定主要語言。若無法確定，報告為"混合內容"，推薦使用者手動確認，或由 ingest 在編譯時進行後續處理。

---

*alloc 技能 — 讓檔案分派自動化，為知識編譯做好準備。*

**最後更新**：2026-04-19  
**維護者**：Claudian  
**狀態**：✅ 活躍

---

## 更新日誌

### 2026-04-19 — 改進版本 v2
**改動**：從強制重命名改為規範檢查 + 分類隔離
- ❌ 移除：強制標準化檔名的 fix-name 步驟
- ✅ 新增：名稱規範檢查，不符合的檔案移到 `99-fixme/`
- ✅ 新增：支援 `--type=papers` 參數跳過規範檢查
- ✅ 新增：詳細說明 99-fixme 的後續處理方式
