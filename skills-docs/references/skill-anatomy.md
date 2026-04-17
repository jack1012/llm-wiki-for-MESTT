# Skill 解剖圖 — 了解 Skill 的標準結構

了解 Claude Code skills 的標準結構，以便更好地理解和使用這些工具。

---

## Skill 的基本構成

一個完整的 Skill 包含以下層次的信息：

```
Skill
├── 元數據層 (Metadata)
│   ├── name — skill 名稱
│   ├── description — 簡短描述 + 觸發條件
│   └── compatibility — 依賴 (可選)
│
├── 定義層 (SKILL.md)
│   ├── 核心能力 — 主要功能列表
│   ├── 觸發條件 — 自動啟動的場景
│   ├── 工作流程 — 步驟說明
│   ├── 參數配置 — 可配置的選項
│   ├── 使用範例 — 2-3 個實例
│   └── 故障排除 — FAQ
│
└── 支援層 (Resources) [可選]
    ├── scripts/ — 可執行代碼
    ├── references/ — 詳細文檔
    └── examples/ — 進階範例
```

---

## 1. 元數據層 — YAML Frontmatter

每個 skill 的 SKILL.md 頂部包含 YAML frontmatter：

```yaml
---
name: skill-name
description: [簡短描述] Use this skill when [觸發場景]
user-invocable: true | false
compatibility: [可選的依賴說明]
---
```

### 字段說明

| 字段 | 類型 | 必需 | 說明 |
|------|------|------|------|
| `name` | string | ✅ | 技能識別符（kebab-case） |
| `description` | string | ✅ | 簡短說明 + 觸發條件（100-200 字） |
| `user-invocable` | boolean | ❌ | 是否可手動觸發（預設 true） |
| `compatibility` | string | ❌ | 依賴或要求的說明 |

### 範例

```yaml
---
name: pdf
description: Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.
license: Proprietary. LICENSE.txt has complete terms
---
```

---

## 2. 定義層 — SKILL.md 正文

### 2.1 核心能力

**目的**：清楚列出 skill 能做什麼

**格式**：
```markdown
## 核心能力

- **能力 1**：詳細說明 (1-2 句)
- **能力 2**：詳細說明
- ...
```

**範例**：
```markdown
## 核心能力

- **讀取 PDF** — 支援文本提取、元數據提取
- **提取表格** — 自動識別和格式化為 Markdown 表格
- **合併 PDF** — 將多個檔案合併為一個
- **填寫表單** — 識別和自動填充表單欄位
```

### 2.2 觸發條件

**目的**：説明何時自動啟動此 skill

**格式**：
```markdown
## 觸發條件

使用者在以下情況自動啟動此技能：

- 觸發短語 1
- 觸發短語 2
- `/skill-command`
```

**規範**：
- 包含 3-5 個常見觸發短語
- 包含 `/command` 形式（如果有）
- 短語應該是真實的使用者表述

**範例**：
```markdown
## 觸發條件

使用者在以下情況自動啟動此技能：

- 「提取這個 PDF 表格」
- 「合併這些 PDF 檔案」
- 「填寫 PDF 表單」
- `/pdf`
```

### 2.3 工作流程

**目的**：説明 skill 如何執行，分為清晰的步驟

**格式**：
```markdown
## 工作流程

### 步驟 1：描述
詳細説明此步驟做什麼、為什麼

### 步驟 2：描述
...
```

**規範**：
- 通常 3-6 個步驟
- 每個步驟 1-3 段落
- 包括邏輯流程和決策點

**範例**：
```markdown
## 工作流程

### 步驟 1：掃描原始檔
讀取 raw/ 下所有子目錄（除 09-archive/），找出待處理檔案。

### 步驟 2：提煉核心
從原始檔中提取：
- 核心主旨（1-2 句話）
- 實體（人物、公司、工具）
- 概念（框架、方法論）

### 步驟 3：建立摘要頁面
在 wiki/sources/ 建立 Markdown 檔案，記錄來源和關聯連結。
```

### 2.4 參數配置

**目的**：説明 skill 的可調參數（如果有）

**格式**：
```markdown
## 參數配置

| 參數 | 類型 | 說明 | 預設值 |
|------|------|------|--------|
| `param1` | string | 說明 | `default` |
| `param2` | boolean | 說明 | `true` |
```

**規範**：
- 只列出可配置的參數
- 包括類型、說明、預設值
- 提供使用範例

**範例**：
```markdown
## 參數配置

| 參數 | 類型 | 說明 | 預設值 |
|------|------|------|--------|
| `scope` | string | 查詢範圍：`all` \| `custom` \| `official` | `all` |
| `format` | string | 輸出格式：`brief` \| `detailed` | `detailed` |
| `include_history` | boolean | 是否包含變更記錄 | `false` |

### 使用範例

```
# 只顯示官方 skills，簡要格式
/skills-registry scope:official format:brief

# 顯示所有 skills，包含歷史
/skills-registry include_history:true
```
```

### 2.5 使用範例

**目的**：提供實際使用例子，幫助使用者快速上手

**格式**：
```markdown
## 使用範例

### 範例 1：[場景名稱]

[描述場景]

```
[具體的使用指令或操作]
```

[預期結果]
```

**規範**：
- 至少 2-3 個範例
- 涵蓋不同的使用場景（簡單、中等、進階）
- 包括操作、流程和結果
- 實際且可複製

### 2.6 故障排除

