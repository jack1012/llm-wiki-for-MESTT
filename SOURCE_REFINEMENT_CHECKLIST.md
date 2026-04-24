# Source 文件精修檢查清單

## 📋 V5_Atomic 標準化精修指南

### **品質評分標準**

| 評分 | 標準 | 範圍 |
|------|------|------|
| ⭐⭐⭐⭐⭐ | 優秀 | ≥95% |
| ⭐⭐⭐⭐ | 良好 | 80-95% |
| ⭐⭐⭐ | 中等 | 60-80% |
| ⭐⭐ | 較差 | <60% |

---

## ✅ 精修檢查項目

### **1. YAML Frontmatter（權重: 7 分）**

**必須項目：**
- [ ] `title` — 完整英文標題
- [ ] `author` — 主作者名字（全名）
- [ ] `year` — YYYY 格式
- [ ] `journal` — 期刊名稱
- [ ] `type: source` — 固定值
- [ ] `tags` — 至少 3 個標籤（如 Transition, STT, Math_Education）
- [ ] `sources` — 指向原始 PDF 路徑
- [ ] `last_updated` — YYYY-MM-DD 格式

**可選但推薦：**
- [ ] `aliases` — 中文譯名或別名
- [ ] `volume`, `pages` — 期刊卷號和頁碼
- [ ] `doi` — DOI 連結
- [ ] `case_id` — 案號編號

**檢查方法：**
```bash
# 確認 YAML 有效性（必須以 --- 開頭結尾）
grep -A 15 "^---$" summary-*.md | head -20
```

---

### **2. Core Claims（權重: 8 分）**

必須包含完整的 4 個 Core Claims，每個 50-100 字：

#### **2.1 Problematic**
- [ ] 說明論文要解決的**理論張力或領域層級衝突**
- [ ] 不是簡單描述現象，要抓住根本問題

**範例（差）：** "Secondary-to-tertiary transition is difficult"
**範例（優）：** "While universities expanded access to mathematics (democratization goal), the pedagogical infrastructure remained unchanged, creating a paradox: weak students now need high-touch personalized instruction, but university structures prevent such contact."

#### **2.2 Research Problem**
- [ ] 說明這篇論文要解決的**具體研究問題**
- [ ] 用 "What/How/Why" 開頭
- [ ] 應該是可被驗證的

**範例（差）：** "How does this paper contribute to STT?"
**範例（優）：** "What are the systematic, internationally-comparative difficulties students face when transitioning from secondary to tertiary mathematics education, and how do cognitive, sociological, and pedagogical factors interact?"

#### **2.3 Key Results**
- [ ] 論文的**核心發現**，不是方法論
- [ ] 應該包含具體的發現或數據

**範例（差）：** "Investigates transition difficulties"
**範例（優）：** "Three distinct categories identified: (1) Epistemological—shift from calculation to proof; (2) Sociological—class size increase and competitive culture; (3) Didactical—teacher preparation deficit. Core insight: difficulties stem from system design mismatches, not student deficits."

#### **2.4 Methodology**
- [ ] 研究方法類型：Qualitative/Quantitative/Mixed/Theoretical
- [ ] 樣本量（若適用）：N=XXX
- [ ] 主要方法名稱

**範例：** "Mixed-methods: Likert questionnaire (N=610, 4 countries) + teacher interviews + qualitative analysis"

---

### **3. Atomic Knowledge - Cards（權重: 6 分）**

必須有 2-3 張卡片連結，**且卡片必須存在**：

- [ ] **卡片 1**: `[[wiki/cards/author-YYYY-concept-1]]` — 簡要描述
- [ ] **卡片 2**: `[[wiki/cards/author-YYYY-concept-2]]` — 簡要描述
- [ ] **卡片 3** (選項): `[[wiki/cards/author-YYYY-concept-3]]` — 簡要描述

**檢查方法：**
```bash
# 驗證卡片存在
ls wiki/cards/author-YYYY-concept-*.md
```

**描述應該包括：**
- 概念的英文定義
- 中文別名（括號內）
- 該論文獨特的貢獻

**範例：**
```
- [[wiki/cards/guzman-1998-three-layer-difficulties-model]] 
  — The three-layer (cognitive-sociological-didactical) framework. (三層困難模型)
```

---

### **4. Extracted Concepts & Entities（權重: 6 分）**

#### **4.1 Entities（必須 2-3 個）**
- [ ] 主要研究者名字（全名）— 其專業背景或角色說明
- [ ] 相關機構/研究中心
- [ ] （可選）期刊或會議

**格式：**
```
- **Entities**: 
  - [[Author Name]] — Professional role/affiliation
  - [[Institution]] — Location or type
```

#### **4.2 Concepts（必須 3-5 個）**
- [ ] 論文涉及的核心概念/理論
- [ ] 每個概念應該有簡短說明

**格式：**
```
- **Concepts**:
  - [[STT]] — Core phenomenon studied
  - [[Cognitive Discontinuity]] — Specific aspect analyzed
  - [[Didactical Transposition]] — Theoretical framework
```

