---
name: ingest
description: 將 raw/ 目錄下的原始資料編譯到 wiki/ 中。處理完成後，將原始檔自動移動到 raw/09-archive/ 歸檔。支援 `/ingest` (掃描 raw/ 下所有未歸檔檔案) 或 `/ingest <path>` (處理指定檔案)。當使用者提到"攝取"、"匯入"、"收入"資料，或要求將檔案加入知識庫時，也應該觸發此技能。絕對忽略 raw/09-archive/ 目錄。
user-invocable: true
---

# ingest 技能

## 核心工作流：Inbox & Archive

你正在維護一個 **LLM Wiki**（Obsidian 知識庫）。`raw/` 目錄是"待處理收件箱"，`wiki/` 是"編譯輸出層"。

**目錄結構約定：**
- `raw/01-articles/` — 網頁剪藏的 Markdown 文章
- `raw/02-papers/` — 論文和 PDF 文獻
- `raw/03-transcripts/` — 影片轉錄文案
- `raw/09-archive/` — **已處理檔案的歸檔目錄，禁止讀取**
- `wiki/sources/` — 資料摘要（學術層）
- `wiki/entities/` — 實體（學術層）
- `wiki/concepts/` — 概念（學術層）
- `skills-docs/` — **系統層開發手冊，禁止寫入**

## 觸發邏輯

1. **使用者執行 `/ingest`**：掃描 `raw/` 所有子目錄（排除 `09-archive/`），找出待處理檔案。
2. **使用者執行 `/ingest <path>`**：僅處理指定檔案。
3. **隱式觸發**：使用者說"把這個資料攝入知識庫"、"匯入這篇文章"時，自動執行 ingest。

## 編譯流水線

對每個待處理原始檔，嚴格按以下步驟執行：

### 步驟 1：讀取原始檔

- **如果是 `.md` 檔案**：使用讀取工具完整讀取內容。
- **如果是 `.pdf` 檔案**：使用讀取工具嘗試提取文字。如果無法提取或內容為空，改為記錄檔案元資訊（檔名、頁數）在 sources 頁面中。

### 步驟 2：提煉核心（按檔案語言處理）

從原始檔中提取：
- **核心主旨**：這段資料講什麼（1-2句話）
- **實體**：人物、研究學者/作者（Researcher/Author）、公司、工具、產品等具體名詞
- **概念**：關鍵字（Keywords）、重要概念（Important Concepts）、框架、方法論、理論等抽象名詞

**語言一致性處理**：
- 📄 **英文文獻** → 用英文提煉、分析、編寫 wiki 頁面（保持原文語言）
- 📄 **中文文獻** → 用中文提煉、分析、編寫 wiki 頁面
- ⚠️ **禁止跨語言分析**：不要用英文分析中文文獻，也不要用中文分析英文文獻

### 步驟 3：建立來源摘要

在 `wiki/sources/` 建立 Markdown 檔案，使用 5-Pass 深度分析結構。
**根據原始檔語言選擇對應模板**：英文文獻用英文模板，中文文獻用中文模板。

檔名使用 kebab-case：`summary-{檔案slug}.md`
- 範例：`summary-数学信念转变.md`
- 範例：`summary-prompt-engineering-guide.md`

---

#### 🇺🇸 English Template（英文文獻適用）

### **Pass 1: Literature Profile**

Extract metadata and core attributes for quick reference.

```markdown
## 📝 Pass 1: Literature Profile

- **Title (Original)**: [original title]
- **Journal / Publisher**: [journal name or publisher]
- **Author(s)**: [author list]
- **Year**: [YYYY]
- **Keywords**: [[Concept1]], [[Concept2]], [[Concept3]] (use wikilinks)
- **File Link**: [[relative-path/filename|display text]]
- **Research Topic**: [1-2 sentence summary]
- **Problem Statement**: [research background and motivation, 2-3 sentences]
- **Research Question(s)**: [core RQs, typically "How does X affect Y?"]
- **Methodology**: [qualitative / quantitative / mixed; sample size, etc.]
- **Key Findings**: [core results summary]
- **Discussion**: [theoretical implications discussed]
- **Future Directions**: [future research suggestions or practical recommendations]
```

---

### **Pass 2: In-Depth Analysis**

Structured 5W1H analysis answering "what is this paper really saying?"

```markdown
## 🔍 Pass 2: In-Depth Analysis

1. **What is the problem context?**
   [Why does this research matter? What is the background?]

2. **What question(s) does it address?**
   [Core research questions or hypotheses]

3. **What methodology does it employ?**
   [Research design, sample, data collection, analysis methods]

4. **What conclusions does it reach?**
   [Major findings, statistical results, qualitative insights]

5. **What recommendations does it make?**
   [Suggestions for education, theory, or future research]
```

---

### **Pass 3: Critical Review**

Comprehensive review including citation, contribution assessment, limitations, and key quotes.

