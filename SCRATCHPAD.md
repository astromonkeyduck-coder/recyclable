# SCRATCHPAD — APES Visual Exam Atlas Build Tracker

Last updated: May 8, 2026

---

## What Was Built

### Topic Cards (103 total)

All 103 topic cards are built and present in `data/enviro/atlas-data.json`. Every card contains all 10 sections (mustKnowConcept, diagramDescription, specificExamples, causes, effects, humanImpacts, solutions, graphConnection, frqUse, mcqTrap/commonMistake).

| Unit | Topics | Cards Built | Status |
|------|--------|-------------|--------|
| Unit 1 — The Living World: Ecosystems | 1.1–1.11 + 1.11b, 1.11c | 13 | ✅ Complete + transcript-enriched |
| Unit 2 — The Living World: Biodiversity | 2.1–2.8 | 8 | ✅ Complete (CED-based) |
| Unit 3 — Populations | 3.1–3.9 | 9 | ✅ Complete (CED-based) |
| Unit 4 — Earth Systems and Resources | 4.1–4.9 + 4.3b | 10 | ✅ Complete (CED-based) |
| Unit 5 — Land and Water Use | 5.1–5.17 | 17 | ✅ Complete (CED-based) |
| Unit 6 — Energy Resources and Consumption | 6.1–6.13 + 6.5b, 6.6b, 6.14 | 16 | ✅ Complete (CED-based) |
| Unit 7 — Atmospheric Pollution | 7.1–7.8 | 8 | ✅ Complete (CED-based) |
| Unit 8 — Aquatic and Terrestrial Pollution | 8.1–8.12 | 12 | ✅ Complete (CED-based) |
| Unit 9 — Global Change | 9.1–9.10 | 10 | ✅ Complete (CED-based) |
| **Total** | | **103** | **All built** |

### Navigation Modes (13 total)

All 13 modes are implemented and functional.

| # | Mode | Component | Status |
|---|------|-----------|--------|
| 1 | Everything Map | `everything-map.tsx` | ✅ Built |
| 2 | By AP Unit | `topic-card-grid.tsx` + `atlas-shell.tsx` | ✅ Built |
| 3 | Cycles | `visuals/cycle-reservoir.tsx` | ✅ Built |
| 4 | Biomes | `visuals/biome-explorer.tsx` | ✅ Built |
| 5 | Cause & Effect | `visuals/cause-effect-chain.tsx` | ✅ Built |
| 6 | Graphs & Data | `visuals/graph-simulator.tsx` | ✅ Built |
| 7 | Percent Change Lab | `tools/percent-change-lab.tsx` | ✅ Built |
| 8 | Pollution Pathways | `visuals/pollution-pathway.tsx` | ✅ Built |
| 9 | Energy & Math | `visuals/energy-matrix.tsx` | ✅ Built |
| 10 | Solutions & Tradeoffs | `visuals/solution-tradeoff.tsx` | ✅ Built |
| 11 | FRQ Visual Trainer | `tools/frq-trainer.tsx` | ✅ Built |
| 12 | Misconception Lab | `tools/misconception-lab.tsx` | ✅ Built |
| 13 | Night-Before Cram | `tools/night-cram.tsx` | ✅ Built |

### Visual Components (18 files total)

All visual and tool components are implemented.

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| AtlasShell | `atlas-shell.tsx` | Main orchestrator — mode routing, state management, data loading | ✅ Built |
| AtlasNav | `atlas-nav.tsx` | Left sidebar navigation with 13 mode buttons | ✅ Built |
| TopicCardGrid | `topic-card-grid.tsx` | Grid layout for topic cards in a unit view | ✅ Built |
| TopicCardDetail | `topic-card.tsx` | Full topic card component with all 10 sections | ✅ Built |
| EverythingMap | `everything-map.tsx` | Bird's-eye view of all 103 topic cards | ✅ Built |
| SearchFilterBar | `search-filter-bar.tsx` | Search input + unit filter dropdown | ✅ Built |
| SidePanel | `side-panel.tsx` | Slide-out detail panel for any topic card | ✅ Built |
| CycleView | `visuals/cycle-reservoir.tsx` | 4 biogeochemical cycle diagrams | ✅ Built |
| BiomeExplorer | `visuals/biome-explorer.tsx` | 9 terrestrial + 9 aquatic biome cards | ✅ Built |
| CauseEffectView | `visuals/cause-effect-chain.tsx` | 20 cause-effect chain flow diagrams | ✅ Built |
| GraphSimulatorView | `visuals/graph-simulator.tsx` | 8 interactive graph families | ✅ Built |
| PercentChangeLab | `tools/percent-change-lab.tsx` | Percent change calculator with presets | ✅ Built |
| PollutionPathwayView | `visuals/pollution-pathway.tsx` | 8 pollution source-to-impact pathways | ✅ Built |
| EnergyView | `visuals/energy-matrix.tsx` | 10 energy source comparison cards | ✅ Built |
| SolutionTradeoffView | `visuals/solution-tradeoff.tsx` | 12 solution-tradeoff analysis cards | ✅ Built |
| FRQTrainer | `tools/frq-trainer.tsx` | FRQ practice with model answers | ✅ Built |
| MisconceptionLab | `tools/misconception-lab.tsx` | 21 misconception flashcards | ✅ Built |
| NightCram | `tools/night-cram.tsx` | Top 50 high-yield concept cards | ✅ Built |

