---
name: skills-registry
description: 本地 skills 管理系統。使用此技能查看所有已安裝的 skills、瞭解各 skill 的功能與用途、查詢 skills 的變更歷史、或獲取特定 skill 的使用指南。當使用者詢問「我有哪些 skills」、「如何使用某個 skill」、「skills 的歷史」等時，自動觸發此技能。
user-invocable: true
---

# Skills Registry — 本地技能管理系統

一個統一的入口，用於管理、追蹤、查詢所有已安裝的 Claude Code skills。

## 核心能力

1. **Skills 列表與介紹** — 展示所有已安裝的 skills，包含名稱、功能、觸發方式
2. **Manifest 系統** — 按分類組織 skill 集合，提供詳細清單（obsidian-skills, pdf-processing, knowledge-system, development-tools）
3. **詳細使用指南** — 針對每個 skill 提供使用範例和最佳實踐（[[skills-docs/guide.md]]）
4. **變更歷史追蹤** — 記錄 skills 的增加、修改、移除、版本更新（[[skills-docs/changelog.md]]）
5. **快速查詢** — 根據功能或場景推薦合適的 skill 組合和工作流
6. **Meta 功能** — 自我更新和維護，支援新增 skills 的標準化流程

---

## 觸發條件

使用者在以下情況自動啟動此技能：

- 「我有哪些 skills？」
- 「怎麼使用 [skill-name]？」
- 「skills 的變更歷史」
- 「顯示所有可用技能」
- 「推薦適合 [任務] 的 skill」
- `/skills-list`
- `/skills-guide`
- `/skills-changelog`

---

## 工作流程

### 第 1 步：查詢 Skills 清單

系統會讀取 `.claude/skills/` 目錄，自動掃描所有已安裝的 skills：

```
.claude/skills/
├── ingest/              ← 自訂技能
├── lint/                ← 自訂技能
├── query/               ← 自訂技能
├── skill-creator/       ← 官方技能
├── pdf/                 ← 官方技能
├── obsidian-markdown/   ← 官方技能
├── obsidian-bases/      ← 官方技能
├── obsidian-cli/        ← 官方技能
├── json-canvas/         ← 官方技能
└── defuddle/            ← 官方技能
```

### 第 2 步：提取 Skill 信息

對每個 skill，提取以下信息：

```yaml
name: skill 名稱
type: custom | official (自訂 | 官方)
source: 來源（官方倉庫 URL 或本地創建）
description: 簡短描述
main_purpose: 主要用途
trigger_phrases: 觸發短語清單
capabilities: 核心能力 (列表)
input_types: 支援的輸入格式
output_types: 預期的輸出格式
dependencies: 外部依賴或前置技能
examples: 使用範例 (2-3 個)
last_updated: 最後更新日期
status: active | deprecated | beta
```

### 第 3 步：輸出統計與概覽

生成結構化報告，包含：

```markdown
## 📊 Skills 概覽

- **總數**：X 個 skills
  - 官方 skills：Y 個
  - 自訂 skills：Z 個
  - Beta 版本：N 個

## 🎯 按功能分類

### 知識管理 (3 個)
- [[ingest]] — 知識庫攝入
- [[lint]] — 健康檢查
- [[query]] — 知識查詢

### PDF 與文檔 (2 個)
- [[pdf]] — PDF 處理
- [[defuddle]] — 網頁提取

### Obsidian 整合 (4 個)
- [[obsidian-markdown]] — Markdown 編輯
- [[obsidian-bases]] — 資料庫
- [[obsidian-cli]] — CLI 操作
- [[json-canvas]] — Canvas 視覺化

### 開發工具 (1 個)
- [[skill-creator]] — 技能開發
```

### 第 4 步：詳細使用指南

根據使用者詢問，提供特定 skill 的：

- **簡介** — 3-5 句話的核心說明
- **觸發方式** — 如何激活此 skill
- **常見場景** — 3-5 個實際使用例子
- **最佳實踐** — 避免的陷阱、推薦方法
- **進階用法** — 與其他 skills 組合

### 第 5 步：變更歷史管理

維護 `skills-changelog.md`，記錄所有 skills 的變更：

```markdown
## [YYYY-MM-DD] 變更記錄

### ✨ 新增 Skills
- [[skill-name]] v1.0 — 功能描述

### 🔄 更新 Skills
- [[skill-name]] v1.2 → v1.3
  - 改進：説明
  - 修復：説明
  - 新增：説明

### ❌ 移除 Skills
- [[deprecated-skill]] — 原因：由 [[新技能]] 取代

### 📝 修改說明
- [[skill-name]] — 更新了文檔和範例
```

---

## 檔案結構

### 核心位置：`.claude/skills/skills-registry/`
```
.claude/skills/skills-registry/
├── SKILL.md                    ← AI 調用的官方定義（本檔案）
├── skills-guide.md             ← 完整使用指南
├── skills-changelog.md         ← 變更歷史日誌（Append-only）
└── references/
    └── skill-anatomy.md        ← Skill 結構和最佳實踐
```

### 使用者文檔位置：`skills-docs/`（Obsidian 中可見）
```
skills-docs/
├── README.md                   ← 快速導覽和總覽
├── guide.md                    ← 10 個 skills 的完整指南
├── changelog.md                ← Append-only 變更日誌
├── manifests/                  ← Skill 集合的詳細清單
│   ├── obsidian-skills.md      ← Obsidian 相關 skills
│   ├── pdf-processing.md       ← PDF 和文檔處理
│   ├── knowledge-system.md     ← 知識庫核心系統
│   └── development-tools.md    ← 開發工具和管理系統
└── references/
    └── skill-anatomy.md        ← Skill 結構參考
```

