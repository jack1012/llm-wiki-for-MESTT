# Skills 變更日誌

官方記錄所有 skills 的增加、修改、移除、版本更新。**Append-only 日誌** — 只能追加，不能編輯歷史記錄。

---

## 版本概述

| v1.2 | 2026-04-16 | 規範對齊：Concepts 統一使用 Title Case，Entities 包含研究學者 |
| v1.1 | 2026-04-16 | 新增 2 個知識庫系統 skills（alloc、fix），建立 knowledge-system.md manifest |
| v1.0 | 2026-04-16 | 首次建立 skills registry，安裝 10 個 skills |
| v0.1 | 2026-04-15 | 初始專案設定 |

---

## [2026-04-16] v1.2 — 命名規範對齊與 Ingest 深度化

### 🔄 更新 Skills

#### 1. **ingest** v1.2
- **變更**：
  - 導入 **5-Pass 深度分析框架**。
  - **命名規範對齊**：Concepts 統一使用 **Title Case (含空白)**，與 Entities 保持一致。
  - **實體定義擴充**：Entities 現在明確包含 **研究學者/作者 (Researcher/Author)**。
  - 規範 raw 檔案命名：持續使用底線代替空白以利終端機處理。
- **影響**：Wiki 內部連結更加人性化（與顯示文本一致），且能更好地追蹤學術脈絡中的關鍵人物。

### 🏗️ 系統規範變更

- **命名規範統一**：
  - **Entities & Concepts**：統一使用 `Title Case` (例如 `Mathematical Beliefs`)。
  - **Raw Files**：維持使用底線 (`_`)。
- **文檔同步**：
  - 已將所有 Concept 頁面中的底線連結轉換為空白連結。
  - 更新了 `CLAUDE.md` 的全域規範。

### 📚 更新文檔

#### 1. **guide.md**
- 新增 **[!IMPORTANT]** 讀者參考警告。
- 更新 ingest 描述。

---

## [2026-04-16] v1.1 — 知識庫系統完善

### ✨ 新增 Skills

#### 1. **alloc** v1.0
- **類型**：🔵 自訂技能（新建立）
- **功能**：文件分派與預處理
- **核心能力**：
  - 修復檔案名稱（移除特殊字符、標準化空白）
  - 掃描與識別（判定語言和內容類型）
  - 自動分派（根據類型移動到 raw/ 對應子目錄）
  - 生成分派報告
- **工作流**：inbox/ → fix-name → scan → move → raw/
- **觸發方式**：`/alloc`, `/alloc <path>`
- **狀態**：✅ 活躍，完全可用
- **檔案位置**：`.claude/skills/alloc/SKILL.md`

#### 2. **fix** v1.0
- **類型**：🔵 自訂技能（新建立）
- **功能**：知識庫自動修復
- **核心能力**：
  - 死連結修復
  - 孤兒頁面重連
  - 索引同步
  - 知識衝突決策輔助
  - 自動更新 index.md 和 log.md
- **銜接**：lint 報告 → fix 修復 → lint 驗證
- **觸發方式**：`/fix-wiki`, `/fix-wiki <type>`, `/fix-wiki --auto_confirm`
- **狀態**：✅ 活躍，完全可用
- **檔案位置**：`.claude/skills/fix-wiki/SKILL.md`

### 📚 新增文檔

#### 1. **manifests/knowledge-system.md** (新建立)
- **內容**：知識庫核心系統 5 個 skills 的詳細清單
- **包含**：alloc, ingest, lint, fix, query
- **結構**：skills 狀態表、安裝位置、各 skill 用途、工作流推薦
- **檔案位置**：`skills-docs/manifests/knowledge-system.md`

### 🔄 更新文檔

#### 1. **README.md**
- 更新統計：11 個 skills → 13 個 skills
- 更新自訂 skills：4 個 → 6 個
- 更新 manifests 列表：knowledge-system.md 標記為已建立
- 更新按功能分類：知識管理 3 個 → 5 個
- 更新常見工作流：添加 alloc 和 fix

#### 2. **guide.md**
- 更新統計：11 個 skills → 13 個 skills
- 更新自訂 skills：4 個 → 6 個
- 新增 alloc 的詳細說明（第 1 節）
- 更新 ingest 編號：1 → 2
- 更新 lint 編號：2 → 3
- 新增 fix 的詳細說明（第 4 節）
- 更新 query 編號：3 → 5
- 更新知識庫核心系統說明：3 個 → 5 個

### 📝 備註

完整知識庫系統工作流現已成熟：
```
alloc → ingest → lint → fix → query
```

該工作流涵蓋了檔案準備、知識編譯、品質檢查、自動修復、知識查詢的完整流程。

