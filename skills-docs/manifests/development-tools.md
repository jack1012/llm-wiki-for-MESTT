# Development Tools & System Skills Manifest

**來源**：本地建立 + Anthropic 官方  
**安裝時間**：2026-04-16  
**安裝狀態**：✅ 完整安裝（所有版本一致）

---

## 📦 已安裝的 Skills

用於技能開發、優化、管理的工具類 skills。

| Skill | 類型 | 狀態 | 描述 | 版本 |
|-------|------|------|------|------|
| **skill-creator** | 官方 | ✅ 就緒 | 技能開發與優化工具（6 步生命週期） | 1.0 |
| **skills-registry** | 自訂 | ✅ 就緒 | 本地 skills 管理系統（查詢、統計、追蹤變更） | 1.0 |

**總計**：2 個 skills，全部安裝並為最新版本 ✅

---

## 📍 安裝位置

```
F:\Dropbox\claude_code\.claude\skills\
├── skill-creator/
│   ├── SKILL.md                    (官方定義)
│   ├── agents/                     (代理實現)
│   │   ├── analyzer.md
│   │   ├── comparator.md
│   │   └── grader.md
│   ├── eval-viewer/                (評估工具)
│   │   ├── generate_review.py
│   │   └── viewer.html
│   ├── scripts/                    (自動化指令碼)
│   │   ├── run_eval.py
│   │   ├── run_loop.py
│   │   ├── improve_description.py
│   │   ├── package_skill.py
│   │   ├── quick_validate.py
│   │   ├── aggregate_benchmark.py
│   │   └── utils.py
│   └── references/
│       └── schemas.md
│
└── skills-registry/
    ├── SKILL.md                    (官方定義)
    ├── skills-guide.md
    ├── skills-changelog.md
    └── references/
        └── skill-anatomy.md
```

---

## 🎯 各 Skill 用途

### 1. **skill-creator** — 技能開發與優化工具

**功能**：引導式開發流程，幫助建立、測試、評估、優化 Claude Code skills

**核心能力**：
- 💡 **Capture Intent** — 理解技能目標和觸發條件
- 🔍 **Interview & Research** — 深度討論邊界情況和需求
- 📝 **Draft SKILL.md** — 生成標準化技能定義
- 🧪 **Test & Evaluate** — 運行測試用例和評估
- 📊 **Analyze Results** — 量化評估和反饋收集
- 🔄 **Improve** — 基於反饋優化技能
- 📢 **Optimize Description** — 改進觸發準確度

**觸發場景**：
- 「幫我建立一個自訂技能」
- 「優化這個 skill 的描述」
- 「為這個工作流建立技能」
- `/skill-creator`

