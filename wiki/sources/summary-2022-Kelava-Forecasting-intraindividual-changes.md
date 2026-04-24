---
title: "Forecasting intra-individual changes of affective states in the transition to university mathematics"
aliases: [Kelava 2022, 情意預測模型, 情緒崩盤預警, 動態情感變化]
type: source
author: "Augustin Kelava et al."
year: 2022
journal: "Learning and Instruction"
doi: "10.1016/j.learninstruc.2021.101561"
tags: [STT, 情意領域, 預測模型, 縱向研究, 動態變化, 情緒預警, 學習分析]
sources: [raw/01-articles/2022_kelava_forecasting-intra-individual-changes-of-affective.pdf]
last_updated: 2026-04-23
---

## Bibliographic Confidence
- **Source completeness**: High (Peer-reviewed high-impact learning analytics study)
- **Metadata confidence**: High
- **Notes**: 本文是將先進統計預測模型應用於 STT 情意領域的代表作。它突破了傳統只預測「成績死當」的框架，將預警雷達升級到能夠捕捉「個體內在情緒崩塌」的微小震動。

## Core Claims (English Only)
- **Problematic**: We know that affective states (interest, self-concept, anxiety) fluctuate wildly during the STT (Geisler 2021), and these fluctuations predict dropout. But can we mathematically *forecast* exactly when a specific student's affective state is about to crash, allowing for preemptive counseling?
- **Research Problem**: Can continuous, high-frequency longitudinal data be used to forecast the "intra-individual" (within-person) trajectories of affective states during the crucial first weeks of university mathematics?
- **Key Results**: (1) **High-Frequency Emotion Tracking**: By sampling students' emotional states weekly (instead of just pre- and post-semester), the model captures the violent, non-linear volatility of the transition. (2) **Forecasting the Affective Crash**: The statistical models (like continuous-time models) can successfully predict a student's future affective state based on their previous emotional trajectory. The algorithm can flag a student whose "anxiety" is accelerating toward a tipping point, even if their current grade is still passing. (3) **The "Silent Suffering" Signature**: The model identifies a specific trajectory of students who maintain passing grades but whose emotional depletion (drop in interest and self-concept) signals impending burnout.
- **Methodology**: Intensive longitudinal design with high-frequency measurements (weekly diaries/surveys) analyzed using continuous-time structural equation modeling (CT-SEM).

## Structured Reading Notes (中文摘要)
- **研究主題**: 建立統計模型，預測大一新生在轉銜期間「內在情意狀態（如焦慮、興趣、自信）」的動態變化與崩盤點。
- **核心發現**:
    - **高頻情緒追蹤**: 過去的研究是一學期測兩次問卷，Kelava 則是「每週」追蹤學生的情緒波動。他發現大一新生的情緒就像雲霄飛車，充滿了劇烈的非線性震盪。
    - **預測情緒崩盤**: 模型證實，我們可以用演算法預測「情緒的墜毀」。如果一個學生前三週的焦慮感以特定的斜率上升，演算法可以在第四週提前發出警報：「這個人的自我概念即將崩潰」，即使他當時的微積分小考還及格。
    - **抓出「靜默的受苦者」**: 這是最重要的一點。傳統的預警系統只看成績，但這個模型能抓出「成績及格，但心裡已經快被逼瘋」的學生（高焦慮、低自我概念）。
- **貢獻**: 將轉銜預警系統的層次，從「學術成績預警」提升到了「心理健康預警」。

## Career Development Analysis (生涯發展觀點)
> [!IMPORTANT]
> **研究者觀點導入**：Kelava (2022) 的預測模型為生涯輔導裝上了最高級的雷達：**「情緒耗竭的早期預警：用『高頻情意追蹤』接住那些成績及格但職涯靈魂即將死去的靜默受苦者 (Early Warning of Emotional Exhaustion: Using 'High-Frequency Affective Tracking' to Catch the Silent Sufferers Whose Grades Pass but Whose Career Souls are Dying)」**。

*   **生涯層次的體現**：在我們討論過的 Tsai (2020) 「演算法看守」中，AI 主要是看學生的數位足跡（登入次數、作業繳交）來預測成績死當。但 Kelava 的研究補足了最致命的盲區：**「靜默的受苦者 (Silent Sufferers)」**。
    在頂尖大學裡，有一群學生因為自尊心極強，他們會燃燒生命去死背微積分（Hall 2022 的策略性妥協），讓自己的期中考保持在 60 分。傳統的成績預警系統會認為這些學生「轉銜成功、非常安全」。但 Kelava 的高頻模型會發出尖銳的警報，因為這群學生的 **「情緒耗竭 (Emotional Exhaustion)」** 已經達到了臨界點。
    從生涯發展來看，這種「硬撐出來的及格」往往伴隨著對該學科的極度恐懼與厭惡（引發 Abiola 2021 的失能生涯思維）。這群學生最後即使畢業，也會因為「職涯靈魂的死去」而拒絕進入相關產業。Kelava 的研究賦予了大學輔導中心一種超能力：我們可以在學生的「數學自信與興趣」跌破警戒線的前一週，主動把他們叫進諮商室，告訴他們「放過自己，及格就好」，從而挽救他們對這個領域的最後一絲熱情。
*   **文獻忽略之處**：未探討在實際校務運作中，要求學生「每週填寫情緒日誌」是否會引發學生的「測驗疲勞 (Test Fatigue)」或隱私權爭議。
*   **重構方向**：大學的導師制度必須從「期中預警」升級為「情意動態追蹤」。透過極短（1分鐘內）的每週手機 App 推播問卷，監控新生第一個月的情緒斜率，建立真正的「心理防線」。

## Atomic Knowledge (Links to Cards)
- [[card-2022-kelava-affective-crash-forecasting]] — 情緒崩盤預警：用高頻數據預測學生的自信與興趣何時會觸及底線。
- [[card-2022-kelava-silent-sufferers-in-stt]] — 靜默的受苦者：為何成績及格的學生，反而是情緒耗竭的高風險群。
- [[card-2022-kelava-emotional-exhaustion-radar]] — 情緒耗竭雷達：超越成績單，直擊學生職涯靈魂狀態的心理預警模型。

## Extracted Concepts & Entities
- [[Augustin Kelava]]
- [[Affective Forecasting]], [[Silent Sufferers]], [[Emotional Exhaustion Radar]]

## Relations & Context
- [[summary-2020-Tsai-Precision-education-with]] (Kelava 的模型是 Tsai「精準教育」的完美心理學升級版。Tsai 預測的是「退學行為」，Kelava 預測的是導致退學的「情緒崩潰」)。
- [[summary-2021-Rach-Interest-selfconcept-transition]] (Geisler 發現了興趣與自信的雙螺旋墜落，而 Kelava 則發明了預測這場墜落何時會發生的雷達)。
- **Domain**: [[Secondary-to-Tertiary Transition (STT)]], [[Tier 3 Applied Studies]]

---
[[index|Back to Index]]

---
## 📝 創建與編修紀錄
- 2026-04-23: 由 AI 執行 V7_Atomic 深度重構，導入「靜默的受苦者」與「情緒崩盤預警」之動態預測分析。