---

## [2026-04-16] v1.0 — Skills Registry 系統建立

### ✨ 新增 Skills

#### 1. **skills-registry** v1.0
- **類型**：🔵 自訂技能（新建立）
- **功能**：本地 skills 管理系統
- **核心能力**：
  - 展示所有已安裝 skills 的列表和介紹
  - 提供詳細的 skills 使用指南
  - 追蹤 skills 的變更歷史
  - 推薦合適的 skill 組合和工作流
- **檔案**：
  - `SKILL.md` — 官方定義
  - `skills-guide.md` — 完整使用指南（10 個 skills，每個 500+ 詞）
  - `skills-changelog.md` — 變更日誌（本檔案）
  - `references/` — 參考文檔
  - `examples/` — 使用範例
- **狀態**：✅ 活躍，完全可用
- **備註**：meta-skill，用來管理其他 skills

---

## [2026-04-16] 官方 PDF 處理 Skill 安裝

### ✨ 新增 Skills

#### 2. **pdf** v1.0
- **來源**：Anthropic 官方倉庫
- **URL**：https://github.com/anthropics/skills/tree/main/skills/pdf
- **功能**：PDF 處理與表單填寫
- **核心能力**：
  - 讀取和提取（文本、表格、圖像、元數據）
  - 合併與拆分 PDF
  - 頁面操作（旋轉、水印、調整大小）
  - 表單識別和自動填寫
  - PDF 加密/解密
  - OCR 文字辨識
- **內含指令碼**：8 個 Python 工具
- **文檔**：
  - `SKILL.md` — 314 行快速入門
  - `reference.md` — 611 行完整參考
  - `forms.md` — 294 行表單專題
- **狀態**：✅ 活躍，完全可用
- **Git 提交**：88d898f

---

## [2026-04-16] 官方 Skill-Creator 安裝

### ✨ 新增 Skills

#### 3. **skill-creator** v1.0
- **來源**：Anthropic 官方倉庫
- **URL**：https://github.com/anthropics/skills/tree/main/skills/skill-creator
- **功能**：技能開發與優化工具
- **核心能力**：
  - 6 步技能開發生命週期
  - 自動化評估和測試
  - 迭代改進支援
  - 觸發描述優化
- **內含工具**：
  - agents/ — 評估代理（Analyzer, Comparator, Grader）
  - eval-viewer/ — 評估查看器和可視化
  - scripts/ — 自動化指令碼
  - references/ — 參考文檔
- **狀態**：✅ 活躍，完全可用
- **Git 提交**：220b4ce
- **備註**：替代本地框架（SKILL_CREATOR_GUIDE.md）

---

## [2026-04-16] Obsidian Skills 驗證與確認

### 🔄 確認狀態（無變更，只是驗證）

已驗證以下官方 skills 已安裝且版本一致：

#### 4-8. **Obsidian Skills** (5 個)

1. **obsidian-markdown** v最新
   - Wikilinks、Embeds、Callouts 編輯
   - YAML Frontmatter 管理
   - 狀態：✅ 活躍

2. **obsidian-bases** v最新
   - 資料庫視圖（表格、卡片、日曆、繪圖）
   - 篩選、排序、公式計算
   - 狀態：✅ 活躍

3. **obsidian-cli** v最新
   - Vault 操作和搜尋
   - Plugin 開發支援
   - 狀態：✅ 活躍

4. **json-canvas** v最新
   - Canvas 檔案編輯
   - 視覺化流程圖、心智圖
   - 狀態：✅ 活躍

5. **defuddle** v最新
   - 網頁內容提取
   - HTML → Markdown 轉換
   - 狀態：✅ 活躍

**安裝來源**：https://github.com/kepano/obsidian-skills.git  
**安裝日期**：2026-04-16  
**Git 提交**：詳見 OBSIDIAN_SKILLS_MANIFEST.md

---

## [2026-04-15] 初始自訂 Skills 建立與驗證

### ✨ 已存在的自訂 Skills

#### 9-11. **知識管理 Skills** (3 個)

1. **ingest** v1.0
   - 知識庫攝入系統（6 步完整流程）
   - 支援 Markdown、PDF、轉錄文本
   - 自動生成 sources/entities/concepts 頁面
   - 狀態：✅ 活躍，已驗證

2. **lint** v1.0
   - 知識庫健康檢查系統
   - 偵測死連結、孤兒頁面、未同步索引、知識衝突
   - 狀態：✅ 活躍，已驗證

3. **query** v1.0
   - 本地知識庫查詢系統
   - 基於本地 wiki，禁止依賴模型記憶
   - 狀態：✅ 活躍，已驗證

