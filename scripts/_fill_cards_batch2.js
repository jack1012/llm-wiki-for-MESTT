const fs = require('fs');
const path = require('path');
const cardsDir = 'D:/llm-wiki-en/wiki/cards';
const conceptsDir = 'D:/llm-wiki-en/wiki/concepts';
const entitiesDir = 'D:/llm-wiki-en/wiki/entities';

// ============================================================
// BATCH 2: 林靜慧 2021a + 2021b Cards, Concepts, Entities
// ============================================================
const cards = {

'card-2021-lin-work-demand-as-primary-dropout.md': `---
title: "Work Demand as the Primary Graduate Dropout Driver"
aliases: [Lin 2021 Work Demand, 工作需求碩士退場第一因]
type: card
source: "[[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]], [[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]"
author: "林靜慧"
year: 2021
tags: [Graduate-Dropout, Work-Demand, Taiwan, Career-Study-Conflict]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Both cluster analysis (Lin et al., 2021a) and Random Forest importance ranking (Lin, 2021b) confirm that **"Work Demand" (工作需求)** is the single most powerful predictor/driver of graduate student dropout in Taiwan, accounting for 32.94% of all dropout reasons and outranking all academic factors. This finding fundamentally reframes graduate attrition as a **labor-market phenomenon**, not an academic failure.

## Key Evidence

- **32.94%** of master's students who dropped out cited "Work Demand" as the primary reason (Lin et al., 2021a)
- Random Forest variable importance: Work Demand > Others > Illness/Injury > Academic Factors (Lin, 2021b)
- This pattern is consistent across institutional clusters — even academically stronger universities show significant work-demand dropout

## Career Development Lens

The dominance of Work Demand reveals a **Systemic Career Trap**: Taiwanese employers incentivize graduate study (through salary scales tied to degree level) while simultaneously creating work conditions that make completion impossible. Students are trapped between the **credential imperative** and the **time scarcity** of full employment.

## Relations

- Concept: [[wiki/concepts/Work Demand Conflict]]
- Concept: [[wiki/concepts/Graduate Student Attrition]]
- Entity: [[林靜慧]]
- Related Card: [[card-2021-lin-three-institutional-dropout-clusters]]
- Related Card: [[card-2021-lin-financial-irrelevance-in-graduate-dropout]]
`,

'card-2021-lin-three-institutional-dropout-clusters.md': `---
title: "Three Institutional Dropout Clusters in Taiwan Graduate Schools"
aliases: [Lin 2021 K-means Clusters, 台灣碩士班三集群退場類型]
type: card
source: "[[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]"
author: "林靜慧; 林思吟; 胡柏先"
year: 2021
tags: [Graduate-Dropout, Institutional-Research, Cluster-Analysis, Taiwan]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Using k-means cluster analysis of 70 Taiwanese general universities (107 AY data), Lin et al. (2021a) identified **three distinct institutional dropout typologies** — revealing that "graduate dropout" is not a monolithic phenomenon but varies fundamentally by school type and student population.

## The Three Clusters

| Cluster | Dominant Dropout Reason | Interpretation |
|---------|------------------------|----------------|
| **Cluster 1** (Low Attrition / Exit-Driven) | Military Service, Going Abroad | Planned transitions — students leave for **intentional life events**, not academic or career failure |
| **Cluster 2** (High Work-Demand) | Work Demand (dominant) | Serving working professionals who face **employment-study conflict**; usually professional master's programs |
| **Cluster 3** (Academic-Interest) | Thesis/Academic Difficulty, Interest Mismatch | Poor program-student fit at admission; **interest mismatch** reveals admission process failures |

## Career Development Lens

Each cluster represents a different career-trajectory pattern: Cluster 1 = **deliberate career redirection**; Cluster 2 = **career advancement via credential under structural constraint**; Cluster 3 = **identity-career mismatch** requiring earlier intervention at admission counseling.

## Relations

- Concept: [[wiki/concepts/Institutional Research (IR)]]
- Concept: [[wiki/concepts/Interest Mismatch]]
- Entity: [[林靜慧]]
- Related Card: [[card-2021-lin-work-demand-as-primary-dropout]]
`,

'card-2021-lin-financial-irrelevance-in-graduate-dropout.md': `---
title: "Financial Irrelevance in Graduate Dropout"
aliases: [Lin 2021 Finance Not Primary, 碩士退場中財務因素的低重要性]
type: card
source: "[[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]"
author: "林靜慧"
year: 2021
tags: [Graduate-Dropout, Financial-Factors, Taiwan, Counter-Intuitive]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Lin (2021b)'s Random Forest analysis produces a **counter-intuitive finding**: while economic/financial difficulty is a major predictor of *undergraduate* dropout (consistent with international literature), it is among the **least important variables** for predicting *graduate* dropout patterns in Taiwan. This suggests that graduate-level attrition operates through entirely different mechanisms than undergraduate attrition.

## Key Evidence

- Random Forest importance ranking places "Financial Difficulty" at the **bottom** of the variable importance list for graduate dropout clustering
- Contrast: For undergraduate dropout, financial factors are consistently top-3 predictors in global literature (Tinto, 1975; Bean, 1980)
- Interpretation: Graduate students in Taiwan are typically employed (hence the work-demand dropout) and have sufficient income; the barrier is **time scarcity**, not financial scarcity

## Career Development Lens

This finding has major policy implications: **tuition subsidies or financial aid will not reduce graduate dropout**. Interventions must instead target **structural time-flexibility** (schedule accommodation, credit banking, leave policies) and **employer-university partnerships** that recognize academic work as career development.

## Relations

- Concept: [[wiki/concepts/Graduate Student Attrition]]
- Concept: [[wiki/concepts/Work Demand Conflict]]
- Entity: [[林靜慧]]
- Related Card: [[card-2021-lin-work-demand-as-primary-dropout]]
- Related Card: [[card-2021-lin-tinto-external-integration-inversion]]
`,

'card-2021-lin-phd-attrition-paradox.md': `---
title: "The PhD Attrition Paradox"
aliases: [Lin 2021 PhD Dropout, 博士班退場悖論]
type: card
source: "[[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]"
author: "林靜慧; 林思吟; 胡柏先"
year: 2021
tags: [PhD-Dropout, Graduate-Attrition, Taiwan, Paradox]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Lin et al. (2021a) document a **counterintuitive graduation ladder**: despite being the most academically selective programs, PhD programs have the **highest dropout rate** (21%) > Professional Master's (16%) > Day Master's (14%). The paradox is that higher academic selectivity does not protect against attrition — it may amplify it through increased thesis dependency and longer time-to-completion.

## Key Evidence

- PhD attrition: **21%** — highest across all graduate degree levels in Taiwan
- Professional Master's: **16%**
- Day Master's: **14%**
- Overall average across clusters: ~20.58%

## Career Development Lens

The PhD Attrition Paradox reveals that **doctoral training is not a meritocratic filter** but a complex career transition process where structural factors (funding dependency, supervisor relationship, thesis bottleneck) override prior academic achievement. It suggests that career development support for PhD students must address unique vulnerabilities not present at lower degree levels.

## Relations

- Concept: [[wiki/concepts/Graduate Student Attrition]]
- Entity: [[林靜慧]]
- Related Card: [[card-2021-lin-work-demand-as-primary-dropout]]
`,

'card-2021-lin-tinto-external-integration-inversion.md': `---
title: "Tinto External Integration Inversion in Graduate Dropout"
aliases: [Lin 2021 Tinto Graduate, Tinto框架的外部整合主導]
type: card
source: "[[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]"
author: "林靜慧"
year: 2021
tags: [Tinto, Graduate-Dropout, Career-Study-Conflict, Taiwan, Theory-Extension]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Lin (2021b) implicitly extends Tinto's (1975, 1993) Student Integration Model to graduate level and reveals an **inversion**: while Tinto's original framework prioritized **academic and social integration** within the institution as retention drivers, Taiwan's graduate student data shows that **external system integration** (work/career demands) is the dominant force. The "external pull" overwhelms the institutional "academic pull."

## Tinto Framework Comparison

| Factor | Tinto's Original Emphasis | Lin's Graduate Finding |
|--------|--------------------------|------------------------|
| Academic Integration | **Primary driver** | Secondary — overshadowed by work demand |
| Social Integration | Important for undergrads | Less relevant for working professionals |
| External Commitments | Mentioned but secondary | **Primary driver of dropout** |

## Career Development Lens

The inversion demonstrates that **graduate students occupy a dual-system identity** — they are simultaneously workers and students, and the two systems compete for the same resource (time). Career development interventions for graduate students must work with both systems, not just the academic one.

## Relations

- Concept: [[wiki/concepts/Student Integration Theory]]
- Entity: [[Vincent Tinto]], [[林靜慧]]
- Related Card: [[card-2021-lin-work-demand-as-primary-dropout]]
- Related Card: [[card-2021-lin-financial-irrelevance-in-graduate-dropout]]
`,

};

