import { tokenize, trigramSimilarity } from "@/lib/matching/tokenizer";
import { loadConcepts } from "./loader";
import type {
  Concept,
  ClassificationResult,
  EngineCategory,
  FollowupQuestion,
} from "./types";

const MIN_SCORE_THRESHOLD = 0.15;
const CONFIDENCE_FOLLOWUP_THRESHOLD = 0.6;
const CANDIDATE_LIMIT = 100;
const TOP_MATCHES_LIMIT = 10;

type ScoredConcept = {
  concept: Concept;
  score: number;
  matchType: ClassificationResult["topMatches"][0]["matchType"];
};

function normalizeQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Strip common packaging/product phrases to get the core item. */
function stripPackagingHint(text: string): string {
  let t = text;
  const patterns = [
    /^(?:a\s+)?(?:plastic\s+)?bag\s+of\s+/i,
    /^(?:a\s+)?piece\s+of\s+/i,
    /^(?:a\s+)?bit\s+of\s+/i,
    /^(?:some\s+)/i,
  ];
  for (const p of patterns) {
    t = t.replace(p, "").trim();
  }
  return t || text;
}

function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function scoreConcept(concept: Concept, query: string): ScoredConcept {
  const normalizedQuery = normalizeForComparison(query);
  const queryTokens = tokenize(query);

  // 1. Exact name match
  if (normalizeForComparison(concept.name) === normalizedQuery) {
    return { concept, score: 1.0, matchType: "exact-name" };
  }

  // 2. Exact alias match
  for (const alias of concept.aliases) {
    if (normalizeForComparison(alias) === normalizedQuery) {
      return { concept, score: 0.95, matchType: "exact-alias" };
    }
  }

  let bestScore = 0;
  let bestType: ScoredConcept["matchType"] = "trigram";

  const allNames = [concept.name, ...concept.aliases];

  // 3. Partial / contains
  for (const name of allNames) {
    const normalizedName = normalizeForComparison(name);
    if (
      normalizedName.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedName)
    ) {
      const lengthRatio =
        Math.min(normalizedQuery.length, normalizedName.length) /
        Math.max(normalizedQuery.length, normalizedName.length);
      const partialScore = 0.7 + lengthRatio * 0.2;
      if (partialScore > bestScore) {
        bestScore = partialScore;
        bestType = "partial";
      }
    }
  }

  // 4. Token overlap
  if (queryTokens.length > 0) {
    for (const name of allNames) {
      const nameTokens = tokenize(name);
      if (nameTokens.length === 0) continue;
      let matchedTokens = 0;
      for (const qt of queryTokens) {
        const isMatch = nameTokens.some((nt) => {
          if (nt === qt) return true;
          if (qt.length >= 3 && nt.length >= 3) {
            return nt.includes(qt) || qt.includes(nt);
          }
          return false;
        });
        if (isMatch) matchedTokens++;
      }
      if (matchedTokens === 0) continue;
      const overlap =
        matchedTokens / Math.max(queryTokens.length, nameTokens.length);
      const tokenScore = overlap * 0.85;
      if (tokenScore > bestScore) {
        bestScore = tokenScore;
        bestType = "token";
      }
    }
  }

  // 5. Attribute match (material/form/contaminant tags)
  if (concept.attributes) {
    const { likelyMaterials, likelyForms, commonContaminants } =
      concept.attributes;
    const tagStrs = [
      ...(likelyMaterials ?? []),
      ...(likelyForms ?? []),
      ...(commonContaminants ?? []),
    ];
    for (const tag of tagStrs) {
      const lTag = tag.toLowerCase().replace(/-/g, " ");
      if (lTag.length < 3) continue;
      if (
        normalizedQuery.includes(lTag) ||
        (lTag.length >= 4 && lTag.includes(normalizedQuery))
      ) {
        const tagScore = 0.5;
        if (tagScore > bestScore) {
          bestScore = tagScore;
          bestType = "attribute";
        }
      }
    }
  }

  // 6. Examples
  if (concept.examples) {
    for (const ex of concept.examples) {
      if (normalizeForComparison(ex) === normalizedQuery) {
        if (0.9 > bestScore) {
          bestScore = 0.9;
          bestType = "exact-alias";
        }
      }
      const sim = trigramSimilarity(ex, query);
      const exTrigram = sim * 0.75;
      if (exTrigram > bestScore) {
        bestScore = exTrigram;
        bestType = "trigram";
      }
    }
  }

  // 7. Trigram vs name and aliases
  for (const name of allNames) {
    const sim = trigramSimilarity(name, query);
    const trigramScore = sim * 0.7;
    if (trigramScore > bestScore) {
      bestScore = trigramScore;
      bestType = "trigram";
    }
  }

  return {
    concept,
    score: Math.round(bestScore * 100) / 100,
    matchType: bestType,
  };
}