```markdown
## ✒️ Pass 3: Critical Review

**【APA 7th Citation】**:
[full APA citation]

1. **What is this paper about?**
   [1-paragraph core narrative]

2. **What does it contribute? What do we learn from it?**
   [Originality and practical significance]

3. **What are its limitations or weaknesses?**
   [Sample constraints, methodological gaps, generalizability issues]

4. **Key findings and core insight (quotable takeaway)**:
   "[direct quote or paraphrased key argument]"
```

---

### **Pass 4: Theoretical Model & Key Variables**

Visualize the theoretical framework and extract variable mappings.

```markdown
## 📊 Pass 4: Theoretical Model & Key Variables

### 1. Theoretical Anchors
- **Core Framework**: [primary theory or model the paper builds on]
- **Supporting Theories**: [supplementary theories]
- **Dialogue Literature**: [key benchmark studies]

### 2. Variable Mapping
- **Independent Variable(s)**: [predictor / cause]
- **Mediating Variable(s)** (if any): [mechanism between cause and effect]
- **Control Variable(s)**: [controlled background factors]
- **Dependent Variable(s)**: [outcome / effect]

### 3. Model Visualization (Mermaid)
\`\`\`mermaid
graph LR
    A[Variable 1] -->|relationship| B[Variable 2]
    C[Variable 3] -->|influences| B
\`\`\`
```

---

### **Pass 5: Atomic Card Synthesis**

Following the "one insight, one card" principle, distill the most valuable findings into independent cards.

**Card file spec (`wiki/cards/[slug].card.md`):**
```markdown
---
title: "Card Title"
type: card
tags: [tags]
sources: [summary-source-slug]
last_updated: YYYY-MM-DD
---

## [Concept Name]

**Source**: Author (Year), Journal, p. page (or link).

**Core Concept**:
What problem does it solve? What method is used? What conclusion is reached? (200-300 words, concise, in your own words).

**Thoughts / Links**:
- Inspiration: What does this insight trigger?
- Knowledge gap: Limitations or relevance to my own research.
- Commentary: Do I agree or disagree with this view?
- Connections: [[Related Literature 1]], [[Related Concept 2]]
```

**How to present in the summary page:**
```markdown
## 💡 Pass 5: Atomic Card Synthesis

- [[card-filename.card|Card Title]]: [core insight summary]
```

---

#### 🇹🇼 中文模板（中文文獻適用）

### **Pass 1：文獻基本資料整理**

提取論文的元資訊和核心屬性。此 Pass 的目的是建立快速參考。

```markdown
## 📝 第一步：文獻基本資料整理 (Pass 1)

- **文章標題 (原文)**：[原標題]
- **發表期刊/出版社名稱**：[期刊名稱或出版社]
- **作者**：[作者名單]
- **發表年份**：[YYYY]
- **關鍵字 (Keywords)**：[[概念1]], [[概念2]], [[概念3]] （使用雙向連結）
- **檔案連結**：[[相對路徑/檔案名|顯示文本]]
- **研究主題**：[1-2句話總結]
- **問題意識**：[研究背景與動機，2-3句話]
- **研究問題**：[核心研究問題，通常是"X 如何影響 Y"]
- **研究方法**：[定性/定量/混合研究，樣本量等]
- **研究結果**：[核心發現摘要]
- **研究討論**：[論文討論的理論含義]
- **未來建議**：[論文提出的未來研究方向或實踐建議]
```

---

### **Pass 2：文章深度分析**

進行 5W1H 式的結構化分析，回答"它在說什麼"的問題。

```markdown
## 🔍 第二步：文章深度分析 (Pass 2)

1. **它的問題意識是什麼？**
   [為什麼這個研究很重要？背景脈絡是什麼？]

2. **它討論的問題是什麼？**
   [論文的核心研究問題或假設是什麼？]

3. **它採取的研究方法是什麼？**
   [研究設計、樣本、資料收集方式、分析方法]

4. **它得到的結論是什麼？**
   [主要發現、統計結果、質性發現摘要]

5. **它對這個研究的建議是什麼？**
   [論文作者針對教育/理論/未來研究的建議]
```

---

### **Pass 3：單篇期刊論文評論**

撰寫該論文的綜合評論，包括引用格式、貢獻度評估、缺陷指出和核心金句。

```markdown
## ✒️ 第三步：單篇期刊論文評論 (Pass 3)

**【APA 7th 格式出處】**：
[完整 APA 引用]

1. **這篇論文在說什麼？**
   [1段話的核心敘述]

2. **它有什麼貢獻？我們從它學到什麼？**
   [該論文的原創性和實踐意義]

3. **它有什麼缺陷或不足的地方？**
   [樣本限制、方法論弱點、普遍性問題等]

4. **它的研究發現與討論推論 (核心金句)**：
   "[直接引用或改寫的核心觀點]"
```

---