// Concepts for Lin 2021
const concepts = {

'Work Demand Conflict.md': `---
title: "Work Demand Conflict"
aliases: [Career-Study Conflict, 工作-學業衝突, Employment-Study Tension]
type: concept
domain: [Graduate-Education, Career-Development, STT]
tags: [Work, Graduate, Taiwan, Retention]
last_updated: 2026-04-23
---

## Definition

**Work Demand Conflict** (工作需求衝突) describes the structural tension experienced by students — particularly at the graduate level — whose employment obligations consume the time and energy required for academic progress. Unlike financial difficulty, work demand conflict does not reflect **inability to pay** but **inability to participate** in the academic schedule.

## Prevalence

Lin et al. (2021a, Taiwan): "Work Demand" accounts for 32.94% of all master's student dropout reasons, ranking #1 above all academic factors.

## Key Mechanism

The conflict operates through **time scarcity, not financial scarcity**: graduate students who work full-time have income but not schedule flexibility, creating a structural impossibility rather than a motivational deficit.

## Policy Implication

Financial aid does not address work demand conflict. Effective interventions include: flexible scheduling, online/hybrid program formats, leave-of-absence policies, and employer-university partnership agreements that recognize academic work as professional development.

## Key Sources

- [[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]
- [[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]
`,

'Graduate Student Attrition.md': `---
title: "Graduate Student Attrition"
aliases: [研究所退場, 碩博士生流失, Doctoral Non-Completion]
type: concept
domain: [Graduate-Education, Retention, STT]
tags: [PhD, Master, Dropout, International]
last_updated: 2026-04-23
---

## Definition

**Graduate Student Attrition** refers to the departure of enrolled graduate students (master's or doctoral level) before completing their degree requirements. Unlike undergraduate attrition, graduate attrition is driven by distinct mechanisms: thesis dependency, supervisor relationships, funding instability, career-study conflict, and longer time-to-completion.

## Taiwan Rates (Lin, 2021)

| Degree Level | Attrition Rate |
|---|---|
| PhD | 21% |
| Professional Master's | 16% |
| Day Master's | 14% |
| **Overall Average** | **~20.58%** |

## Key Theoretical Frameworks

- **Tinto (1975, 1993)**: Student Integration Model — extended to graduate level
- **Bean (1980)**: External commitments as attrition driver
- **Lovitts (2001)**: Dissertation stage as critical dropout point in PhD programs

## Key Sources

- [[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]
- [[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]
`,

'Institutional Research (IR).md': `---
title: "Institutional Research (IR)"
aliases: [校務研究, IR, Data-Informed Decision Making in HE]
type: concept
domain: [Higher-Education-Administration, Data-Analytics, Policy]
tags: [IR, Data, Taiwan, Higher-Education]
last_updated: 2026-04-23
---

## Definition

**Institutional Research (IR)** (校務研究) is the systematic collection, analysis, and use of data about a higher education institution to support planning, policy-making, and improvement. In Taiwan, the Ministry of Education established a public IR data platform (教育部校務研究公開資料系統) to enable cross-institutional analysis.

## Role in Dropout Research

IR data enables researchers to move beyond individual institution case studies to conduct large-scale, cross-institutional analyses of student attrition patterns — as demonstrated by Lin et al. (2021) using data from 70 universities.

## Key Sources

- [[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]
`,

'Random Forest (Educational Statistics).md': `---
title: "Random Forest (Educational Statistics)"
aliases: [Random Forest, 隨機森林, Variable Importance Analysis]
type: concept
domain: [Statistics, Educational-Research, Machine-Learning]
tags: [Statistics, Methodology, Dropout-Research]
last_updated: 2026-04-23
---

## Definition

**Random Forest** is a machine learning ensemble method that builds multiple decision trees using random subsets of variables and combines their outputs to produce robust predictions and variable importance rankings. In educational research, it is used to identify which variables most significantly predict student outcomes (dropout, retention, etc.) in complex, high-dimensional datasets.

## Application in Graduate Dropout Research

Lin (2021b) used Random Forest variable importance (measured by permutation-based misclassification rate) to rank dropout reasons for Taiwan's graduate students, confirming "Work Demand" as the primary predictor.

## Advantage Over Traditional Methods

Unlike regression-based models, Random Forest: (1) handles non-linear relationships; (2) automatically accounts for interactions; (3) provides robust variable importance estimates without assuming normality.

## Key Sources

- [[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]
`,

};