function computeConfidence(
  best: ScoredConcept,
  allScored: ScoredConcept[]
): number {
  let confidence = best.score;
  if (allScored.length >= 2) {
    const gap = best.score - allScored[1].score;
    if (gap > 0.3) confidence = Math.min(1, confidence + 0.1);
    else if (gap < 0.05 && best.score < 0.8) {
      confidence = Math.max(0, confidence - 0.15);
    }
  }
  if (best.matchType === "exact-name") confidence = 1.0;
  if (best.matchType === "exact-alias") confidence = Math.max(confidence, 0.95);
  return Math.round(confidence * 100) / 100;
}

/** Boost scores for concepts that match vision labels. */
function applyVisionBoost(
  scored: ScoredConcept[],
  labels: string[]
): ScoredConcept[] {
  if (!labels?.length) return scored;
  const labelSet = new Set(
    labels.flatMap((l) => tokenize(l)).map((t) => t.toLowerCase())
  );
  return scored.map((s) => {
    const conceptTokens = new Set(
      [
        s.concept.name,
        ...s.concept.aliases,
        ...(s.concept.examples ?? []),
      ].flatMap((x) => tokenize(x))
    );
    let boost = 0;
    for (const lt of labelSet) {
      if (conceptTokens.has(lt) || [...conceptTokens].some((ct) => ct.includes(lt) || lt.includes(ct))) {
        boost += 0.05;
      }
    }
    if (boost <= 0) return s;
    return {
      ...s,
      score: Math.min(1, Math.round((s.score + boost) * 100) / 100),
    };
  });
}

export type ClassifyInput = {
  query: string;
  labels?: string[];
  followupAnswer?: string;
};

/**
 * Run the full classification pipeline: normalize → candidates → score →
 * vision boost → resolve top → follow-up if low confidence → map to category.
 */
export async function classify(input: ClassifyInput): Promise<ClassificationResult> {
  const rawQuery = normalizeQuery(input.query);
  const query = stripPackagingHint(rawQuery);

  if (!query) {
    return {
      category: "trash",
      confidence: 0,
      conceptId: null,
      conceptName: null,
      topMatches: [],
      why: ["Empty query provided"],
      doNext: ["Enter or describe the item you want to dispose of"],
      warnings: ["No input"],
    };
  }

  const concepts = await loadConcepts();
  if (concepts.length === 0) {
    return {
      category: "trash",
      confidence: 0,
      conceptId: null,
      conceptName: null,
      topMatches: [],
      why: ["Concept library not loaded"],
      doNext: ["Try again or use search"],
      warnings: ["No concepts available"],
    };
  }

  // Score all concepts, filter by threshold, sort, take top candidates
  let scored: ScoredConcept[] = concepts
    .map((c) => scoreConcept(c, query))
    .filter((s) => s.score >= MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, CANDIDATE_LIMIT);

  // If followup answer provided, prefer concepts that match the answer
  if (input.followupAnswer?.trim()) {
    const answer = input.followupAnswer.trim().toLowerCase();
    scored = scored.map((s) => {
      const match =
        s.concept.aliases.some((a) => a.toLowerCase().includes(answer)) ||
        s.concept.name.toLowerCase().includes(answer);
      if (match) return { ...s, score: Math.min(1, s.score + 0.2) };
      return s;
    });
    scored.sort((a, b) => b.score - a.score);
  }

  scored = applyVisionBoost(scored, input.labels ?? []);

  if (scored.length === 0) {
    return {
      category: "trash",
      confidence: 0,
      conceptId: null,
      conceptName: null,
      topMatches: [],
      why: [`No concept matched "${query}"`],
      doNext: ["Try different words", "Check spelling", "Describe the material"],
      warnings: ["No match"],
    };
  }

  const best = scored[0];
  const confidence = computeConfidence(best, scored);
  const category: EngineCategory = best.concept.defaultCategory;

  const topMatches = scored.slice(0, TOP_MATCHES_LIMIT).map((s) => ({
    conceptId: s.concept.id,
    score: s.score,
    matchType: s.matchType,
  }));

  const why: string[] = [
    `Best match: "${best.concept.name}" (${best.matchType}, score: ${best.score})`,
  ];
  if (scored.length > 1) {
    why.push(
      `${scored.length - 1} other concept${scored.length > 2 ? "s" : ""} matched`
    );
  }

  const doNext: string[] = [];
  if (confidence < 0.5) {
    doNext.push("Consider refining your search or answering the follow-up question");
  }
  doNext.push(`Dispose in: ${category}`);

  const warnings: string[] = [];
  if (confidence < CONFIDENCE_FOLLOWUP_THRESHOLD) {
    warnings.push("Low confidence — check the result or answer the question below");
  }

  let followupQuestion: FollowupQuestion | undefined;
  if (
    confidence < CONFIDENCE_FOLLOWUP_THRESHOLD &&
    best.concept.followup?.length
  ) {
    followupQuestion = best.concept.followup[0];
  }

  return {
    category,
    confidence,
    conceptId: best.concept.id,
    conceptName: best.concept.name,
    topMatches,
    why,
    doNext,
    followupQuestion,
    warnings: warnings.length ? warnings : undefined,
  };
}
