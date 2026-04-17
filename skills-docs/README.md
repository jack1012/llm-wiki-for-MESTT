# Skills Registry — 本地技能管理系統

一個統一的入口，用於管理、追蹤、查詢所有已安裝的 Claude Code skills。

---

## 📚 檔案導覽

### 📋 主要檔案

| 檔案 | 用途 |
|------|------|
| **README.md** | 本檔案 — skills 系統概覽 |
| **[[guide.md]]** | 10 個 skills 的完整使用指南 |
| **[[changelog.md]]** | Append-only 變更日誌 |

### 📁 子資料夾

#### **manifests/** — Skill 集合清單

每個 skill 集合（或分類）都有自己的 manifest 檔案，詳細列出該集合中的所有 skills。

| Manifest 檔案 | 涵蓋的 Skills |
|---------------|-----------------|
| **[[manifests/obsidian-skills.md]]** | obsidian-markdown, obsidian-bases, obsidian-cli, json-canvas, defuddle（5 個）✨ 已建立 |
| **[[manifests/knowledge-system.md]]** | alloc, ingest, lint, fix, query（5 個）✨ 已建立 |
| **[[manifests/development-tools.md]]** | skill-creator, skills-registry（2 個）✨ 已建立 |
| **manifests/pdf-processing.md** (計畫中) | pdf |

每個 manifest 包含：
- 📦 Skill 列表和狀態表
- 📍 安裝位置和目錄結構
- 🎯 各 skill 的功能說明
- 📊 統計資訊和版本資訊

#### **references/** — 參考文檔

| 檔案 | 用途 |
|------|------|
| **[[references/skill-anatomy.md]]** | Skill 結構和最佳實踐 |

---

## 🎯 核心能力

1. **Skills 列表與介紹** — 展示所有已安裝的 skills，包含名稱、功能、觸發方式
2. **詳細使用指南** — 針對每個 skill 提供使用範例和最佳實踐
3. **變更歷史追蹤** — 記錄 skills 的增加、修改、移除、版本更新
4. **快速查詢** — 根據功能或場景推薦合適的 skill
5. **工作流推薦** — 提供多個 skills 的組合方案

---

## 📊 Skills 概覽

### 統計

```
總計：13 個 Skills
├── 自訂 Skills：7 個
│   ├── alloc — 文件分派與預處理
│   ├── ingest — 知識庫攝入
│   ├── lint — 健康檢查
│   ├── fix — 知識庫修復
│   ├── query — 知識查詢
│   └── skills-registry — 本系統
│
└── 官方 Skills：6 個
    ├── pdf — PDF 處理
    ├── skill-creator — 技能開發
    ├── obsidian-markdown — Markdown 編輯
    ├── obsidian-bases — 資料庫
    ├── obsidian-cli — CLI 操作
    ├── json-canvas — 視覺化
    └── defuddle — 網頁提取（實際上是官方）
```

### 按功能分類

**知識管理 (5 個)**
- [[alloc]] — 文件分派與預處理（修復名稱、識別屬性、分派分類）
- [[ingest]] — 知識庫攝入（6 步完整流程）
- [[lint]] — 健康檢查（死連結、孤兒頁面檢測）
- [[fix-wiki]] — 知識庫修復（自動修復死連結、同步索引）
- [[query]] — 知識查詢（本地 wiki 查詢）

**文檔與 PDF (2 個)**
- [[pdf]] — PDF 處理與表單填寫（8 個 Python 工具）
- [[defuddle]] — 網頁內容提取（HTML → Markdown）

**Obsidian 整合 (4 個)**
- [[obsidian-markdown]] — Markdown 編輯（Wikilinks、Embeds、Callouts）
- [[obsidian-bases]] — 資料庫視圖（表格、卡片、日曆、繪圖）
- [[obsidian-cli]] — CLI 操作（Vault 操作、Plugin 開發）
- [[json-canvas]] — Canvas 視覺化（流程圖、心智圖）

**開發工具 (2 個)**
- [[skill-creator]] — 技能開發工具（6 步開發生命週期）
- [[skills-registry]] — 本系統（Skills 管理）

---

## 🚀 快速開始

### 查詢 Skills