### UI Components (shadcn/ui)

| Component | File | Used By |
|-----------|------|---------|
| Accordion | `ui/accordion.tsx` | Side panel, topic card detail |
| Scroll Area | `ui/scroll-area.tsx` | Side panel, long content views |
| Select | `ui/select.tsx` | Unit filter dropdown |
| Toggle | `ui/toggle.tsx` | Various filter controls |

### Data Files

| File | Records | Status |
|------|---------|--------|
| `data/enviro/atlas-data.json` | 103 topic cards | ✅ Complete |
| `data/enviro/units-1-3.json` | Unit 1–3 enriched data | ✅ Complete (Unit 1 transcript-enriched) |
| `data/enviro/units-4-6.json` | Unit 4–6 enriched data | ✅ Complete (CED-based) |
| `data/enviro/units-7-9.json` | Unit 7–9 enriched data | ✅ Complete (CED-based) |
| `data/enviro/cause-effect-bank.json` | 20 cause-effect chains | ✅ Complete |
| `data/enviro/misconceptions.json` | 21 misconceptions | ✅ Complete |
| `data/enviro/solution-tradeoffs.json` | 12 solution-tradeoffs | ✅ Complete |

### Type System and Validation

| File | Schemas | Status |
|------|---------|--------|
| `src/lib/enviro/types.ts` | TopicCardSchema, CauseEffectChainSchema, MisconceptionSchema, SolutionTradeoffSchema, PercentChangePresetSchema, GraphConfigSchema, FRQPromptSchema | ✅ Complete |
| `src/lib/enviro/constants.ts` | UNITS (9), BIG_IDEAS (5), SCIENCE_PRACTICES (7), NAV_MODES (13), VISUAL_TYPES (10) | ✅ Complete |

### Page/Layout

| File | Purpose | Status |
|------|---------|--------|
| `src/app/enviro/page.tsx` | Route handler, renders AtlasShell | ✅ Built |
| `src/app/enviro/layout.tsx` | Metadata, hides site header/footer, full-screen layout | ✅ Built |

### Documentation

| File | Purpose | Status |
|------|---------|--------|
| `VISUAL_EXAM_ATLAS_GUIDE.md` | How to use the atlas (13 modes, 10-section topic cards, study strategies) | ✅ Complete |
| `DIAGRAM_CATALOG.md` | Every diagram cataloged by unit/topic (68 primary diagrams + 103 topic visuals) | ✅ Complete |
| `CED_VISUAL_COVERAGE_MATRIX.md` | Coverage table for all ~103 topics with all content dimensions | ✅ Complete |
| `VISUAL_ACCURACY_AUDIT.md` | Scientific accuracy checklist + 8 confusable pairs | ✅ Complete |
| `VISUAL_NIGHT_BEFORE_CRAM.md` | 50 highest-yield concepts with must-know sentence + AP trap | ✅ Complete |
| `TRANSCRIPT_TO_VISUALS_WORKFLOW.md` | 10-step workflow for processing new unit transcripts | ✅ Complete |
| `SCRATCHPAD.md` | This file — build tracker | ✅ Complete |

---

## What Is Pending

### Unit Transcript Enrichment (Units 2–9)

Unit 1 has been enriched with transcript data. Units 2–9 have complete CED-based topic cards but await transcript enrichment for deeper examples, quantitative data, and additional case studies.

| Unit | Transcript Status | Priority | Notes |
|------|-------------------|----------|-------|
| Unit 2 — Biodiversity | ❌ Awaiting transcript | Medium | Needs named species examples, island biogeography case studies |
| Unit 3 — Populations | ❌ Awaiting transcript | High | Needs real population data for graph simulators, demographic data by country |
| Unit 4 — Earth Systems | ❌ Awaiting transcript | Medium | Needs soil profile data, real climate data, ENSO event dates |
| Unit 5 — Land and Water Use | ❌ Awaiting transcript | High | Needs agricultural practice case studies, mining site examples, urbanization data |
| Unit 6 — Energy Resources | ❌ Awaiting transcript | High | Needs energy efficiency data, cost comparisons, capacity factor data |
| Unit 7 — Atmospheric Pollution | ❌ Awaiting transcript | Medium | Needs Clean Air Act timeline data, city-specific smog examples |
| Unit 8 — Aquatic/Terrestrial Pollution | ❌ Awaiting transcript | Medium | Needs dead zone locations, biomagnification concentration data, LD50 values |
| Unit 9 — Global Change | ❌ Awaiting transcript | High | Needs climate projection data, species recovery timelines, policy timeline data |