**目的**：回答常見問題和解決常見問題

**格式**：
```markdown
## 故障排除

### Q: 常見問題？

**A:** 解決方案說明
```

**規範**：
- 列出 3-5 個常見問題
- 提供清晰的解決步驟
- 包括預防措施

---

## 3. 支援層 — 可選資源

### 3.1 Scripts 目錄

**用途**：存放可執行的代碼或指令碼

```
scripts/
├── script1.py
├── script2.js
└── utils.py
```

**規範**：
- 清晰的檔名（描述功能）
- 包含註釋說明
- 可獨立運行或透過 skill 調用

### 3.2 References 目錄

**用途**：存放詳細的參考文檔

```
references/
├── api-reference.md    # API 詳細說明
├── advanced-guide.md   # 進階使用指南
└── troubleshooting.md  # 深度故障排除
```

**規範**：
- 內容可超過 500 行
- 清晰的目錄和索引
- 清楚指出何時使用

### 3.3 Examples 目錄

**用途**：存放進階或特化的使用範例

```
examples/
├── workflow-example.md       # 工作流組合範例
├── integration-example.md    # 與其他 skills 整合
└── custom-usecase.md         # 特定領域範例
```

---

## 4. Skill 的尺寸指南

### SKILL.md 長度指南

| 部分 | 建議長度 | 說明 |
|------|---------|------|
| 元數據 | 1-2 行 | YAML frontmatter |
| 簡介 | 50-100 字 | 一段話概要 |
| 核心能力 | 200-300 字 | 3-5 個能力 |
| 觸發條件 | 100-150 字 | 3-5 個觸發場景 |
| 工作流程 | 500-800 字 | 3-6 個步驟 |
| 參數配置 | 200-300 字 | 參數表 + 使用例 |
| 使用範例 | 800-1200 字 | 2-3 個完整範例 |
| 故障排除 | 300-500 字 | 3-5 個 Q&A |
| **總計** | **2000-3500 字** | **理想完整 SKILL.md** |

**規則**：SKILL.md 正文應該 < 500 行。如果超過，考慮將詳細內容移到 references/ 目錄。

---

## 5. Skill 的分類系統

### 按功能分類

```
知識管理
├── ingest — 資料攝入
├── lint — 健康檢查
└── query — 知識查詢

文檔與 PDF
├── pdf — PDF 處理
└── defuddle — 網頁提取

Obsidian 整合
├── obsidian-markdown
├── obsidian-bases
├── obsidian-cli
└── json-canvas

開發工具
├── skill-creator
└── skills-registry
```

### 按來源分類

```
官方 Skills (Anthropic)
├── pdf
├── skill-creator
└── obsidian-* (5 個)

自訂 Skills (本地建立)
├── ingest
├── lint
├── query
└── skills-registry
```

### 按成熟度分類

```
✅ 穩定 (已驗證且使用)
├── ingest
├── lint
├── query
├── obsidian-* (5 個)
└── defuddle

🟡 Beta (新或未廣泛測試)
├── pdf
├── skill-creator
└── skills-registry

❌ 已棄用 (不再使用)
└── [無]
```

---

## 6. Skill 命名約定

### Name 字段

**規則**：
- 使用 kebab-case（全小寫，單詞用 `-` 分隔）
- 簡短（2-4 個詞）
- 描述性（一看就知道做什麼）

**範例**：
```
✅ pdf           — 清晰簡潔
✅ obsidian-markdown  — 描述性
✅ skills-registry    — 清晰
❌ PDFProcessor   — 大小寫混亂
❌ pdf-processing-utility — 太長
```

### Description 字段

**規則**：
- 開始於動詞或「Use this skill when」
- 包含 2-3 個主要用途
- 包含何時觸發的具體短語
- 100-200 字

**範例**：
```
❌ 「PDF 處理工具」— 太簡短，無觸發條件
✅ 「Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.」
```

---

## 7. 範例：完整的 Skill 結構

```
.claude/skills/my-skill/
├── SKILL.md                 (200-500 行)
│   ├── ---frontmatter---
│   ├── # Title
│   ├── ## 核心能力
│   ├── ## 觸發條件
│   ├── ## 工作流程
│   ├── ## 參數配置
│   ├── ## 使用範例
│   └── ## 故障排除
│
├── references/              (可選)
│   ├── api-reference.md
│   ├── advanced-guide.md
│   └── troubleshooting.md
│
├── scripts/                 (可選)
│   ├── script1.py
│   └── script2.py
│
└── examples/                (可選)
    ├── example1.md
    └── example2.md
```

---

## 8. 質量檢查清單

建立或修改 skill 時，檢查以下項目：

### 結構檢查
- [ ] 包含有效的 YAML frontmatter
- [ ] 有清晰的核心能力列表
- [ ] 有具體的觸發條件
- [ ] 有步驟清晰的工作流程
- [ ] 有 2-3 個實際使用範例
- [ ] 有基本的故障排除

### 內容檢查
- [ ] 描述清晰簡潔
- [ ] 範例可以實際複製執行
- [ ] 沒有過時的資訊
- [ ] 與其他 skills 的關係已說明
- [ ] 所有連結都有效

### 格式檢查
- [ ] Markdown 語法正確
- [ ] 代碼塊有語言標記
- [ ] 表格格式整齊
- [ ] 標題層級一致（# ## ###）

---

*Skill 解剖圖 — 理解每個 skill 的標準結構和最佳實踐。*
