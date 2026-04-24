const fs = require('fs');
const path = require('path');

const conceptsDir = 'D:/llm-wiki-en/wiki/concepts';
const entitiesDir = 'D:/llm-wiki-en/wiki/entities';

// ============================================================
// BATCH 1 CONCEPTS — for Chen 2002, Lin 2005, Wang 2009
// ============================================================
const concepts = {

'Structural Discontinuity.md': `---
title: "Structural Discontinuity"
aliases: [Curriculum Structural Gap, Institutional Rupture]
type: concept
domain: [STT, Curriculum-Design, Sociology-of-Education]
tags: [Articulation-Gap, Curriculum, STT]
last_updated: 2026-04-23
---

## Definition

**Structural Discontinuity** refers to abrupt, institutionally-designed gaps between adjacent levels of an educational system that are not experienced as gradual transitions but as sudden **ruptures** in expected norms, content, or pedagogy. Unlike cognitive difficulty, structural discontinuity is produced by **system design**, not student deficit.

## Examples in STT Research

- **Chen (2002, Taiwan)**: The jump from "living math" (junior high) to formal deduction (senior high) — [[card-2002-chen-the-formal-deduction-barrier]]
- **Artigue (2012)**: The "institutional nomadism" experienced when students move between secondary and tertiary math cultures
- **Guzman (1998)**: The triple-gap (cognitive, sociocultural, curricular) at university entry

## Career Development Connection

Structural discontinuity at articulation points functions as an **invisible career filter**, redirecting students from pathways they might otherwise have pursued. Bridging interventions are therefore career equity tools.

## Key Sources

- [[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]]
- [[summary-2012-Michèle Artigue-Challenges in the transition from second]]
`,

'Prerequisite Void.md': `---
title: "Prerequisite Void"
aliases: [Curriculum Gap, 課程空缺, Content Discontinuity]
type: concept
domain: [Curriculum-Design, STT, Math-Education]
tags: [Curriculum, Prerequisite, Taiwan]
last_updated: 2026-04-23
---

## Definition

A **Prerequisite Void** occurs when a curriculum reform removes or significantly dilutes foundational content that subsequent educational levels assume students possess. The void is invisible to students (who don't know what they don't know) but creates acute performance collapse at transition points.

## Taiwan Context

Chen (2002) documented how Taiwan's 9-year integrated curriculum reform created prerequisite voids in polynomial operations, geometric proof, and algebraic manipulation, all of which are assumed prerequisites in Grade 10 (Senior High) mathematics.

## Key Sources

- [[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]] — [[card-2002-chen-living-math-paradox]]
`,

'Intermediary Education.md': `---
title: "Intermediary Education"
aliases: [中介教育, Alternative Schools, Transitional Schools]
type: concept
domain: [Dropout-Prevention, Policy, STT]
tags: [At-risk, Prevention, Taiwan, Policy]
last_updated: 2026-04-23
---

## Definition

**Intermediary Education** (中介教育) refers to institutionalized, low-stakes alternative educational environments designed to re-engage students who have dropped out or are at high risk of dropping out. These schools provide vocationally-oriented, experiential curricula that restore academic engagement through success experiences and belonging.

## Taiwan Context

Lin (2005) proposed intermediary education as the "placement" component of a three-stage dropout prevention chain in Taiwan, positioned between early warning (prevention) and sustained mentorship (re-dropout prevention).

## Career Development Connection

Intermediary schools function as **career identity recovery spaces** — they allow students to explore vocational interests in a structured but lower-stakes environment before re-entering the mainstream educational pathway.

## Key Sources

- [[summary-2005--樹-我國中輟生之問題與對策]] — [[card-2005-lin-intermediary-education-strategy]]
`,

'Rehabilitation Rate.md': `---
title: "Rehabilitation Rate"
aliases: [復學率, Return-to-School Rate, Reintegration Rate]
type: concept
domain: [Dropout-Prevention, Educational-Statistics, STT]
tags: [Taiwan, Policy, Measurement]
last_updated: 2026-04-23
---

## Definition

**Rehabilitation Rate** (復學率) is the proportion of students who were classified as dropouts but subsequently returned to the educational system within a defined period. A high rehabilitation rate indicates effective short-term recovery mechanisms, but **does not indicate long-term retention** — high recidivism (re-dropout) rates can coexist with high rehabilitation rates.

## Taiwan Data

- Lin (2005): Taiwan's K-12 rehabilitation rate was ~85.7% in the early 2000s, but recidivism remained a major policy concern
- MoE (2017): Despite high rehabilitation rates, persistent re-dropout revealed structural, not personal, barriers

## Key Sources

- [[summary-2005--樹-我國中輟生之問題與對策]]
- [[summary-2017-教育部統計處-105學年度中小學學生輟學概況統計]]
`,

'Learning Disabilities (LD).md': `---
title: "Learning Disabilities (LD)"
aliases: [LD, 學習障礙, Specific Learning Disorder]
type: concept
domain: [Special-Education, STT, Career-Development]
tags: [Disability, Taiwan, Neurodiversity, Support-Systems]
last_updated: 2026-04-23
---

## Definition

**Learning Disabilities (LD)** are neurologically-based processing disorders that affect one or more cognitive functions (reading, writing, mathematics, attention) in individuals of average or above-average intelligence. In the STT context, LD students face compounded transition challenges because institutional support systems typically contract at university entry.

## STT-Specific Challenges

1. **Support Withdrawal**: IEP/resource room support ends at K-12 graduation
2. **Disclosure Dilemma**: Students must choose whether to disclose their LD to professors without guaranteed accommodation
3. **Identity Disruption**: Students who succeeded in K-12 with support experience identity crises when support is removed at university

## Career Development Connection

Wang (2009) documented how LD students in Taiwan experienced **career foreclosure** — narrowing aspirations to roles that would not expose their disability — as a direct consequence of inadequate university support. Effective LD support is therefore career equity infrastructure.

## Key Sources

- [[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]
`,

'Career Decision Self-efficacy.md': `---
title: "Career Decision Self-efficacy (CDSE)"
aliases: [Career Decision-making Self-efficacy, 生涯決策自我效能]
type: concept
domain: [Career-Development, Counseling-Psychology, STT]
tags: [Bandura, Self-efficacy, Career, Counseling]
last_updated: 2026-04-23
---

## Definition

**Career Decision Self-efficacy (CDSE)** is the degree to which an individual believes they are capable of successfully completing tasks necessary for career decision-making. Developed from Bandura's self-efficacy theory, CDSE encompasses five domains: (1) Self-Appraisal, (2) Occupational Information, (3) Goal Selection, (4) Planning, (5) Problem Solving.

## STT Relevance

In the Secondary-to-Tertiary Transition, CDSE is often destabilized: students who had high confidence in their academic trajectory (secondary level) encounter new institutional norms, career demands, and self-comparison with peers, which can sharply reduce CDSE.

## Taiwan Context

Wang (2009) found that access to "institutional translator" advisors was the strongest predictor of restored CDSE for LD students at university entry — more powerful than academic accommodation alone.

## Key Sources

- [[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]
- [[wiki/concepts/Vocational Self-efficacy]]
`,

};