### Enrichment Workflow Per Unit (when transcript arrives)

For each unit transcript, follow the process in `TRANSCRIPT_TO_VISUALS_WORKFLOW.md`:

1. Extract specific examples (Tier 1 quality: named + numbered + dated)
2. Extract new cause-effect chains or chain enrichments
3. Extract misconceptions
4. Extract graph data points and percent change presets
5. Update topic cards in atlas-data.json and unit JSON files
6. Update source status from "CED-based" to "CED + transcript-enriched"
7. Cross-reference for consistency
8. Build and test

---

## What Needs Future Work

### Data Enrichments
- [ ] **Graph simulator real data:** Most graph connections have trend descriptions but not all have actual interactive data points. Add real data for population growth (by country), dissolved oxygen curves (by river), dose-response curves (specific chemicals), species-area data (specific island chains)
- [ ] **Percent change presets:** Add more real-world presets from each unit (deforestation rates, emission changes, population growth rates by country, renewable energy growth rates)
- [ ] **FRQ prompt bank expansion:** Currently FRQ prompts are embedded in topic cards. Consider extracting to a dedicated `data/enviro/frq-prompts.json` with strong/weak answer pairs per topic
- [ ] **Additional misconceptions:** Current bank has 21. Target: 40+ (2–4 per unit). Units 4, 5, and 6 are underrepresented

### Visual Enhancements
- [ ] **Interactive cycle diagrams:** Current cycle view is component-based. Future: drag-and-drop labeling, click-to-trace-a-pathway, animation of fluxes
- [ ] **Biome climatograph generator:** Allow students to input temperature/precipitation data and identify the biome
- [ ] **Graph annotation tool:** Let students draw trend lines and annotations on graphs, then compare to the correct interpretation
- [ ] **Cause-effect chain builder:** Blank chain template where students fill in steps, then reveal the correct chain
- [ ] **Spaced repetition:** Track which cards a student has reviewed and schedule reviews using SM-2 or similar algorithm
- [ ] **Progress tracking:** Mark topics as "confident," "needs review," or "not studied" with persistence

### Testing
- [ ] **Unit tests:** Validate all JSON data files against Zod schemas in Vitest
- [ ] **E2E tests:** Playwright tests for each navigation mode, search, filter, and side panel
- [ ] **Accessibility audit:** Screen reader compatibility for all diagrams and interactive elements
- [ ] **Mobile responsiveness:** Atlas is desktop-first; verify and optimize for tablet and phone

### Content Expansion
- [ ] **Released exam alignment:** Map topic cards to specific released AP exam questions (2019, 2022, 2023) to verify coverage
- [ ] **AP scoring rubric alignment:** For each FRQ model sentence, verify it would earn full credit against published AP scoring guidelines
- [ ] **Lab-based topics:** Some topics (soil testing, water quality analysis, population sampling) have lab components not yet covered
- [ ] **Math practice expansion:** More percent change, per capita rate, and energy calculation problems with worked solutions

---

## Build Statistics

| Metric | Count |
|--------|-------|
| Total topic cards | 103 |
| Navigation modes | 13 |
| React components (enviro) | 18 |
| UI components (shadcn) | 4 |
| Cause-effect chains | 20 |
| Misconceptions | 21 |
| Solution-tradeoff analyses | 12 |
| Terrestrial biome cards | 9 |
| Aquatic biome cards | 9 |
| Graph families | 8 |
| Pollution pathways | 8 |
| Energy source comparisons | 10 |
| Total cataloged diagrams | 68 |
| Total visual elements (including topic card visuals) | 171 |
| Zod schemas | 7 |
| Data files | 7 |
| Documentation files | 7 |
| Units with transcript enrichment | 1/9 (Unit 1) |
| Overall confidence level | High (all CED-aligned) |

---

## Timeline

| Date | Milestone |
|------|-----------|
| — | Initial atlas-data.json created with 103 CED-based topic cards |
| — | All 13 navigation modes implemented |
| — | All visual components (cycles, biomes, graphs, pollution, energy, cause-effect) built |
| — | All tool components (FRQ trainer, misconception lab, percent change lab, night cram) built |
| — | Cause-effect bank (20 chains), misconceptions (21), solution-tradeoffs (12) created |
| — | Unit 1 enriched with transcript data |
| May 8, 2026 | Documentation suite created (7 markdown files) |
| Pending | Units 2–9 transcript enrichment |
| Pending | Graph simulator real data expansion |
| Pending | FRQ prompt bank extraction |
| Pending | Additional misconceptions (target: 40+) |
| Pending | Interactive diagram enhancements |
| Pending | Testing (unit, e2e, accessibility) |