**建立日期**：初期設定  
**備註**：這三個 skills 是專案的基礎，已通過使用驗證

---

## 統計總結

### 當前 Skills 清點

```
總計：11 個 Skills
├── 自訂 Skills：4 個
│   ├── ingest (知識攝入)
│   ├── lint (健康檢查)
│   ├── query (知識查詢)
│   └── skills-registry (管理系統) [新增]
│
└── 官方 Skills：7 個
    ├── pdf (PDF 處理) [新增]
    ├── skill-creator (技能開發) [新增]
    ├── obsidian-markdown (Markdown 編輯)
    ├── obsidian-bases (資料庫)
    ├── obsidian-cli (CLI 操作)
    ├── json-canvas (視覺化)
    └── defuddle (網頁提取)
```

### 功能分類統計

| 分類 | 數量 | Skills |
|------|------|--------|
| 知識管理 | 3 | ingest, lint, query |
| 文檔與 PDF | 2 | pdf, defuddle |
| Obsidian 整合 | 4 | obsidian-markdown, obsidian-bases, obsidian-cli, json-canvas |
| 開發工具 | 2 | skill-creator, skills-registry |

### 穩定性與成熟度

| 等級 | 數量 | Skills |
|------|------|--------|
| ✅ 穩定（已驗證）| 11 | 所有 skills |
| 🟡 Beta（新版本）| 3 | pdf, skill-creator, skills-registry |
| ❌ 已棄用 | 0 | - |

---

## Git 提交記錄

所有 skills 變更都已提交到 Git：

```bash
# PDF skill 安裝
88d898f feat(skills): 安装官方 PDF 处理技能

# Skill-creator 安裝
220b4ce feat(skills): 安装官方 skill-creator 并移除本地框架

# Skills Registry 建立
[待提交] feat(skills): 建立 skills-registry 本地管理系統
```

---

## 規劃中的改進

### 短期 (1-2 週)
- [ ] 補充 Pass 5 卡片提煉（6 個論文摘要）
- [ ] 優化 ingest skill 的 5-Pass 框架文檔
- [ ] 建立「論文分析技能」（使用 skill-creator）

### 中期 (1-2 個月)
- [ ] 建立「知識卡片生成技能」
- [ ] 建立「概念提煉技能」
- [ ] 改進 lint 的修復建議

### 長期 (3+ 個月)
- [ ] 建立 10+ 個專業領域技能
- [ ] 建立 skills 的評分系統
- [ ] 建立 skills 的使用統計
- [ ] 自動化 skills 的版本更新

---

## 維護指南

### 新增 Skill 時的檢查清單

當新增或安裝 skill 時，遵循以下步驟：

- [ ] 檢查 skill 是否已存在（避免重複）
- [ ] 確認 skill 的源（官方或自訂）
- [ ] 驗證 SKILL.md 格式是否正確
- [ ] 建立基本的使用文檔（至少 3 個範例）
- [ ] 更新本 changelog
- [ ] 更新 skills-guide.md 中的相應部分
- [ ] 提交 Git 變更
- [ ] 更新 wiki/log.md（如果涉及知識庫）

### 修改 Skill 時的檢查清單

當修改現有 skill 時：

- [ ] 更新 SKILL.md 中的版本號
- [ ] 記錄變更內容到本 changelog
- [ ] 更新 skills-guide.md 中的相應部分（若有改動）
- [ ] 驗證觸發條件是否改變
- [ ] 提交 Git 變更，包含清晰的提交訊息

### 移除 Skill 時的檢查清單

當移除或棄用 skill 時：

- [ ] 在 SKILL.md 中設定 `status: deprecated`
- [ ] 記錄到本 changelog，說明原因和替代方案
- [ ] 通知使用者，提供遷移指南
- [ ] 保留備份（至少 1 個月）
- [ ] 提交 Git 變更

---

## 相關文檔連結

- **SKILL.md** — Skills Registry 官方定義
- **skills-guide.md** — 10 個 skills 的完整使用指南
- **wiki/log.md** — 知識庫操作日誌
- **GIT_WORKFLOW.md** — Git 工作流指南
- **OBSIDIAN_SKILLS_MANIFEST.md** — Obsidian Skills 詳細清單

---

## 免責聲明

本 changelog 記錄的是 **官方變更**。實際使用過程中發現的 bug 或問題，請另行記錄於：
- Wiki 知識衝突區塊（如涉及知識內容）
- GitHub Issues（如涉及代碼問題）
- 個人備忘錄（如涉及個人工作流）

---

*Skills 變更日誌 — 完整追蹤所有技能的生命週期。*

**最後更新**：2026-04-16  
**維護者**：Claudian  
**政策**：Append-only（只能追加）
