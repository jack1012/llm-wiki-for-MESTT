const fs = require('fs');
const path = require('path');
const cardsDir = 'D:/llm-wiki-en/wiki/cards';

// ========================================================
// BATCH 1: Fill seed cards for early Chinese literature
// Cards for: 陳大魁 2002, 林樹 2005, 王春展 2009, 吳清鎮 2021 (UCAN)
// ========================================================

const cardContents = {

// ===== 陳大魁 2002 =====
'card-2002-chen-the-formal-deduction-barrier.md': `---
title: "The Formal Deduction Barrier"
aliases: [Chen 2002 Logic Gap, Taiwan Cognitive Jump]
type: card
source: "[[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]]"
author: "陳大魁"
year: 2002
tags: [STT, Cognitive-Rupture, Formal-Deduction, Taiwan, Math-Articulation]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Taiwan's 9-year integrated curriculum trained students in **intuitive/visual mathematical exploration**, but the senior high school curriculum suddenly demanded **formal symbolic deduction and axiomatic proof**. This cognitive shift constitutes a **structural barrier** rather than a natural pedagogical progression.

## Key Evidence (from Chen, 2002)

- Junior high "living math" (生活化數學) reform reduced formal proof requirements, prioritizing exploration over rigor
- Senior high teachers reported a sharp decline in students' capacity to follow **deductive logical chains**
- Most acute ruptures: polynomial operations, geometric proof, algebraic manipulation with symbolic notation

## Career Development Lens

This cognitive barrier acts as an **invisible career filter**: students blocked by it are structurally redirected away from STEM pathways — not by lack of ability, but by a **curriculum design discontinuity**. The barrier thus produces **premature vocational sorting** at Grade 10, years before students consciously choose careers.

## Relations

- Concept: [[wiki/concepts/Structural Discontinuity]]
- Concept: [[wiki/concepts/Formal Deduction]]
- Entity: [[陳大魁]]
- Related Card: [[card-2002-chen-living-math-paradox]]
- Related Card: [[card-2002-chen-bridging-as-social-equity]]
`,

'card-2002-chen-living-math-paradox.md': `---
title: "The Living Math Paradox"
aliases: [Chen 2002 Curriculum Irony, 生活化數學悖論]
type: card
source: "[[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]]"
author: "陳大魁"
year: 2002
tags: [STT, Curriculum-Design, Living-Math, Taiwan, Reform-Paradox]
status: mature
last_updated: 2026-04-23
---

## Core Insight

The **"Living Math" curriculum reform** (生活化數學), designed to reduce student anxiety by grounding math in everyday contexts, produced a paradox: by stripping away formal structure, it **unprepared students for the very abstract rigor** they would encounter at the next level, amplifying—rather than reducing—math anxiety at the Senior High transition.

## Key Evidence (from Chen, 2002)

- The reform succeeded in making math feel more approachable at junior high level
- However, it created a **prerequisite void**: students arrived at Grade 10 without polynomial fluency, proof reasoning, or symbolic manipulation skills
- The paradox is that well-intentioned reform produced a more severe transition rupture than the old rote-learning system it replaced

## Career Development Lens

The paradox illustrates how **educational policy optimism can misalign with long-term career readiness**. Students who benefited emotionally from "living math" were denied access to the **cognitive toolkit** required for high-STEM careers, creating a false sense of math competence that collapsed at the articulation point.

## Relations

- Concept: [[wiki/concepts/Curriculum Discontinuity]]
- Concept: [[wiki/concepts/Prerequisite Void]]
- Entity: [[陳大魁]]
- Related Card: [[card-2002-chen-the-formal-deduction-barrier]]
- Related Card: [[card-2002-chen-bridging-as-social-equity]]
`,

'card-2002-chen-bridging-as-social-equity.md': `---
title: "Bridging as Social Equity"
aliases: [Chen 2002 Equity Bridge, 銜接教材作為職涯平權工具]
type: card
source: "[[summary-2002-陳大魁-談從9年一貫到12年一貫數學銜接的幾個面向]]"
author: "陳大魁"
year: 2002
tags: [STT, Equity, Bridging-Courses, Taiwan, Social-Justice]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Chen (2002) argues that **bridging courses** (銜接教材) are not merely remedial tools — they are instruments of **educational equity**. Without them, the articulation gap functions as a **social filter** that systematically advantages students from high-SES families who can access private tutoring (shadow education) to compensate for curriculum voids.

## Key Evidence (from Chen, 2002)

- Students from lower-SES backgrounds cannot self-repair curriculum gaps through private tutoring
- The curriculum discontinuity thus **amplifies pre-existing socioeconomic inequality** at the Grade 10 entry point
- Bridging courses, if implemented, would provide institutional compensation for the disadvantage created by the reform itself

## Career Development Lens

Bridging courses reframed as **career equity tools**: they ensure that access to STEM pathways is not determined by family economic capital but by institutional support. This anticipates the modern First-Year Experience (FYE) movement's emphasis on structured transitional support.

## Relations

- Concept: [[wiki/concepts/Shadow Education]]
- Concept: [[wiki/concepts/Educational Equity]]
- Concept: [[wiki/concepts/Bridging Courses]]
- Entity: [[陳大魁]]
- Related Card: [[card-2002-chen-the-formal-deduction-barrier]]
`,

// ===== 林樹 2005 =====
'card-2005-lin-the-labeling-trap.md': `---
title: "The Labeling Trap"
aliases: [Lin 2005 Labeling Effect, 標籤效應陷阱]
type: card
source: "[[summary-2005--樹-我國中輟生之問題與對策]]"
author: "林樹"
year: 2005
tags: [STT, Dropout, Labeling-Effect, Taiwan, Academic-Alienation]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Taiwan's school systems, through an over-emphasis on academic grades (智育), systematically **label low-performing students as "failures"**. This label becomes self-fulfilling: labeled students disengage from school-based identity and seek alternative belonging—often through peer groups associated with delinquency. The dropout is thus a **response to institutional labeling**, not simply a personal failure.

## Key Evidence (from Lin, 2005)

- Over 60% of surveyed dropouts reported experiencing **social rejection from teachers or peers** before leaving
- The transition to junior high (Grade 7-9) was the highest-risk period, with dropout rates 4-5x higher than primary school
- Labeled students reported **seeking gang affiliation** as a substitute for the school-based social identity they were denied

## Career Development Lens

The Labeling Trap destroys **vocational self-efficacy** before students can develop it. A student labeled "academically incapable" at 13 is denied not just academic achievement, but the developmental space to discover and construct career identity. The trap thus operates as a **premature career foreclosure mechanism**.

## Relations

- Concept: [[wiki/concepts/Labeling Effect]]
- Concept: [[wiki/concepts/Academic Alienation]]
- Concept: [[wiki/concepts/Vocational Self-efficacy]]
- Entity: [[林樹]]
- Related Card: [[card-2005-lin-multi-level-attrition-model]]
`,

'card-2005-lin-multi-level-attrition-model.md': `---
title: "The Multi-Level Attrition Model"
aliases: [Lin 2005 Quadrilateral Causality, 四層次中輟成因模型]
type: card
source: "[[summary-2005--樹-我國中輟生之問題與對策]]"
author: "林樹"
year: 2005
tags: [STT, Dropout, Multi-Level-Analysis, Taiwan, Systemic-Factors]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Lin (2005) proposes a **Quadrilateral Causality Model** of student dropout in Taiwan, operating simultaneously at four nested levels: Individual → Family → School → Society. Interventions that target only one level will always fail because attrition is driven by multi-level resonance.

## Key Evidence (from Lin, 2005)

| Level | Key Factor |
|-------|-----------|
| **Individual** | Low self-efficacy, digital addiction, learning disabilities |
| **Family** | Single-parent households, skip-generation families, shadow-education pressure |
| **School** | Labeling effect, curriculum-interest mismatch, rigid evaluation norms |
| **Society** | Peer gang pressure, economic inequality, normalization of early work |

- The model predicts that students facing **three or more simultaneous factors** have a 90%+ probability of permanent dropout

## Career Development Lens

Each level in the model represents a different **career development barrier**: the individual level maps to career self-efficacy; the family level to social capital; the school level to opportunity access; the society level to structural labor market conditions. Effective career counseling must address all four levels simultaneously.

## Relations

- Concept: [[wiki/concepts/Multi-Level Analysis (Education)]]
- Concept: [[wiki/concepts/Family Social Capital]]
- Concept: [[wiki/concepts/Labeling Effect]]
- Entity: [[林樹]]
- Related Card: [[card-2005-lin-the-labeling-trap]]
- Related Card: [[card-2005-lin-intermediary-education-strategy]]
`,

'card-2005-lin-intermediary-education-strategy.md': `---
title: "The Intermediary Education Strategy"
aliases: [Lin 2005 Three-Stage Prevention, 三級預防中介教育]
type: card
source: "[[summary-2005--樹-我國中輟生之問題與對策]]"
author: "林樹"
year: 2005
tags: [STT, Dropout-Prevention, Intermediary-Education, Taiwan, Policy]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Lin (2005) proposes a **Three-Stage Prevention Chain** for student dropout: (1) **Prevention** — early warning systems to identify at-risk students; (2) **Placement** — transitional "intermediary schools" (中介學校) that provide alternative educational environments; (3) **Re-dropout Prevention** — tracking and sustained mentorship to prevent return to dropout after rehabilitation.

## Key Evidence (from Lin, 2005)

- Taiwan's rehabilitation rate (復學率) was ~85% in 2001, but recidivism was high (students who returned still dropped out again)
- Intermediary education works by providing **low-stakes, vocationally-oriented curricula** that restore a sense of competence and belonging
- The tracking function (認輔制度) was identified as the weakest link in the existing system

## Career Development Lens

The three-stage model anticipates modern **career transition support frameworks**: prevention = early career counseling; placement = vocational identity exploration in safe environments; re-dropout prevention = career maintenance and resilience building. The model implicitly treats dropout prevention as **career trajectory protection**.

## Relations

- Concept: [[wiki/concepts/Intermediary Education]]
- Concept: [[wiki/concepts/Rehabilitation Rate]]
- Concept: [[wiki/concepts/Early Identification]]
- Entity: [[林樹]]
- Related Card: [[card-2005-lin-the-labeling-trap]]
- Related Card: [[card-2005-lin-multi-level-attrition-model]]
`,

// ===== 王春展 2009 =====
'card-2009-hong-the-rigor-shock.md': `---
title: "The Rigor Shock in LD Students"
aliases: [Wang 2009 LD Transition Shock, 學習障礙生升大學適應衝擊]
type: card
source: "[[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]"
author: "王春展"
year: 2009
tags: [STT, Learning-Disabilities, Rigor-Shock, Taiwan, Career-Adaptation]
status: mature
last_updated: 2026-04-23
---

## Core Insight

University-level academic rigor creates a **compounded transition shock** for students with Learning Disabilities (LD): not only must they adapt to new institutional norms, but the removal of K-12 support structures (resource rooms, individualized education) leaves them without the scaffolding they relied on. The "rigor shock" is thus doubly experienced—academically and institutionally.

## Key Evidence (from Wang, 2009)

- LD students reported that university professors had **no systematic awareness** of their accommodation needs
- The transition removed IEP (Individualized Education Program) support that had partially compensated for their disabilities in K-12
- Many LD students described the freshman year as a period of **identity destabilization**: "I thought I had overcome my disability, then it came back"

## Career Development Lens

The rigor shock reveals how **accommodated success in K-12 can create false confidence** about career readiness. The abrupt removal of support at university entry is equivalent to removing a prosthetic mid-performance, exposing a **structural gap in the transitional ecosystem**.

## Relations

- Concept: [[wiki/concepts/Learning Disabilities (LD)]]
- Concept: [[wiki/concepts/Institutional Support Gap]]
- Entity: [[王春展]]
- Related Card: [[card-2009-hong-career-advisors-as-translators]]
- Related Card: [[card-2009-hong-professional-silos]]
`,

'card-2009-hong-career-advisors-as-translators.md': `---
title: "Career Advisors as Institutional Translators"
aliases: [Wang 2009 Advisor Role, 生涯輔導者作為制度翻譯者]
type: card
source: "[[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]"
author: "王春展"
year: 2009
tags: [STT, Career-Counseling, Learning-Disabilities, Taiwan, Mediation]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Wang (2009) found that the most effective support for LD students in career development was not therapeutic counseling but **institutional translation**: advisors who could explain what university systems expected of students, help them map their disability characteristics onto vocational strength profiles, and advocate within institutional structures on their behalf.

## Key Evidence (from Wang, 2009)

- Students who had access to "translating" advisors (輔導者) reported significantly higher career decision self-efficacy
- The translation function included: decoding professor expectations, reframing disability as a **difference not a deficit**, and connecting students to employer networks that valued neurodiversity
- Students without such translators reported **career foreclosure**: narrowing their aspirations to roles they believed would not expose their disability

## Career Development Lens

The "translator" role anticipates contemporary disability-inclusive career frameworks. The finding suggests career advisors in STT contexts must be trained not as therapists but as **systemic navigators** who understand both the student's profile and the institutional landscape.

## Relations

- Concept: [[wiki/concepts/Career Decision Self-efficacy]]
- Concept: [[wiki/concepts/Institutional Navigation]]
- Entity: [[王春展]]
- Related Card: [[card-2009-hong-the-rigor-shock]]
- Related Card: [[card-2009-hong-professional-silos]]
`,

'card-2009-hong-professional-silos.md': `---
title: "Professional Silos in LD Support"
aliases: [Wang 2009 Silo Problem, 學習障礙支援的專業穀倉問題]
type: card
source: "[[summary-2009-王春展-大學生回溯其學習障礙與適應大學及生涯發展之影響]]"
author: "王春展"
year: 2009
tags: [STT, Institutional-Fragmentation, Learning-Disabilities, Taiwan, Systems]
status: mature
last_updated: 2026-04-23
---

## Core Insight

Wang (2009) diagnosed a critical **"professional silo" problem** in Taiwan's university support systems: the Special Education office, the Career Development center, and the Academic Affairs office each operated independently with no shared case management or data exchange, leaving LD students to coordinate their own multi-agency support — a task they were structurally least equipped to perform.

## Key Evidence (from Wang, 2009)

- Three departments (disability services, career counseling, academic affairs) had **no formal communication protocol** in studied universities
- LD students spent significant time repeating their history to each office separately
- The coordination burden fell on already-stressed students, compounding their cognitive and administrative load

## Career Development Lens

The silo problem illustrates a broader principle in STT research: **institutional fragmentation creates invisible career barriers**. Students cannot construct coherent career identities when the institutions designed to support them are themselves disconnected. Cross-departmental integration is a prerequisite for effective career transition support.

## Relations

- Concept: [[wiki/concepts/Data Silo]]
- Concept: [[wiki/concepts/Institutional Coordination]]
- Entity: [[王春展]]
- Related Card: [[card-2009-hong-the-rigor-shock]]
- Related Card: [[card-2009-hong-career-advisors-as-translators]]
`,

};

// Write all cards
let count = 0;
Object.entries(cardContents).forEach(([filename, content]) => {
    const filepath = path.join(cardsDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
    console.log(`✓ Written: ${filename}`);
});

console.log(`\nDone. Total cards written: ${count}`);
