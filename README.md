# 🎓 LLM-Wiki for Mathematics Education Research (STT)

此專案是一個基於大語言模型 (LLM) 與卡片盒筆記法 (Zettelkasten) 建構的學術知識庫，專注於 **中學到大學數學教育轉銜 (Secondary-to-Tertiary Transition, STT)** 領域的研究文獻攝取與合成。

## 🌟 核心特色
- **學術編譯自動化**: 透過精密的 Ingest Pipeline，自動從 PDF 提煉概念、實體與原子知識卡片。
- **嚴格學術規範**: 
  - 自動區分 **Problematic** (問題背景張力) 與 **Research Problem** (具體研究問題)。
  - **一文雙卡**: 每篇文獻產出 2 張獨立卡片，包含 200-300 字轉述與個人思辨反思。
  - **知識網絡**: 自動連結合著者 (Co-authors)、出版期刊 (Journals) 與理論奠基者 (Foundational Figures)。
- **版本控管**: 基於 Git 的知識管理，確保學術探索的每一步都可追溯。

## 📂 目錄結構
- `raw/`: 原始文獻存儲（分流為論文、書籍與筆記）。
- `wiki/`: 生成的知識庫核心。
  - `sources/`: 文獻深度摘要。
  - `cards/`: 原子知識卡片（Zettelkasten 核心）。
  - `entities/`: 研究者、機構與期刊。
  - `concepts/`: 理論、變項與學術術語。
- `.claude/skills/`: 控制 AI 自動化行為的攝取指令集。

## 📈 目前進度
- **已處理文獻**: 4 篇
- **原子卡片**: 8 張
- **關鍵概念**: 20+ 個
- **研究實體**: 10+ 位

---
*Generated with ❤️ by Antigravity AI Coding Assistant.*
