# Implementation Plan: Systematic Literature Archive Ingestion (Batch processing 83+ items)

## Objective
Update all 83+ summaries in `wiki/sources` to the `Paper_Analysis_V5_Atomic.md` format, fill in missing details for "Skeleton" summaries, extract/increment concepts and entities, and ensure bidirectional linking across the entire wiki.

## Processing Workflow
For each paper (ID 01 to 90+ in `INGEST_TRACKER.md`):
1. **Source Matching**: Verifying the PDF in `raw/09-archive/` against the tracker metadata.
2. **Summary Standardization**: Converting existing summary to `V5_Atomic` format.
3. **Data Filling**: Using browser-based reading (local file) or web search to fill "Missing description" fields.
4. **Knowledge Extraction**:
   - Extract **Entities** (Researchers, Institutions).
   - Extract **Concepts** (Theories, Models, Phenomena).
5. **Bidirectional Linking**:
   - Update summary with prefixed links `[[wiki/entities/...]]` and `[[wiki/concepts/...]]`.
   - Update Entity/Concept files with a "Related Papers" link back to the summary.
6. **Card Verification**: Ensure all `wiki/cards/` links are valid.
7. **Housekeeping**: Update `wiki/index.md` and `wiki/log.md`.

## Batch Status Tracker

| Batch | Range | Status | Notes |
| :--- | :--- | :---: | :--- |
| **01** | ID 01-05 | 🏗️ IN PROGRESS | Gruenwald, Geisler, Di Martino, etc. |
| **02** | ID 06-10 | 🔘 PENDING | |
| **03** | ID 11-20 | 🔘 PENDING | |
| **04** | ID 21-30 | 🔘 PENDING | |
| **05** | ID 31-50 | 🔘 PENDING | |
| **06** | ID 51-70 | 🔘 PENDING | |
| **07** | ID 71-80 | 🔘 PENDING | |
| **08** | ID 81-90 | 🔘 PENDING | Bernardi, Mangarin, etc. |

## Detailed Batch 01 (01-05) Task List
- [ ] **ID 01**: 2008 Reducing Gap (Gruenwald et al.) -> Fill content, fix links.
- [ ] **ID 02**: 2008 Attitudes & Dropout (Geisler et al. 2023) -> Fill content, fix links.
- [ ] **ID 03**: 2016 Math Crisis (Di Martino et al.) -> Fill content, fix links.
- [ ] **ID 04**: 2017 Students Beliefs -> Identify paper, fill content.
- [ ] **ID 05**: 2024 Affective Variables -> Identify paper, fill content.

---
[[wiki/INGEST_TRACKER|Ingest Tracker]] | [[wiki/index|Global Index]]