**內含工具**：
- **agents/** — 3 個專用評估代理
  - Analyzer（分析技能表現）
  - Comparator（比較不同版本）
  - Grader（評分和反饋）
- **eval-viewer/** — 互動式評估查看器
- **scripts/** — 7 個自動化指令碼

**最佳實踐**：
- ✅ 從清晰的意圖開始
- ✅ 進行充分的邊界情況討論
- ✅ 編寫清晰、簡潔的 SKILL.md
- ✅ 運行多個測試用例
- ✅ 根據反饋迭代改進
- ❌ 不要過度優化單個測試用例
- ❌ 不要忽視邊界情況

**文檔**：
- 完整說明：[[skills-docs/guide.md#skill-creator]]
- 官方倉庫：https://github.com/anthropics/skills/tree/main/skills/skill-creator

---

### 2. **skills-registry** — 本地 Skills 管理系統

**功能**：統一的入口，用於管理、追蹤、查詢所有已安裝的 Claude Code skills

**核心能力**：
- 📦 **Skills 列表與介紹** — 展示所有 skills 及其功能
- 📚 **詳細使用指南** — 每個 skill 的完整說明和範例
- 📋 **變更歷史追蹤** — 記錄增加、修改、移除、版本更新
- 🔍 **快速查詢** — 根據功能推薦合適的 skill
- 🗂️ **Manifest 系統** — 按分類組織 skill 集合清單

**觸發場景**：
- 「我有哪些 skills？」
- 「怎麼使用 [skill-name]？」
- 「skills 的變更歷史」
- 「推薦適合 [任務] 的 skill 組合」
- `/skills-list`
- `/skills-guide`
- `/skills-changelog`

**文檔結構**：
```
skills-docs/
├── README.md              — 快速導覽
├── guide.md              — 10 個 skills 的完整指南
├── changelog.md          — 變更日誌
├── manifests/            — 按分類的 skill 清單
│   ├── obsidian-skills.md
│   ├── pdf-processing.md (計畫中)
│   ├── knowledge-system.md (計畫中)
│   └── development-tools.md (本檔案)
└── references/
    └── skill-anatomy.md
```

**Manifest 說明**：
- 每個 manifest 包含特定 skill 集合的詳細清單
- Manifest 內容：列表表格、安裝位置、功能說明、協同方式

**最佳實踐**：
- ✅ 定期更新 changelog
- ✅ 查看 manifests 瞭解 skill 集合
- ✅ 使用 guide.md 學習每個 skill
- ✅ 根據工作流推薦找合適的 skill 組合
- ❌ 不要忽略 changelog
- ❌ 不要建立功能重複的 skills

**文檔**：
- 完整說明：[[skills-docs/guide.md#skills-registry]]
- Manifest 文檔：[[skills-docs/manifests/development-tools.md]]
- README：[[skills-docs/README.md]]

---

## ✨ 與當前專案的集成

### 現有 Skills 概況

```
總計：11 個 Skills
├── 知識庫核心系統（3 個）
│   ├── ingest
│   ├── lint
│   └── query
├── 文檔與 PDF 處理（2 個）
│   ├── pdf
│   └── defuddle
├── Obsidian 編輯與整合（4 個）
│   ├── obsidian-markdown
│   ├── obsidian-bases
│   ├── obsidian-cli
│   └── json-canvas
└── 開發工具與系統（2 個） ← 本 manifest
    ├── skill-creator
    └── skills-registry
```

### 推薦的使用組合

| 工作場景 | 推薦 Skills |
|---------|-----------|
| 建立新技能 | skill-creator → skills-registry |
| 查詢技能資訊 | skills-registry + guide.md + manifests |
| 優化現有 skill | skill-creator |
| 追蹤 skills 變化 | skills-registry + changelog |

---

## 🔄 工作流推薦

### 工作流 1：建立新 Skill

```
1️⃣ 查詢現有 skills
   [[skills-registry]] + [[manifests/]]
   
2️⃣ 設計新 skill
   確認不重複，明確需求
   
3️⃣ 開發 skill
   [[skill-creator]] — 6 步生命週期
   
4️⃣ 測試和優化
   在 skill-creator 中運行評估
   
5️⃣ 記錄到系統
   更新 guide.md 和 changelog
   
6️⃣ 管理 skill
   使用 [[skills-registry]] 追蹤
```

### 工作流 2：改進現有 Skill

```
1️⃣ 識別需要改進的 skill
   查詢 [[manifests/]] 或 [[guide.md]]
   
2️⃣ 開發改進版本
   使用 [[skill-creator]]
   
3️⃣ 測試和評估
   運行評估用例
   
4️⃣ 部署新版本
   更新 skill 檔案
   
5️⃣ 記錄變更
   更新 [[changelog.md]]
```

### 工作流 3：學習 Skills 系統

```
1️⃣ 快速導覽
   閱讀 [[skills-docs/README.md]]
   
2️⃣ 查看分類清單
   瀏覽 [[manifests/]]
   
3️⃣ 深入學習特定 skill
   查看 [[skills-docs/guide.md]]
   
4️⃣ 追蹤最新變化
   檢查 [[changelog.md]]
   
5️⃣ 理解 skill 結構
   閱讀 [[references/skill-anatomy.md]]
```

---

## 📊 統計資訊

### Skills 狀態

| 狀態 | 數量 | Skills |
|------|------|--------|
| ✅ 穩定 | 2 | skill-creator, skills-registry |
| 🟡 Beta | 0 | - |
| ❌ 已棄用 | 0 | - |

### 功能覆蓋

| 功能 | skill-creator | skills-registry |
|------|:-------------:|:---------------:|
| 技能開發 | ✅ | ❌ |
| 技能測試 | ✅ | ❌ |
| 技能管理 | ❌ | ✅ |
| 技能查詢 | ❌ | ✅ |
| 變更追蹤 | ❌ | ✅ |
| 工作流推薦 | ❌ | ✅ |

---

## 🔗 相關資源

- **Official Anthropic Skills**：https://github.com/anthropics/skills
- **skill-creator Repository**：https://github.com/anthropics/skills/tree/main/skills/skill-creator
- **Agent Skills Specification**：https://agentskills.io/specification
- **Claude Documentation**：https://platform.claude.com/docs

---

## 📋 新增 Skill 時的檢查清單

建立新 skill 時，遵循以下步驟：

- [ ] 使用 [[skill-creator]] 引導開發流程
- [ ] 確認 SKILL.md 格式正確
- [ ] 編寫 3+ 個使用範例
- [ ] 運行至少 2 個測試用例
- [ ] 在 manifests 中的適當檔案添加條目
- [ ] 更新 [[guide.md]] 中的相應分組
- [ ] 更新 [[changelog.md]] 記錄新增
- [ ] 更新 [[README.md]] 中的統計資訊
- [ ] 提交 Git 變更，包含清晰的提交訊息

---

*Development Tools & System Skills Manifest — 管理和優化 skills 的完整工具。*

**最後更新**：2026-04-16  
**狀態**：✅ 完整  
**位置**：`skills-docs/manifests/development-tools.md`