### **Pass 4：理論模型與關鍵參數**

將論文的理論框架視覺化，並提取可應用的變項映射。

```markdown
## 📊 第四步：理論模型與關鍵參數 (Pass 4)

### 1. 理論錨點 (Theoretical Anchors)
- **核心來源**：[該論文基於的主要理論/框架]
- **支撐理論**：[補充性理論]
- **對話文獻**：[相關的對標研究]

### 2. 變項映射 (Variable Mapping)
- **自變項**：[獨立變數，通常是原因]
- **中介變項**（如有）：[介於原因和結果之間的機制]
- **控制變項**：[被控制的背景因素]
- **依變項**：[因變數，即研究的結果]

### 3. 模型視覺化 (Mermaid Model)
\`\`\`mermaid
graph LR
    A[變項1] -->|關係| B[變項2]
    C[變項3] -->|影響| B
\`\`\`
```

---

### **Pass 5：知識小卡合成點 (Atomic Cards)**

根據「一洞察一卡片」原則，將論文中最具價值的發現拆解為獨立的小卡。

**卡片檔案規範 (`wiki/cards/[slug].card.md`)：**
```markdown
---
title: "卡片標題"
type: card
tags: [標註標籤]
sources: [summary-source-slug]
last_updated: YYYY-MM-DD
---

## [概念名稱]

**來源**：作者 (年份), 期刊名稱, p. 頁碼 (或連結).

**核心概念**：
解決什麼問題？用了什麼方法？得出什麼結論？（200-300 字，精簡為主，親筆轉述）。

**想法/連結**：
- 啟發與想法：這段內容觸動了什麼？
- 知識缺口：研究不足之處或與自己研究的相關性。
- 評論：同意或不同意此觀點？
- 聯想：[[相關文獻1]], [[相關概念2]]
```

**摘要頁面呈現格式：**
```markdown
## 💡 第五步：知識小卡合成點 (Atomic Cards)

- [[卡片檔名1.card|卡片標題]]：[核心觀點摘要]
```

### 步驟 4：知識網路化（實體/概念頁面）

對於步驟 2 提取的每個實體和概念：

**目標目錄：**
- 實體 → `wiki/entities/`
- 概念 → `wiki/concepts/`

**處理邏輯：**
1. 頁面不存在 → 按照 CLAUDE.md 的 Frontmatter 規範建立新頁面
2. 頁面已存在 → 讀取現有內容，**增量合併**新資訊
3. **發現衝突** → **立即暫停**，向使用者報告衝突內容，詢問處理方式後再繼續

**頁面模板：**

```markdown
---
title: "頁面名稱"
type: entity | concept
tags: [標籤]
sources: [關聯的原始檔]
last_updated: YYYY-MM-DD
---

## 定義
[對該實體/概念的定義]

## 關鍵資訊
[從原始檔中提取的詳細資訊]

## 關聯連結
- [[summary-source-slug]] — 來源
- [[RelatedEntity]] — 相關實體
```

### 步驟 5：更新全域登錄檔

**更新 `wiki/index.md`：**
按照 CLAUDE.md 規定的格式，將新增頁面新增到對應分類下：
- Sources: `[[summary-source-slug]] — 該資料的核心主旨`
- Entities: `[[EntityName]] — 該實體的身份定義`
- Concepts: `[[Concept Name]] — 該概念的核心定義`

**更新 `wiki/log.md`：**
追加操作日誌（Append-only）：
```markdown
## [YYYY-MM-DD] ingest | 操作簡述
- **變更**: 新增 [[PageName]]; 更新 [[index.md]]
- **衝突**: 無 (或: 衝突 [[ConflictingPage]], 已暫停等待決策)
```

### 步驟 6：歸檔原始檔

在確認以下全部完成後，將原始檔移動到 `raw/09-archive/`目錄：
- sources 頁面已建立
- 實體/概念頁面已建立或更新
- index.md 已更新
- log.md 已更新

**絕對禁止修改原始檔內部的文字。**

## 衝突處理流程

當發現新舊知識衝突時：

1. **暫停**：停止當前 ingest 流程
2. **報告**：向使用者說明衝突內容（哪個頁面、衝突點是什麼）
3. **詢問**：請使用者選擇處理方式：
   - A) 保留新舊兩者，標註為"知識衝突"
   - B) 用新知識覆蓋舊知識
   - C) 放棄本次 ingest
4. **繼續**：根據使用者選擇繼續或終止

## 注意事項

- 絕對不讀取 `raw/09-archive/` 下的任何檔案
- 所有 wiki 頁面必須包含 `## 關聯連結` 區域，不能產生孤立頁面
- 使用繁體中文編寫所有內容
- 實體與概念命名一律使用 Title Case（單字首字母大寫，單字間使用空白），來源摘要使用 kebab-case
- 僅 raw 檔案名稱使用底線代替空白，其餘連結與檔名一律使用 kebab-case