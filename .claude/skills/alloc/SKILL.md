---
name: alloc
description: 在 ingest 之前，將 inbox/ 目錄中的待分類檔案進行名稱標準化、屬性識別、並分派到 raw/ 對應的子目錄。支援 `/alloc` (掃描整個 inbox/) 或 `/alloc <path>` (處理指定檔案)。當使用者提到"整理檔案"、"分類檔案"、"準備攝取"時，也應該觸發此技能。
user-invocable: true
---

# alloc 技能 — 文件分派與預處理

統一入口，用於在正式的知識編譯（ingest）前，對 inbox/ 中的待處理檔案進行名稱標準化、屬性識別和自動分派。

## 核心工作流：準備層 (Preparation Layer)

**目錄結構約定：**
```
d:\llm-wiki-en\
├── inbox/                      ← 待分類檔案收件箱（輸入）
├── raw/
│   ├── 01-articles/            ← 學術論文、期刊文章 (PDF/MD)
│   ├── 02-books/               ← 書籍章節、整本書、教科書
│   ├── 03-reader-notes/        ← 讀者筆記、自我摘要、讀書心得
│   ├── 04-transcripts/         ← 影片轉錄、語音文稿 (演講、訪談)
│   └── 09-archive/             ← 已處理檔案歸檔
└── wiki/                       ← 編譯輸出層
```

## 觸發邏輯

1. **使用者執行 `/alloc`**：掃描 `inbox/` 下所有待分類檔案
2. **使用者執行 `/alloc <path>`**：僅處理指定檔案
3. **隱式觸發**：使用者說"整理檔案"、"準備攝取"、"分類這些資料"時，自動執行 alloc

## 分派流水線

對每個待分類檔案，嚴格按以下三步驟執行：

### 步驟 1：修復檔案名稱 (fix-name)

**目的**：去除會影響 Obsidian 和檔案系統處理的特殊字符。

**規則**：
- ❌ 移除特殊字符：`[`, `]`, `%`
- ❌ 移除或替換其他問題字符：`"`, `'`, `|`, `:`, `?`, `*`
- ✓ 將空白替換為下劃線 `_`
- ✓ 保留大小寫、數字、連字號 `-`、點 `.`

**範例：**
```
❌ [PDF] 2026-Nature-AI and Future Learning.pdf
✓ PDF_2026-Nature-AI_and_Future_Learning.pdf

❌ Karpathy's "LLM Wiki" [Updated].md
✓ Karpathy's_LLM_Wiki_Updated.md

❌ 論文%分析 [v2.1] 2026-04.pdf
✓ 論文分析_v2.1_2026-04.pdf
```

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
- `articles` — 學術論文、期刊文章、會議論文集、正式研究報告
  - 特徵：有摘要 (Abstract)、關鍵字、引用 (References)、DOI、正式結構、學術用語
- `books` — 書籍整本、章節、教科書
  - 特徵：章節結構明顯、長篇、有 ISBN/卷號、系統性知識、目錄
- `reader-notes` — 讀者摘要、讀後感、人工筆記
  - 特徵：第一人稱或評論觀點 ("我認為", "摘要如下")、非正式結構、多為 Markdown
- `transcripts` — 影片轉錄、演講文稿、會議錄音轉錄
  - 特徵：時間戳、發言人標籤、口語化、QA 結構

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

**目的**：根據識別結果，將標準化後的檔案移動到對應的 raw/ 子目錄。

**移動規則**：
```
修復名稱後的檔案 + 識別的 type → 目標目錄

alloc 流程中的 language 屬性用於日後 ingest 時的翻譯決策，
目前 move 步驟僅根據 type 判定目錄，不依賴 language。
```

**目錄對應**：
| 內容類型 | 目標目錄 | 預期檔案格式 |
|---------|---------|-----------|
| articles | `raw/01-articles/` | `.pdf`, `.md`, `.txt` |
| books | `raw/02-books/` | `.pdf`, `.epub`, `.md` |
| reader-notes | `raw/03-reader-notes/` | `.md`, `.txt` |
| transcripts | `raw/04-transcripts/` | `.md`, `.txt` |

**範例操作**：
```
inbox/Development_of_affect_at_the_transition_to_university_mathematics.pdf
  ↓ (fix-name: 已完成)
  ↓ (scan: type=papers, language=english)
  ↓ (move)
raw/02-papers/Development_of_affect_at_the_transition_to_university_mathematics.pdf
```

## 輸出與報告

完成分派後，生成結構化報告：

```markdown
## 📦 alloc 分派報告 — YYYY-MM-DD

### ✅ 成功分派 (N 個)
- [[inbox/File1.pdf]] → `raw/02-papers/`
- [[inbox/article.md]] → `raw/01-articles/`

### ⚠️ 需要手動確認 (N 個)
- [[inbox/unclear.md]] — 無法自動判定 type，建議檢查並手動分類

### ❌ 失敗或跳過 (N 個)
- [[inbox/corrupted.pdf]] — 無法讀取，請確認檔案完整性

### 📊 統計
- 總計處理：N 個檔案
- 成功分派率：X%
```

## 與 ingest 的銜接

alloc 完成後，所有檔案已整齊放在 raw/ 對應子目錄中，準備就緒。

使用者可隨後執行：
```
/ingest
```

ingest skill 會自動掃描 raw/01-articles, raw/02-papers 等，開始知識編譯流程。

## 注意事項

- ✅ 使用標準化、清潔的檔案名稱，便於後續 Obsidian 引用
- ✅ 識別時優先檢查 frontmatter 中的 metadata（如有）
- ✅ 對於混合語言或模糊類型的檔案，保守判定並報告為"需要手動確認"
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

**Q: 如何判定一份文件是 paper 還是 article？**
A: 
- Papers 通常有**摘要 (abstract)**、**引用 (references)**、**作者和機構信息**、或**圖表和資料表**
- Articles 通常是**評論性質**、**無引用清單**、或**時效性較強** (新聞、部落格)

**Q: 檔案無法自動判定時怎麼辦？**
A: alloc 會在報告中標記為"需要手動確認"，暫停分派。使用者可：
1. 手動指定 type：`/alloc inbox/file.md --type=papers`
2. 檢查檔案內容後決定
3. 或暫時放回 inbox/，稍後重新處理

**Q: 如何處理多語言檔案？**
A: alloc 優先判定主要語言。若無法確定，報告為"混合內容"，推薦使用者手動確認，或由 ingest 在編譯時進行後續處理。

---

*alloc 技能 — 讓檔案分派自動化，為知識編譯做好準備。*

**最後更新**：2026-04-16  
**維護者**：Claudian  
**狀態**：✅ 活躍