// Entities for Lin 2021
const entities = {

'林靜慧.md': `---
title: "林靜慧 (Lin, Jing-Hui)"
aliases: [Lin Jing-Hui, Lin Ching-Hui, 林靜慧]
type: entity
entity_type: person
affiliation: "台灣某大學校務研究辦公室 (IR Office)"
role: "校務研究員；教育統計學者"
active_period: "2010s-2020s"
tags: [Taiwan, Institutional-Research, Graduate-Dropout, Statistics]
last_updated: 2026-04-23
---

## Profile

林靜慧 is a Taiwanese institutional researcher and educational statistician who has published a series of studies on graduate student attrition in Taiwan using the Ministry of Education's IR data platform. Her 2021 twin publications represent a methodological contribution — combining cluster analysis with Random Forest variable importance to establish that "Work Demand" is the dominant driver of graduate student dropout, overturning assumptions that financial or academic factors are primary.

## Key Contributions

1. First systematic k-means cluster analysis of graduate dropout across 70 Taiwan universities
2. First application of Random Forest variable importance to Taiwan graduate attrition data
3. Established the counter-intuitive finding that **financial factors are minor** in graduate attrition

## Primary Sources

- [[summary-2021-林靜慧-以校務研究探究大學校院碩士班休學原因]]
- [[summary-2021-林靜慧-我國大學校院碩士班學生休學原因探索]]
`,

'Barbara Lovitts.md': `---
title: "Barbara Lovitts"
aliases: [Lovitts, Barbara E. Lovitts]
type: entity
entity_type: person
affiliation: "American Educational Researcher"
role: "Graduate Education Researcher; Doctoral Attrition Scholar"
active_period: "1990s-2010s"
tags: [PhD-Dropout, Graduate-Education, Dissertation, USA]
last_updated: 2026-04-23
---

## Profile

Barbara Lovitts is an American educational researcher known for her landmark 2001 study *"Leaving the Ivory Tower: The Causes and Consequences of Departure from Doctoral Study."* She identified the **dissertation stage** as the critical attrition point in doctoral programs and examined the role of advisor relationships and departmental culture in student retention.

## Key Contributions

- Identified why students with strong academic records still drop out of doctoral programs
- Emphasized the role of **tacit knowledge** and **advisor relationship quality** in doctoral completion
- Provided a theoretical foundation for understanding graduate-level (vs. undergraduate-level) attrition

## References in Taiwan Literature

- Lin (2021b): Cited as foundational framework for graduate-level attrition analysis
`,

};

// Execute
let count = 0;
Object.entries(cards).forEach(([fn, content]) => {
    fs.writeFileSync(path.join(cardsDir, fn), content, 'utf8');
    count++; console.log('✓ [CARD]', fn);
});
Object.entries(concepts).forEach(([fn, content]) => {
    fs.writeFileSync(path.join(conceptsDir, fn), content, 'utf8');
    count++; console.log('✓ [CONCEPT]', fn);
});
Object.entries(entities).forEach(([fn, content]) => {
    fs.writeFileSync(path.join(entitiesDir, fn), content, 'utf8');
    count++; console.log('✓ [ENTITY]', fn);
});

console.log(`\nDone. Total: ${count} files written.`);