// ============================================================
// BATCH 1 ENTITIES — for Chen 2002, Lin 2005, Wang 2009
// ============================================================
const entities = {

'陳大魁.md': `---
title: "陳大魁 (Chen Da-Kuei)"
aliases: [Chen Da-Kuei, 陳大魁]
type: entity
entity_type: person
affiliation: "桃園高中 (Taoyuan Senior High School)"
role: "高中數學教師；教育部教材編審委員"
active_period: "1990s-2000s"
tags: [Taiwan, Math-Education, Curriculum-Reform]
last_updated: 2026-04-23
---

## Profile

陳大魁 is a Taiwanese high school mathematics teacher and curriculum textbook reviewer who contributed an early and prescient analysis of the articulation problem created by Taiwan's Nine-Year Integrated Curriculum reform. His 2002 article in 科學教育月刊 (Science Education Monthly) is one of the first Taiwanese academic works to systematically document the **cognitive and content rupture** at the Grade 9→10 transition.

## Key Contribution

- Identified the **Formal Deduction Barrier** at Taiwan's secondary-to-senior-high math transition
- Proposed "Bridging Courses" (銜接教材) as both pedagogical and social equity tools
- Framed teacher role transformation as a prerequisite for effective transitional pedagogy

## Primary Source

- [[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]]
`,

'林樹.md': `---
title: "林樹 (Lin, Shu)"
aliases: [Lin Shu, 林樹]
type: entity
entity_type: person
affiliation: "中華大學 (Chung Hua University)"
role: "教育研究者；輔導諮詢專家"
active_period: "2000s"
tags: [Taiwan, Dropout-Prevention, At-risk-Students]
last_updated: 2026-04-23
---

## Profile

林樹 is a Taiwanese education researcher affiliated with 中華大學, specializing in dropout prevention and at-risk student intervention strategies. His 2005 synthesis article in 教育暨外國語文學報 is a foundational reference for understanding Taiwan's K-12 dropout landscape during the post-reform era.

## Key Contribution

- Developed the **Quadrilateral Causality Model** of dropout (Individual → Family → School → Society)
- Proposed the **Three-Stage Prevention Chain** (Prevention → Intermediary → Re-dropout Prevention)
- Identified the **Labeling Trap** as the primary school-level driver of academic alienation

## Primary Source

- [[summary-2005--樹-我國中輟生之問題與對策]]
`,

'王春展.md': `---
title: "王春展 (Wang, Chun-Chan)"
aliases: [Wang Chun-Chan, 王春展]
type: entity
entity_type: person
affiliation: "台灣大學 (National Taiwan University)"
role: "特殊教育研究者；生涯發展諮詢專家"
active_period: "2000s-2010s"
tags: [Taiwan, Learning-Disabilities, Career-Development, STT]
last_updated: 2026-04-23
---

## Profile

王春展 is a Taiwanese researcher specializing in the intersection of learning disabilities and career development within the secondary-to-tertiary transition context. His 2009 retrospective study with university students who had LD is a critical text for understanding how institutional support gaps at university entry derail career development for neurodivergent students.

## Key Contribution

- Documented the **Institutional Silo Problem** in Taiwan's university disability support ecosystem
- Identified the **Career Advisor as Institutional Translator** as the most effective intervention modality
- Showed how **Career Foreclosure** results directly from inadequate STT support for LD students

## Primary Source

- [[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]
`,

};

// Write concepts
let count = 0;
Object.entries(concepts).forEach(([filename, content]) => {
    const filepath = path.join(conceptsDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
    console.log(`✓ [CONCEPT] ${filename}`);
});

// Write entities
Object.entries(entities).forEach(([filename, content]) => {
    const filepath = path.join(entitiesDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
    console.log(`✓ [ENTITY] ${filename}`);
});

console.log(`\nDone. Total files written: ${count}`);
