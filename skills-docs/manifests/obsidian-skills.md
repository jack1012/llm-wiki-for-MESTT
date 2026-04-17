# Obsidian Skills 安裝清單

**源倉庫**: https://github.com/kepano/obsidian-skills.git
**安裝時間**: 2026-04-16
**安裝狀態**: ✅ 完整安裝（所有版本一致）

---

## 📦 已安裝的 Skills

| Skill | 狀態 | 描述 | 版本 |
|-------|------|------|------|
| **obsidian-markdown** | ✅ 就緒 | Obsidian 風味 Markdown 編輯（支援 wikilinks, embeds, callouts） | 最新 |
| **obsidian-bases** | ✅ 就緒 | Obsidian Bases 編輯（`.base` 檔案，視圖、篩選、公式） | 最新 |
| **json-canvas** | ✅ 就緒 | JSON Canvas 編輯（`.canvas` 檔案，節點、邊、分組） | 最新 |
| **obsidian-cli** | ✅ 就緒 | Obsidian CLI 交互（vault 操作、plugin 開發） | 最新 |
| **defuddle** | ✅ 就緒 | 網頁內容清潔提取（移除雜亂、節省 token） | 最新 |

**總計**：5 個 skills，全部安裝並為最新版本 ✅

---

## 📍 安裝位置

```
F:\Dropbox\claude_code\.claude\skills\
├── obsidian-markdown/
│   ├── SKILL.md
│   └── references/
│       ├── CALLOUTS.md
│       ├── EMBEDS.md
│       └── PROPERTIES.md
├── obsidian-bases/
│   ├── SKILL.md
│   └── references/
│       └── FUNCTIONS_REFERENCE.md
├── json-canvas/
│   ├── SKILL.md
│   └── references/
│       └── EXAMPLES.md
├── obsidian-cli/
│   └── SKILL.md
└── defuddle/
    └── SKILL.md
```

---

## 🎯 各 Skill 用途

### 1. **obsidian-markdown**

**功能**：建立和編輯 Obsidian 風味的 Markdown 檔案

**支援的特性**：
- Wikilinks：`[[note-name]]`
- Embeds：`![[image.png]]`
- Callouts：`> [!NOTE]`
- Properties（YAML frontmatter）
- Tags：`#tag-name`
- Strikethrough：`~~text~~`
- Highlight：`==text==`

**使用場景**：
- 建立/編輯 wiki 概念頁面
- 添加 wikilinks 和嵌入
- 管理 YAML frontmatter

### 2. **obsidian-bases**

**功能**：建立和編輯 Obsidian Bases（資料庫檢視）

**支援的特性**：
- 多種視圖類型（表格、卡片、日曆、繪圖）
- 篩選和排序
- 公式和計算欄
- 匯總和聚合
- 關係和推薦

**使用場景**：
- 建立知識庫索引視圖
- 管理概念的分類視圖
- 建立專案追蹤面板

### 3. **json-canvas**

**功能**：建立和編輯 JSON Canvas 檔案（視覺化流程圖）

**支援的特性**：
- 節點（文本、檔案、連結）
- 邊和連接
- 分組和組織
- 位置和樣式
- 自定義數據

**使用場景**：
- 建立知識圖譜視覺化
- 繪製學習路徑圖
- 設計系統架構圖

### 4. **obsidian-cli**

**功能**：與 Obsidian vault 交互，支援 plugin 開發

**支援的操作**：
- Vault 操作（讀取、建立、搜尋筆記）
- Tasks 管理
- Properties 編輯
- Plugin 開發和調試
- DOM 檢查和錯誤捕獲

**使用場景**：
- 批量操作筆記
- Obsidian plugin 開發
- Vault 自動化維護

### 5. **defuddle**

**功能**：從網頁提取乾淨的 Markdown 內容

**功能**：
- 移除導航、廣告、雜亂內容
- 保留文章核心內容
- 轉換為 Markdown
- 節省 token 開銷

