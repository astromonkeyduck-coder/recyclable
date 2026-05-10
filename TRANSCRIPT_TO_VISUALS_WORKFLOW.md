# Transcript-to-Visuals Workflow

Step-by-step workflow for enriching the APES Visual Exam Atlas when a new unit transcript is provided. This ensures consistent quality and complete coverage across all units.

---

## Overview

The atlas contains 103 topic cards built from the CED (Course and Exam Description). When a unit transcript (from a lecture, textbook chapter, or video) is provided, we enrich the existing topic cards with:

1. **More specific examples** (named organisms, locations, numbers, dates)
2. **Deeper cause-effect chains** (intermediate mechanisms students miss)
3. **Additional FRQ model sentences** (using AP task verbs correctly)
4. **New misconceptions** (from how the concept is commonly mis-taught)
5. **Graph data points** (real data for graph simulators)
6. **Percent change presets** (real data for the percent change calculator)

---

## Workflow Steps

### Step 1: Receive and Assess the Transcript

**Input:** Raw transcript text (lecture, video, or textbook chapter)

**Actions:**
1. Identify which AP unit the transcript covers
2. List every CED topic number mentioned or covered in the transcript
3. Note any topics that are NOT covered (gaps to flag)
4. Identify the transcript's format: lecture notes, video transcript, textbook excerpt, or student-generated notes

**Output:** A topic coverage checklist

```
Unit: [X]
Topics covered: [list]
Topics NOT covered: [list]
Format: [lecture/video/textbook/notes]
Estimated enrichment value: [high/medium/low]
```

### Step 2: Extract Specific Examples

**For each topic mentioned in the transcript, extract:**

1. **Named examples** — specific organisms, locations, chemicals, laws, treaties
   - GOOD: "DDT biomagnified in bald eagles at Lake Michigan, thinning eggshells by 20%"
   - BAD: "Chemicals can build up in food chains"
   
2. **Quantitative data** — numbers, dates, percentages, concentrations
   - GOOD: "Atmospheric CO₂ was 280 ppm pre-industrial, is now 420 ppm"
   - BAD: "CO₂ levels have increased"

3. **Real-world case studies** — named events with consequences
   - GOOD: "The 1992 collapse of the Atlantic cod fishery in Newfoundland eliminated 35,000 fishing jobs"
   - BAD: "Overfishing can collapse fisheries"

**Quality filter:** Each example must be:
- [ ] Scientifically accurate
- [ ] Specific enough to earn FRQ credit (named, numbered, dated)
- [ ] Relevant to the CED learning objective
- [ ] Not a duplicate of an existing example in the topic card

### Step 3: Extract Cause-Effect Relationships

**For each causal relationship in the transcript:**

1. Identify the full chain: cause → mechanism → effect → consequence
2. Check if the chain is already in `data/enviro/cause-effect-bank.json`
3. If new, format it as a chain entry:

```json
{
  "id": "ce_[descriptive_id]",
  "unit": "Unit [X]",
  "topicNumber": "[X.X]",
  "title": "[Cause] → [Effect] → [Consequence]",
  "steps": [
    {"label": "[step description]", "type": "cause"},
    {"label": "[step description]", "type": "mechanism"},
    {"label": "[step description]", "type": "effect"},
    {"label": "[step description]", "type": "consequence"},
    {"label": "[step description]", "type": "solution"},
    {"label": "[step description]", "type": "tradeoff"}
  ]
}
```

4. If the chain exists, check if the transcript provides additional steps or more specific mechanism descriptions
5. Every chain MUST end with a solution AND a tradeoff (AP FRQs always ask for both)

### Step 4: Extract Misconceptions

**For each misconception implied or explicitly addressed in the transcript:**

1. Identify the wrong statement students commonly believe
2. Determine why it's tempting (the "trap")
3. Write the correct statement
4. Write an AP-safe sentence that would earn full FRQ credit

**Format:**
```json
{
  "id": "mis_[descriptive_id]",
  "unit": "Unit [X]",
  "topicNumber": "[X.X]",
  "wrongStatement": "[What students wrongly believe]",
  "whyTempting": "[Why it seems correct]",
  "correctStatement": "[The truth, with emphasis on the key distinction]",
  "apSafeSentence": "[A sentence that would earn full credit on an FRQ]"
}
```

