---
title: "校務專題預測退學高風險群"
aliases: [亞洲大學 2020 退學預測, Asia University Dropout Prediction]
type: source
author: "亞洲大學 (校務研究發展中心)"
year: 2020
journal: "亞洲大學校務研究公開報告"
doi: "N/A"
tags: [STT, 校務研究, 預測模型, 機器學習, 私立大學, 弱勢學生, 預警干預]
sources: [raw/09-archive/2020_亞洲大學_校務專題預測退學高風險群.pdf]
last_updated: 2026-04-23
---

## Bibliographic Confidence
- **Source completeness**: High (Institutional Research Office public report)
- **Metadata confidence**: High
- **Notes**: 本文為私立前段大學（亞洲大學）校務研究中心之專案報告。有別於頂大，私校的生源異質性更高、經濟弱勢比例更大，其預測模型的建構對台灣大多數的大學具備高度參考價值。

## Core Claims (English Only)
- **Problematic**: Private universities in Taiwan face existential enrollment pressures. Losing a student not only impacts the individual's future but also significantly damages the institution's financial stability. Traditional post-hoc counseling is ineffective; intervention must occur before the student fails.
- **Research Problem**: Using multi-dimensional institutional data, can we build a machine-learning model to accurately predict which students are at "high risk" of dropping out within their first or second year?
- **Key Results**: (1) **The Predictive Algorithm**: By combining static variables (entrance scores, high school background, financial aid status) with dynamic variables (first-semester GPA, attendance, library usage), the IR model achieved high precision in tagging at-risk students. (2) **The Early-Warning Triad**: The data revealed that "Poor First-Semester GPA," "Low Class Attendance," and "No Campus Club Participation" are the deadliest triad predicting dropout in private institutions. (3) **Targeted Rescue**: The system automatically generates a "Watchlist" for departmental counselors, shifting the burden of seeking help from the student to the institution.
- **Methodology**: Quantitative predictive modeling (data mining/machine learning) using institutional data lakes.

## Structured Reading Notes (中文摘要)
- **研究主題**: 運用校務研究 (IR) 數據建構私立大學退學高風險預測模型。
- **核心發現**:
    - **動態特徵勝過靜態特徵**: 學生入學時的「指考/統測分數」對退學的預測力，遠不如入學後「大一上學期的成績與出缺席率」。這證實了大學初期的適應表現才是去留的關鍵。
    - **預警三合一**: 「成績差、常曠課、零社團」構成了一個封閉的惡性循環，是私校生休退學的最強特徵。
    - **主動式搶救**: 透過演算法，學校能在期中考後自動生成「高風險名單」，要求導師主動介入，防堵「死當退學」的發生。
- **貢獻**: 展現了數據探勘技術如何成為私立大學在少子化浪潮中的「防禦性留才武器」。

## Career Development Analysis (生涯發展觀點)
> [!IMPORTANT]
> **研究者觀點導入**：亞洲大學 (2020) 的預測專案揭露了 **「演算法下的弱勢現形：從被動等待到主動接軌的轉銜防護網 (Visibility of Vulnerability via Algorithms: From Passive Waiting to Active Interventions in Transition)」**。

*   **生涯層次的體現**：在傳統的輔導體系中，只有那些「願意主動敲開諮商室大門」的學生能得到幫助（監察院 2022 批評的被動式輔導）。然而，真正陷入轉銜危機（如嚴重志趣不合、經濟打工排擠課業）的弱勢學生，往往是最沉默、最缺乏求助資本的一群。亞洲大學的 IR 預測模型，在生涯輔導的意義上是革命性的：它讓這些 **「沉睡的弱勢 (Dormant Vulnerable)」** 無所遁形。演算法透過捕捉他們「不去上課」、「不去圖書館」的數位足跡，提前發出了 **「職涯撤資的求救訊號」**。這使得高教機構能將原本用於「退學行政」的能量，前置轉化為 **「早期職涯干預 (Early Career Intervention)」**，在學生自我放棄之前，用機構的力量強行將其拉回轉銜軌道。
*   **文獻忽略之處**：未探討當導師拿到「高風險名單」後，是否具備足夠的「諮商知能與時間」去接住這些學生，否則預測只會淪為行政KPI的另一種壓迫。
*   **重構方向**：應將「出缺席與社團參與度」定義為測量新生 **「校園社會化整合度」** 的最前線數位指標。

## Atomic Knowledge (Links to Cards)
- [[card-2020-asia-ir-dormant-vulnerable-detection]] — 沉睡弱勢的現形：演算法如何捕捉不願求助的高風險學生。
- [[card-2020-asia-dropout-triad-in-private-univ]] — 輟學預警三合一：成績、曠課、零社團的惡性循環。
- [[card-2020-asia-early-career-intervention]] — 早期職涯干預：從預警名單到主動接軌的轉銜防護網。

## Extracted Concepts & Entities
- [[亞洲大學]]
- [[Dormant Vulnerable]], [[Early Career Intervention]], [[Socialization Integration Metrics]]

## Relations & Context
- [[summary-2022-廖羚吟-影響大學休退率相關因素之探討]] (亞洲大學的實作正是廖羚吟所提倡的「客觀變數預警機制」的完美落地範例)。
- [[summary-2018-林永安-大學校院高休退學率形成原因及因應之道]] (亞洲大學演算法抓出的「零社團」特徵，完美呼應了林永安指出的「沒有伴（社交孤立）」是退學主因的觀點)。
- **Domain**: [[Secondary-to-Tertiary Transition (STT)]]

---
[[index|Back to Index]]

---
## 📝 創建與編修紀錄
- 2026-04-23: 由 AI 執行 V7_Atomic 全新匯入與重構，導入演算法下的弱勢現形與早期干預分析。