**常見的 STT 核心概念：**
- Secondary-Tertiary Transition (STT)
- Epistemological/Cognitive Discontinuity
- Affective Factors in Mathematics Education
- Identity and Agency in Learning
- Didactical Transposition
- Self-Directed Learning
- Teacher Professionalization

---

### **5. Relations & Context（權重: 3 分）**

- [ ] **Theories**: 論文使用的理論框架（例如 ATD, TDS, AMT）
- [ ] **Compare with**: 類似或相反的研究（至少 1 個）
- [ ] **Influences**: 該論文對後續研究的影響（若已知）
- [ ] **Domain**: 領域定位（通常是 STT）

**格式：**
```
## Relations & Context
- **Theories**: [[Theory Name A]], [[Theory Name B]]
- **Compare with**: [[Other Paper]] (similar/contrasting approach)
- **Influences**: [[Later Work A]] (2010+)
- **Domain**: [[Secondary-to-Tertiary Transition]]
```

---

### **6. 編修紀錄（權重: 1 分）**

- [ ] 包含 `## 創建與編修紀錄` 區塊
- [ ] 最新時間戳記
- [ ] 簡短說明版本內容

**格式：**
```
## 創建與編修紀錄
- **2026-04-22 15:30**: V5_Atomic 完整精修
  - 補充完整 Core Claims（Problematic/RQ/Results/Methodology）
  - 驗證 3 張卡片連結存在
  - 新增 5 個 Concepts + 3 個 Entities
  - 品質評分: ⭐⭐⭐⭐⭐ (95%+)
```

---

## 📊 精修流程（按優先級）

### **Priority 1: Tier 1 論文（6 篇）— 達到 ⭐⭐⭐⭐⭐**

```
1. Tinto (1973)          — summary-1973-tinto-*
2. Tinto (1975)          — summary-1975-tinto-*
3. Crawford (1994)       — summary-1994-crawford-*
4. De Guzmán (1998)      — summary-1998-guzman-difficulties-stt ✅ (已完成)
5. Gueudet (2008)        — summary-2008-gueudet-*
6. DiMartino (2018)      — summary-2018-dimartino-*
```

**各篇特殊說明：**
- De Guzmán: 已達 ⭐⭐⭐⭐⭐，無需調整
- Tinto: 兩篇論文相近，需分別標註

---

### **Priority 2: Tier 2 論文（28 篇）— 達到 ⭐⭐⭐⭐**

列表見 INGEST_TRACKER.md

---

### **Priority 3: 其餘論文（304 篇）— 最低 ⭐⭐⭐ (60%)**

---

## 🛠️ 精修執行技巧

### **如何快速補充 Core Claims？**

**步驟 1: 讀取原始論文摘要或結論**
```bash
pdftotext wiki_sources/filename.pdf - | head -500
```

**步驟 2: 提煉 4 個要素**
- Problematic: 第一段通常有問題敘述
- Research Problem: 通常是 "Research Question" 或 "Objectives"
- Key Results: 論文最後的發現總結
- Methodology: 論文的 "Methods" 或 "Design" 部分

**步驟 3: 控制字數**
- Problematic: 50-70 字
- Research Problem: 40-60 字
- Key Results: 80-120 字
- Methodology: 40-80 字

---

### **如何驗證卡片存在？**

```bash
# 檢查卡片是否存在
for card in $(grep -o '\[\[wiki/cards/[^\]]*\]\]' wiki/sources/summary-*.md | cut -d/ -f3 | cut -d] -f1 | sort -u); do
  if [ ! -f "wiki/cards/${card}.md" ]; then
    echo "❌ Missing: $card"
  fi
done
```

---

### **如何批量填充 Concepts？**

**常用 STT 概念列表：**
```
1. Secondary-Tertiary Transition (STT)
2. Epistemological/Cognitive Discontinuity
3. Affective Factors in Mathematics Education
4. Identity and Agency in Learning
5. Didactical Transposition
6. Self-Directed Learning
7. Teacher Professionalization
8. Student Support Systems
9. Mathematical Maturity
10. Boundary Crossing
```

**檢查：** 論文涉及以上哪些概念，在 Concepts 區塊中列出。

---

## 📈 品質評分公式

```
總分 = (YAML × 7 + CoreClaims × 8 + Cards × 6 + ConceptsEntities × 6 + Relations × 3 + EditLog × 1) / 31

評分對應：
- ≥ 95% → ⭐⭐⭐⭐⭐ (優秀)
- 80-95% → ⭐⭐⭐⭐ (良好)
- 60-80% → ⭐⭐⭐ (中等)
- < 60% → ⭐⭐ (較差)
```

---

## ✨ 精修目標

**Tier 1（6 篇）：**
- 開始評分: 66.7% (⭐⭐⭐)
- 精修目標: 95%+ (⭐⭐⭐⭐⭐)
- 預計時間: 2-3 小時

**Tier 2（28 篇）：**
- 開始評分: 混合 (平均 ~45%)
- 精修目標: 85%+ (⭐⭐⭐⭐)
- 預計時間: 6-8 小時

**Tier 3（304 篇）：**
- 開始評分: 混合 (平均 ~20%)
- 精修目標: 70%+ (⭐⭐⭐)
- 預計時間: 12-16 小時

---

**準備好開始精修了嗎？**