**Quality filter:**
- [ ] The misconception appears on released AP exams or is documented in AP scoring rubrics
- [ ] The wrong statement is something a reasonable student would believe (not a strawman)
- [ ] The correct statement includes a specific, testable distinction
- [ ] Not a duplicate of an existing misconception in `data/enviro/misconceptions.json`

### Step 5: Extract Graph Data and Percent Change Presets

**For graphs:**
1. Identify any quantitative data that could populate a graph simulator
2. Format as data points: `[{x: value, y: value}, ...]`
3. Specify axis labels, units, and trend description
4. Write the AP-safe interpretation and the common wrong interpretation

**For percent change:**
1. Identify any "before and after" data pairs
2. Format as a percent change preset:

```json
{
  "id": "[descriptive_id]",
  "label": "[Human-readable label]",
  "initialValue": [number],
  "finalValue": [number],
  "timePeriod": [years, optional],
  "units": "[unit of measurement]",
  "variable": "[what is being measured]"
}
```

### Step 6: Enrich Existing Topic Cards

**For each topic card that has new information from the transcript:**

1. Open the relevant data file:
   - Unit 1–3: `data/enviro/units-1-3.json`
   - Unit 4–6: `data/enviro/units-4-6.json`
   - Unit 7–9: `data/enviro/units-7-9.json`

2. Also check/update the main atlas file: `data/enviro/atlas-data.json`

3. For each enrichment, update the appropriate field:

| Extraction Type | Target Field(s) |
|----------------|----------------|
| Specific examples | `specificExamples` array |
| Cause-effect steps | `causes` and `effects` arrays (short form); `cause-effect-bank.json` (full chain) |
| Human impacts | `humanImpacts` array |
| Solutions | `solutions` array |
| Graph data | `graphConnection` object + graph simulator data |
| FRQ sentences | `frqUse` and `modelSentence` fields |
| MCQ traps | `mcqTrap` field |
| Misconceptions | `commonMistake` field + `misconceptions.json` |

4. Update the `sourceStatus` field:
   - `"CED-based"` → `"CED + transcript-enriched"` (after enrichment)

5. Validate the updated JSON against the Zod schema:
   - `TopicCardSchema` in `src/lib/enviro/types.ts`
   - Run `npm run build` to catch type errors

### Step 7: Update Solution-Tradeoff Entries

**If the transcript mentions a solution not yet in `data/enviro/solution-tradeoffs.json`:**

```json
{
  "id": "sol_[descriptive_id]",
  "unit": "Unit [X]",
  "topicNumber": "[X.X]",
  "solution": "[Solution name]",
  "mechanism": "[How it works]",
  "advantage": "[Primary benefit]",
  "disadvantage": "[Primary cost or limitation]",
  "unintendedConsequence": "[Side effect that wasn't intended]",
  "stakeholderTradeoff": "[Who benefits, who pays]",
  "frqSentence": "[AP-safe sentence for FRQ response]"
}
```

### Step 8: Cross-Reference and Verify

After all enrichments are made:

1. **Consistency check:** Verify no contradictions between the enriched card and:
   - Other topic cards in the same unit
   - Related topic cards in other units
   - Cause-effect chains
   - Misconception entries
   - Solution-tradeoff entries
   
2. **Accuracy check:** Verify against the VISUAL_ACCURACY_AUDIT.md checklist:
   - All 8 confusable pairs still correctly distinguished
   - No new misconception introduced by the enrichment
   - Quantitative data is accurate and sourced

3. **Completeness check:** For each enriched topic, verify:
   - [ ] At least 4 specific examples (with names, numbers, dates)
   - [ ] At least 3 causes and 3 effects
   - [ ] At least 3 human impacts
   - [ ] At least 3 solutions
   - [ ] Graph connection (if applicable)
   - [ ] FRQ model sentence
   - [ ] MCQ trap
   - [ ] Common mistake

### Step 9: Update Tracking Documents

After enrichment is complete:

1. **SCRATCHPAD.md** — Update the "completed" section with:
   - Date of enrichment
   - Unit/topics enriched
   - Number of examples added
   - Number of new misconceptions, cause-effect chains, or solutions added

