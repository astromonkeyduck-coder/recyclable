import type { Material } from "@/lib/providers/types";
import { tokenize, trigramSimilarity } from "./tokenizer";

export type ScoredMatch = {
  material: Material;
  score: number;
  matchType: "exact-name" | "exact-alias" | "partial" | "token" | "trigram" | "tag";
};

function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

export function scoreMaterial(material: Material, query: string): ScoredMatch {
  const normalizedQuery = normalizeForComparison(query);
  const queryTokens = tokenize(query);

  // 1. Exact name match
  if (normalizeForComparison(material.name) === normalizedQuery) {
    return { material, score: 1.0, matchType: "exact-name" };
  }

  // 2. Exact alias match
  for (const alias of material.aliases) {
    if (normalizeForComparison(alias) === normalizedQuery) {
      return { material, score: 0.95, matchType: "exact-alias" };
    }
  }

  let bestScore = 0;
  let bestType: ScoredMatch["matchType"] = "trigram";

  // 3. Partial / contains match on name and aliases
  const allNames = [material.name, ...material.aliases];
  for (const name of allNames) {
    const normalizedName = normalizeForComparison(name);
    if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
      const lengthRatio = Math.min(normalizedQuery.length, normalizedName.length) /
        Math.max(normalizedQuery.length, normalizedName.length);
      const partialScore = 0.7 + lengthRatio * 0.2;
      if (partialScore > bestScore) {
        bestScore = partialScore;
        bestType = "partial";
      }
    }
  }

  // 4. Token overlap (require tokens >= 3 chars for substring matching)
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

      const overlap = matchedTokens / Math.max(queryTokens.length, nameTokens.length);
      const tokenScore = overlap * 0.85;
      if (tokenScore > bestScore) {
        bestScore = tokenScore;
        bestType = "token";
      }
    }
  }

  // 5. Tag match (require tag >= 3 chars and meaningful overlap)
  if (material.tags) {
    for (const tag of material.tags) {
      const lTag = tag.toLowerCase();
      if (lTag.length < 3) continue;
      if (normalizedQuery.includes(lTag) || (lTag.length >= 4 && lTag.includes(normalizedQuery))) {
        const tagScore = 0.5;
        if (tagScore > bestScore) {
          bestScore = tagScore;
          bestType = "tag";
        }
      }
    }
  }

  // 6. Example match
  if (material.examples) {
    for (const example of material.examples) {
      if (normalizeForComparison(example) === normalizedQuery) {
        const exScore = 0.9;
        if (exScore > bestScore) {
          bestScore = exScore;
          bestType = "exact-alias";
        }
      }

      const sim = trigramSimilarity(example, query);
      const exTrigramScore = sim * 0.75;
      if (exTrigramScore > bestScore) {
        bestScore = exTrigramScore;
        bestType = "trigram";
      }
    }
  }

  // 7. Trigram similarity against all names
  for (const name of allNames) {
    const sim = trigramSimilarity(name, query);
    const trigramScore = sim * 0.7;
    if (trigramScore > bestScore) {
      bestScore = trigramScore;
      bestType = "trigram";
    }
  }

  return {
    material,
    score: Math.round(bestScore * 100) / 100,
    matchType: bestType,
  };
}
