# Git 工作流指南

## 分支策略

```
master ────────────────────────────────────┐
  │                                        │
  └─── develop ─────────────────────────┐  │
         │                              │  │
         └─── major-refactor ──────────┘  │
              (大修工作分支)              │
                                          │
                                  (定期合併)
```

### 分支說明

| 分支名 | 用途 | 狀態 | 合併規則 |
|--------|------|------|---------|
| **master** | 生產穩定版本 | 🟢 穩定 | 只能從 develop 合併，必須經過測試 |
| **develop** | 主開發分支 | 🟡 活躍 | 整合各項功能，定期合併到 master |
| **major-refactor** | 大修工作 | 🟠 進行中 | 完成後合併回 develop，再經 develop 合併到 master |

---

## 當前版本狀態

**初始提交（Baseline）**：`dee3446`
```
commit dee3446
author: jack <jack1012@gmail.com>
date: 2026-04-16

初始提交：LLM Wiki 項目基線版本
- 88 個檔案
- 知識庫規模：60+ 頁面
```

---

## 大修工作流程

### 步驟 1：在 major-refactor 分支上工作

```bash
# 確認當前在 major-refactor 分支
git branch
# * major-refactor
# develop
# master

# 進行修改...
git add <modified-files>
git commit -m "修改描述"
```

### 步驟 2：定期檢查變更

```bash
# 查看當前分支的變更（相對於 develop）
git diff develop..major-refactor --stat

# 查看詳細變更
git log develop..major-refactor --oneline
```

### 步驟 3：完成大修後合併回 develop

```bash
# 切換到 develop
git checkout develop

# 將 major-refactor 合併到 develop
git merge --no-ff major-refactor -m "完成大修：[功能描述]"

# 查看合併結果
git log --graph --oneline --all
```

### 步驟 4：測試後合併到 master

```bash
# 切換到 master
git checkout master

# 將 develop 合併到 master
git merge --no-ff develop -m "發佈版本：[版本號]"

# 建立版本標籤
git tag -a v1.0 -m "版本 1.0 - 大修完成"
```

---

## 常用命令

### 查看狀態

```bash
# 查看當前分支
git branch -vv

# 查看提交日誌
git log --oneline --graph --all

# 查看未提交的變更
git status
git diff
```

### 修改管理

```bash
# 查看特定分支的所有變更
git diff master..major-refactor

# 查看特定檔案的變更歷史
git log -p wiki/index.md

# 回滾特定提交
git revert <commit-hash>
```

### 分支管理

```bash
# 建立新分支
git branch <branch-name>

# 刪除分支（完成後）
git branch -d <branch-name>

# 強制刪除未合併的分支
git branch -D <branch-name>

# 切換分支
git checkout <branch-name>

# 建立並切換到新分支
git checkout -b <branch-name>
```

---

## 提交訊息規範

### 格式

```
<類型>(<範圍>): <簡述>

<詳細描述>

<頁腳>
```

### 類型

- **feat**: 新功能（新增頁面、新增 skill）
- **fix**: 修復（修復死連結、修復同步問題）
- **refactor**: 重構（重組頁面、優化結構）
- **docs**: 文檔（更新 README、log.md）
- **style**: 格式（修正排版、統一命名）
- **test**: 測試（lint 檢查、驗證）

### 範圍

- `wiki`: 知識庫相關
- `ingest`: 攝入流程
- `cards`: 卡片系統
- `index`: 索引系統
- `concepts`: 概念頁面

### 範例

```
feat(cards): 補充 6 個摘要頁面的 Pass 5 卡片提煉

- 為 affective-variables-in-transition 提煉 4 張卡片
- 為 the-mathematical-crisis-in-transition 提煉 5 張卡片
- 為 what-role-do-student-beliefs-play 提煉 4 張卡片
- 更新 wiki/cards/index.md
- 驗證所有卡片符合 150-200 字標準

Closes: #1
```

---

## 回滾安全協議

### 如果需要回滾變更

```bash
# 回滾未 push 的提交（保留修改）
git reset --soft HEAD~1

# 回滾未 push 的提交（丟棄修改）
git reset --hard HEAD~1

# 已 push 的提交需要 revert
git revert <commit-hash>
git push origin major-refactor
```

### 安全檢查清單