---

## 使用場景範例

### 場景 1：新手入門
```
使用者: 「我剛開始，有哪些 skills 可以用？」

Registry 輸出:
✅ 你有 10 個 skills 可用！
📚 推薦新手從這些開始：
  1. ingest — 將資料匯入知識庫
  2. query — 查詢你的知識庫
  3. pdf — 處理 PDF 文檔
```

### 場景 2：任務導向查詢
```
使用者: 「我想讀取並提取 PDF 表格」

Registry 推薦:
🎯 建議使用 [[pdf]] skill
  - 功能：提取 PDF 表格、文本
  - 觸發：「提取 PDF 表格」
  - 範例：[顯示代碼範例]
  
你也可以結合：
  + [[ingest]] 將結果匯入知識庫
  + [[query]] 稍後查詢結果
```

### 場景 3：監控變更
```
使用者: 「最近有哪些 skills 的更新？」

Registry 查詢 skills-changelog.md:
📋 最近 7 天的變更：
  ✨ [2026-04-16] 新增 [[pdf]] skill v1.0
  ✨ [2026-04-16] 新增 [[skill-creator]] v1.0
  🔄 [2026-04-15] 更新 [[ingest]] — 增加 Pass 5 卡片支援
```

### 場景 4：工作流推薦
```
使用者: 「我想完整處理一篇論文」

Registry 推薦工作流:
📖 完整論文處理工作流：
  1️⃣ [[pdf]] — 讀取 PDF，提取內容
  2️⃣ [[ingest]] — 編譯知識到 wiki/
  3️⃣ [[skill-creator]] — 建立「論文分析技能」
  4️⃣ [[query]] — 查詢和綜合知識
  5️⃣ [[lint]] — 驗證知識圖譜完整性
```

---

## 參數配置

| 參數 | 類型 | 說明 | 預設值 |
|------|------|------|--------|
| `scope` | string | 查詢範圍：`all` \| `custom` \| `official` \| `category` | `all` |
| `category` | string | 若 scope=category，指定分類 | - |
| `output_format` | string | 輸出格式：`brief` \| `detailed` \| `json` | `detailed` |
| `include_changelog` | boolean | 是否包含變更記錄 | `false` |
| `sort_by` | string | 排序方式：`name` \| `date` \| `popularity` | `name` |

### 使用範例

```
# 只顯示官方 skills，簡要格式
/skills-registry scope:official output_format:brief

# 顯示知識管理類別的 skills，包含變更記錄
/skills-registry category:knowledge-management include_changelog:true

# 顯示所有 skills 的結構化 JSON
/skills-registry output_format:json
```

---

## 故障排除

### Q: 如何新增本地自訂 skill？
**A:** 
1. 在 `.claude/skills/<skill-name>/` 建立新目錄
2. 建立 SKILL.md 定義
3. Registry 會自動掃描並納入
4. 手動更新 `skills-changelog.md` 記錄變更

### Q: 如何更新已有的 skill？
**A:**
1. 修改 `.claude/skills/<skill-name>/SKILL.md` 或其他檔案
2. 更新 `skills-changelog.md`：
   ```markdown
   ## [YYYY-MM-DD] 變更
   - [[skill-name]] — 更新說明
   ```

### Q: 如何刪除或棄用一個 skill？
**A:**
1. 在 SKILL.md 中設定 `status: deprecated`
2. 記錄到 `skills-changelog.md`：
   ```markdown
   ## [YYYY-MM-DD] 變更
   - [[skill-name]] — ❌ 棄用，由 [[replacement]] 取代
   ```
3. （可選）備份後刪除目錄

### Q: Registry 本身如何更新？
**A:** Registry 是 meta-skill，負責以下自動化任務：
- 每次 git commit 時自動掃描 skills 變更
- 更新 skills-database.json
- 提醒手動更新 skills-changelog.md

---

## 與其他 Skills 的協同

### Registry + Ingest
```
ingest 流程中遇到不確定的格式
→ 查詢 Registry 的 defuddle skill 說明
→ 決定使用哪個 skill 處理
```

### Registry + Lint
```
lint 報告異常
→ 查詢 Registry 瞭解相關 skills
→ 決定執行哪個修復工作流
```

### Registry + Skill-creator
```
想建立新的 skill
→ 查詢 Registry 瞭解已有 skills
→ 避免重複建立
→ 使用 skill-creator 開發新 skill
→ 自動加入 Registry
```

---

## 最佳實踐

✅ **DO**
- 定期更新 skills-changelog.md
- 保持 SKILL.md 的說明清晰簡潔
- 為每個 skill 提供 2-3 個實際使用範例
- 記錄 skill 的版本和來源

❌ **DON'T**
- 不要忘記記錄變更
- 不要讓文檔過度複雜
- 不要刪除 skills 而不更新 changelog
- 不要創建與現有 skill 功能重複的新 skill

---

## 下一步建議

1. **每週維護** — 定期檢查 skills 變更，更新 Registry
2. **評分系統** — 為每個 skill 評分（實用性、穩定性）
3. **使用統計** — 追蹤哪些 skills 使用最頻繁
4. **自動化維護** — 設定 Git hooks 自動掃描 skills 變更

---

*Skills Registry — 讓技能管理更透明、更有序。*

**最後更新**：2026-04-16  
**維護者**：Claudian  
**狀態**：✅ 活躍
