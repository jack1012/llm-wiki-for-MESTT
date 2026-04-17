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
[項目根目錄]/.claude/skills/
├── skill-creator/
└── skills-registry/
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
├── 知識庫核心系統
├── 文檔與 PDF 處理
├── Obsidian 編輯與整合
└── 開發工具與系統
```

---

## 📋 新增 Skill 時的檢查清單

建立新 skill 時，遵循以下步驟：
- [ ] 使用 [[skill-creator]] 引導開發流程
- [ ] 確認 SKILL.md 格式正確
- [ ] 在 manifests 中的適當檔案添加條目
- [ ] 更新 [[guide.md]] 中的相應分組
- [ ] 更新 [[changelog.md]] 記錄新增
- [ ] 提交 Git 變更

---

*Development Tools & System Skills Manifest — 管理和優化 skills 的完整工具。*

**最後更新**：2026-04-16  
**狀態**：✅ 完整  
**位置**：`skills-docs/manifests/development-tools.md`