**使用場景**：
- 從網頁剪藏建立摘要
- 清潔網頁內容用於知識庫
- 減少無關信息的 token 消耗

---

## ✨ 與當前專案的集成

### 現有 Skills（自定義）

```
.claude/skills/
├── ingest/        — LLM Wiki 攝入流程
├── lint/          — 知識庫健康檢查
├── query/         — 知識庫查詢
└── [Obsidian Skills] — 外部安裝（5 個）
```

**總共 8 個 skills 可用**

### 推薦的使用組合

| 工作流 | 使用的 Skills |
|--------|--------------|
| 攝入新知識 | ingest + obsidian-markdown + defuddle |
| 編輯知識庫 | obsidian-markdown + obsidian-bases |
| 建立視圖 | json-canvas + obsidian-bases |
| 健康檢查 | lint + obsidian-cli |
| 知識查詢 | query + obsidian-cli |

---

## 🔧 如何使用這些 Skills

### 方法 1：通過 Claude Code 聊天

```
我想建立一個 Canvas 視圖來展示知識圖譜
```
→ 系統自動觸發 `json-canvas` skill

### 方法 2：明確調用

```python
# 使用 Skill 工具
skill: "obsidian-markdown"
args: "--create wiki/concepts/new-concept.md"
```

### 方法 3：自然語言觸發

- "建立一個 Canvas 檔案" → json-canvas
- "編輯 Markdown 檔案" → obsidian-markdown
- "從網頁提取內容" → defuddle
- "操作 Obsidian vault" → obsidian-cli
- "建立資料庫視圖" → obsidian-bases

---

## 📋 版本管理

### 檢查更新

```bash
# 檢查 GitHub 最新版本
git clone https://github.com/kepano/obsidian-skills.git /tmp/obsidian-skills-check

# 比較檔案
diff -r .claude/skills/ /tmp/obsidian-skills-check/skills/
```

### 更新 Skills

```bash
# 重新安裝最新版本
cd /tmp/obsidian-skills-temp
cp -r skills/* ~/.claude/skills/

# 提交變更
git add .claude/skills/
git commit -m "feat(skills): 更新 obsidian-skills 至最新版本"
```

---

## 🎓 使用範例

### 範例 1：建立 Canvas 流程圖

```
用 JSON Canvas 建立一個顯示知識庫結構的視覺化圖表
```

### 範例 2：從網頁摘錄

```
使用 defuddle 從 https://example.com 提取乾淨的 Markdown，去除雜亂內容
```

### 範例 3：編輯 Obsidian Markdown

```
在 wiki/concepts/new-concept.md 中建立一個新概念頁面，包含 wikilinks 和 frontmatter
```

### 範例 4：建立資料庫視圖

```
建立一個 Obsidian Base 來展示所有概念頁面的標籤和來源
```

---

## 📌 注意事項

1. **權限要求**
   - 某些 CLI 操作可能需要 Obsidian 權限
   - defuddle 需要網絡連接

2. **相容性**
   - 所有 skills 相容於 Claude Code
   - 可用於其他 Agent Skills 平台（Codex CLI, OpenCode）

3. **最佳實踐**
   - 在使用前檢查 skill 的完整文檔（在各 skill 目錄的 SKILL.md）
   - 參考 references/ 資料夾中的詳細指南

---

## 🔗 相關資源

- **官方倉庫**：https://github.com/kepano/obsidian-skills
- **Agent Skills 規範**：https://agentskills.io/specification
- **Obsidian 官方文檔**：https://help.obsidian.md
- **Claude 文檔**：https://platform.claude.com/docs

---

## ✅ 安裝驗證清單

- [x] 所有 5 個 skills 已安裝
- [x] 版本與 GitHub 一致
- [x] 檔案大小匹配
- [x] 所有 SKILL.md 檔案可訪問
- [x] References 文檔完整
- [x] 與 Claude Code 相容

**整體狀態**：✅ 就緒使用

---

*最後驗證：2026-04-16*
*安裝環境：F:\Dropbox\claude_code*