- [ ] 確認當前分支（`git branch`）
- [ ] 確認變更內容（`git diff`）
- [ ] 確認提交訊息清晰
- [ ] 大修完成前，先合併一次 develop 的最新版本（解決衝突）

```bash
git fetch origin
git merge develop
# 解決衝突（如有）
git commit -m "merge: 合併 develop 最新版本"
```

---

## 當前大修計畫

### 待執行任務

- [ ] **補充 Pass 5 卡片提煉** — 6 個摘要頁面 × 3-5 張卡片
- [ ] **建立缺失的高優先度概念** — [[Agentic_Systems]] 等
- [ ] **驗證 index.md 完整性** — 確保所有新增頁面同步
- [ ] **運行最終 lint 檢查** — 確認健康度 ≥ 9.0/10
- [ ] **更新文檔和日誌** — wiki/log.md 記錄所有大修操作

### 預期里程碑

```
major-refactor (in progress)
├─ Pass 5 補充 (完成日期: TBD)
├─ 高優先度概念建立 (完成日期: TBD)
├─ 最終驗證 (完成日期: TBD)
└─ 合併到 develop (里程碑: v1.0-alpha)
   └─ 合併到 master (里程碑: v1.0-release)
```

---

## 多 AI 助手協作規範 (Claude Code & Antigravity)

為了在 Claude Code 與 Antigravity 之間保持同步並避免衝突，請遵循：

### 助手角色與分工

| 工具 | 優勢 | 建議用途 |
|------|------|---------|
| **Claude Code** | 專案深度分析、複雜邏輯推理 | 大規模重構、程式碼邏輯修改、跨檔案分析 |
| **Antigravity** | 視覺化建議、美感優化、快速任務 | Wiki 內容填充、文件美化、UI/UX 建議 |

### 協作原則

1. **頻繁提交 (Commit Often)**：
   不論使用哪一個助手，完成一個原子任務後即進行 `git commit`。這能讓另一個助手在切換時獲得最新、最乾淨的 Context。
2. **資訊對齊**：
   雙方助理都應讀取並遵守 `CLAUDE.md` 中的規則。
3. **避免併發操作**：
   **絕對不要**同時在兩個不同的 AI 終端中對同一個檔案進行寫入。這會導致 Dropbox 產生衝突檔案或 Git 索引錯誤。
4. **切換工作前 Sync**：
   若從一個助手切換到另一個，建議先執行 `git status` 確認當前狀態。若有未提交的內容，請先提交或 stash。

### 典型工作流範例

1. **Claude Code** 執行大型論文攝入 (`/ingest`) 並生成摘要。
2. **git commit** 記錄變更。
3. **Antigravity** 接手，針對生成的摘要進行排版優化、建立關聯連結。
4. **git commit** 再次記錄。

---

## 版本標籤

建議的版本號規範（Semantic Versioning）：

- `v0.1` — 初始版本（已完成）
- `v1.0-alpha` — 大修完成、待最終測試
- `v1.0-beta` — 社群測試版本
- `v1.0` — 正式發佈版本
- `v1.1` — 第一次功能增強
- `v2.0` — 重大功能升級

---

## 故障排除

### Q：如何查看我在 major-refactor 上進行了哪些更改？
```bash
git log master..major-refactor --oneline
git diff master..major-refactor --stat
```

### Q：如何合併 develop 的最新更新到 major-refactor？
```bash
git checkout major-refactor
git fetch origin
git merge develop
# 解決衝突（如有）
git add .
git commit -m "merge: 整合 develop 最新版本"
```

### Q：我不小心在 master 上提交了，怎麼辦？
```bash
# 1. 回滾 master 上的提交
git checkout master
git reset --soft HEAD~1

# 2. 切換到 major-refactor
git checkout major-refactor

# 3. 應用該提交
git commit -m "你的提交訊息"

# 4. 恢復 master 到上一個穩定版本
git checkout master
git reset --hard <安全的提交 hash>
```

---

## 下一步建議

1. **確認大修範圍** — 哪些頁面需要修改？優先順序如何？
2. **制定里程碑** — Pass 5 補充預計什麼時候完成？
3. **定期檢查進度** — 每完成一個關鍵任務，進行一次 commit 和記錄
4. **測試合併** — 大修完成前，先嘗試合併回 develop，檢查衝突

---

*最後更新：2026-04-16*
*主要維護者：jack*