在聊天中使用以下短語自動觸發 skills-registry：

```
💡 「我有哪些 skills？」
💡 「怎麼使用 PDF skill？」
💡 「skills 的變更歷史」
💡 「推薦適合論文處理的 skill 組合」
```

### 查看 Skill 集合的詳細清單（Manifests）

查看 **manifests/** 資料夾中的檔案，瞭解特定 skill 集合的詳細資訊：

```
📁 manifests/
├── [[manifests/obsidian-skills.md]] — Obsidian 編輯與整合 skills
├── [[manifests/knowledge-system.md]] — 知識庫核心系統 skills
├── [[manifests/development-tools.md]] — 開發工具與系統管理 skills
└── manifests/pdf-processing.md (計畫中) — PDF 和文檔處理 skills
```

每個 manifest 包含：
- 📦 該集合中所有 skills 的列表和狀態
- 🎯 每個 skill 的功能和使用場景
- 📍 安裝位置和目錄結構
- 🔗 skills 之間的協同方式

### 閱讀完整使用指南

查看 **[[guide.md]]** 了解每個 skill 的：
- 功能說明
- 核心能力
- 觸發方式
- 使用範例
- 最佳實踐

### 查看變更記錄

檢查 **[[changelog.md]]** 瞭解：
- 新增的 skills
- 更新和改進
- 移除或棄用的 skills
- 版本歷史

---

---

## 📊 Manifests 說明

### 什麼是 Manifest？

Manifest 是特定 skill 集合的詳細清單。類似於 OBSIDIAN_SKILLS_MANIFEST.md，為了更好的組織，我們為每個 skill 分組建立獨立的 manifest 檔案。

### Manifest 的內容

每個 manifest 檔案包含：

1. **📦 Skill 列表表格** — 名稱、狀態、描述、版本
2. **📍 安裝位置** — 目錄樹結構
3. **🎯 各 skill 用途** — 詳細功能說明和使用場景
4. **📊 集成與推薦** — 與其他 skills 的協同方式
5. **🔗 相關資源** — 官方連結和文檔

### 使用場景

- 🔵 快速了解某個 skill 集合
- 🔵 查看集合內 skills 的安裝狀態
- 🔵 瞭解各 skill 之間的協同方式
- 🔵 追蹤 skill 版本更新

### 已建立與計畫中的 Manifests

```
manifests/
├── obsidian-skills.md            ✅ 已建立
│   (Obsidian 編輯和整合相關 — 5 個 skills)
├── knowledge-system.md           ✅ 已建立
│   (知識庫核心系統 — 5 個 skills)
├── development-tools.md          ✅ 已建立
│   (技能開發和管理工具 — 2 個 skills)
└── pdf-processing.md             (計畫中)
    (PDF 和文檔處理相關)
```

---

## 💡 常見工作流

### 工作流 1：完整檔案處理流程

```
1️⃣ [[alloc]] — 整理 inbox/ 檔案，分派到 raw/
   ↓
2️⃣ [[ingest]] — 編譯內容到 wiki/
   ↓
3️⃣ [[lint]] — 檢查知識庫健康狀況
   ↓
4️⃣ [[fix-wiki]] — 修復發現的問題
   ↓
5️⃣ [[query]] — 驗證知識可查詢性
```

### 工作流 2：完整論文處理

```
1️⃣ [[alloc]] — 分派論文到 raw/02-papers/
   ↓
2️⃣ [[pdf]] — 讀取論文，提取表格
   ↓
3️⃣ [[ingest]] — 編譯內容到 wiki/
   ↓
4️⃣ [[skill-creator]] — 建立「論文分析技能」
   ↓
5️⃣ [[query]] — 查詢和綜合知識
```

### 工作流 3：網頁知識擷取

```
1️⃣ [[defuddle]] — 清潔網頁內容
   ↓
2️⃣ obsidian-markdown — 建立筆記
   ↓
3️⃣ [[alloc]] — 分派到 raw/01-articles/
   ↓
4️⃣ [[ingest]] — 匯入知識庫
   ↓
5️⃣ [[lint]] — 檢查完整性
```

### 工作流 4：每週知識庫維護

```
每週執行：
1. [[alloc]] — 掃描 inbox/，分派新檔案
2. [[ingest]] — 處理待攝取檔案
3. [[lint]] — 健康檢查
4. [[fix-wiki]] — 修復發現的問題
5. [[query]] — 驗證知識可查詢性
```

---

## 📖 文檔說明

### [[guide.md]] — 完整使用指南

13 個 skills 的詳細說明，每個包含：
- 📝 功能說明（3-5 句話）
- ⚡ 核心能力（5-8 個能力）
- 🔔 觸發方式（3-5 個觸發短語）
- 💡 使用範例（3-5 個詳細範例）
- ✅ 最佳實踐（DO 和 DON'T）
- 🎯 進階用法（與其他 skills 整合）

**推薦**：當不確定如何使用某個 skill 時，查看此文檔。

### [[changelog.md]] — 變更日誌

Append-only 日誌，記錄所有 skills 的生命週期：

```
## [日期] 變更

### ✨ 新增 Skills
- [[skill-name]] v1.0 — 功能描述

### 🔄 更新 Skills  
- [[skill-name]] — 更新說明

### ❌ 移除 Skills
- [[skill-name]] — 原因說明
```

**推薦**：定期查看瞭解 skills 的最新變化。

### [[references/skill-anatomy.md]] — Skill 結構參考

深度指南，解釋 Skill 的標準結構：
- Skill 的 4 層構成（元數據、定義、支援層）
- YAML Frontmatter 規範
- SKILL.md 各部分的內容指南
- 命名約定和最佳實踐
- 質量檢查清單

**推薦**：當想建立新的 skill 時查看此文檔。

---

## 📁 完整目錄結構

```
F:\Dropbox\claude_code\
├── skills-docs/                    ← 使用者文檔（本目錄）
│   ├── README.md                   ← 總覽（本檔案）
│   ├── guide.md                    ← 10 個 skills 完整使用指南
│   ├── changelog.md                ← Append-only 變更日誌
│   ├── manifests/                  ← 各 skill 集合的詳細清單
│   │   ├── obsidian-skills.md      ← Obsidian skills manifest
│   │   ├── pdf-processing.md       (未來)
│   │   ├── knowledge-system.md     (未來)
│   │   └── development-tools.md    (未來)
│   └── references/
│       └── skill-anatomy.md        ← Skill 結構參考
│
├── .claude/skills/                 ← AI 系統檔案
│   ├── ingest/
│   ├── lint/
│   ├── query/
│   ├── skill-creator/
│   ├── pdf/
│   ├── skills-registry/            ← AI 讀取的官方定義
│   │   └── SKILL.md
│   ├── obsidian-markdown/
│   ├── obsidian-bases/
│   ├── obsidian-cli/
│   ├── json-canvas/
│   └── defuddle/
│
├── wiki/                           ← 知識庫
├── raw/                            ← 原始資料
├── assets/                         ← 媒體資源
└── [其他檔案]
```

---

## 🔗 相關檔案

- **[[CLAUDE.md]]** — 項目總規範
- **[[GIT_WORKFLOW.md]]** — Git 工作流指南
- **[[OBSIDIAN_SKILLS_MANIFEST.md]]** — Obsidian Skills 詳細清單
- **[[wiki/log.md]]** — 知識庫操作日誌

---

## ✨ 系統特點

✅ **完整性** — 涵蓋所有 11 個 skills  
✅ **易用性** — 在 Obsidian 中直接查看  
✅ **可追蹤** — Append-only 變更日誌  
✅ **實用性** — 提供具體使用範例  
✅ **可擴展** — 標準化結構，便於添加新 skills  

---

## 🆘 需要幫助？

| 場景 | 查看 |
|------|------|
| 「我有哪些 skills？」 | 本檔案（README.md） |
| 「怎麼使用某個 skill？」 | **[[guide.md]]** |
| 「最近有什麼更新？」 | **[[changelog.md]]** |
| 「想建立新 skill？」 | **[[references/skill-anatomy.md]]** |

---

**最後更新**：2026-04-16  
**位置**：`F:\Dropbox\claude_code\skills-docs\`  
**狀態**：✅ 完整就緒