2. **CED_VISUAL_COVERAGE_MATRIX.md** — Update any changed fields:
   - Source status column
   - Confidence column
   - Any newly added graph connections or misconception entries

3. **DIAGRAM_CATALOG.md** — Add any new diagrams or visual types

### Step 10: Build and Test

```bash
npm run build         # Verify no TypeScript/Zod errors
npm run dev           # Verify atlas renders correctly
```

Manually verify in the browser:
- [ ] Enriched topic cards display correctly in all 13 modes
- [ ] New cause-effect chains render in the Cause & Effect view
- [ ] New misconceptions appear in the Misconception Lab
- [ ] New solution-tradeoffs appear in the Solutions & Tradeoffs view
- [ ] Search finds newly added examples
- [ ] No broken layouts or missing data

---

## Quality Standards

### Example Quality Tiers

| Tier | Description | Example |
|------|-------------|---------|
| **Tier 1: AP-Ready** | Named organism/location + quantitative data + date + consequence | "The bald eagle recovered from 417 nesting pairs in 1963 to 316,700+ individuals by 2021 following ESA listing and the DDT ban" |
| **Tier 2: Specific** | Named organism/location + qualitative impact | "Zebra mussels in the Great Lakes filter phytoplankton, collapsing native mussel populations" |
| **Tier 3: Generic** | Category-level description without names or numbers | "Invasive species can outcompete native species" |

**Target:** All examples should be Tier 1 or Tier 2. Tier 3 is acceptable only as a fallback for rare topics with limited real-world data.

### FRQ Model Sentence Quality

A model sentence must:
- [ ] Use one AP task verb (identify, describe, explain, evaluate, justify, propose)
- [ ] Include a specific mechanism (not just "it causes pollution")
- [ ] Connect cause to effect through a stated mechanism
- [ ] Include a named example when possible
- [ ] Be one complete sentence (not a paragraph)

### Misconception Quality

A misconception entry must:
- [ ] State something a reasonable student would actually believe
- [ ] Explain why it's tempting (the logical path to the wrong answer)
- [ ] Provide the correct statement with emphasis on the key distinction
- [ ] Include an AP-safe sentence that addresses the misconception directly

---

## File Reference

| File | Purpose | Schema |
|------|---------|--------|
| `data/enviro/atlas-data.json` | 103 topic cards (main atlas data) | `TopicCardSchema` |
| `data/enviro/units-1-3.json` | Enriched Unit 1–3 data | `TopicCardSchema` |
| `data/enviro/units-4-6.json` | Enriched Unit 4–6 data | `TopicCardSchema` |
| `data/enviro/units-7-9.json` | Enriched Unit 7–9 data | `TopicCardSchema` |
| `data/enviro/cause-effect-bank.json` | 20 cause-effect chains | `CauseEffectChainSchema` |
| `data/enviro/misconceptions.json` | 21 misconceptions | `MisconceptionSchema` |
| `data/enviro/solution-tradeoffs.json` | 12 solution-tradeoff analyses | `SolutionTradeoffSchema` |
| `src/lib/enviro/types.ts` | Zod schemas for all data types | — |
| `src/lib/enviro/constants.ts` | Units, nav modes, visual types | — |

---

## Enrichment Status by Unit

| Unit | CED Cards | Transcript Enriched? | Status |
|------|-----------|---------------------|--------|
| 1 | 13 (1.1–1.11c) | ✅ Yes (Unit 1 transcript processed) | Complete |
| 2 | 8 (2.1–2.8) | ❌ Awaiting transcript | Pending |
| 3 | 9 (3.1–3.9) | ❌ Awaiting transcript | Pending |
| 4 | 10 (4.1–4.9b) | ❌ Awaiting transcript | Pending |
| 5 | 17 (5.1–5.17) | ❌ Awaiting transcript | Pending |
| 6 | 16 (6.1–6.14) | ❌ Awaiting transcript | Pending |
| 7 | 8 (7.1–7.8) | ❌ Awaiting transcript | Pending |
| 8 | 12 (8.1–8.12) | ❌ Awaiting transcript | Pending |
| 9 | 10 (9.1–9.10) | ❌ Awaiting transcript | Pending |
