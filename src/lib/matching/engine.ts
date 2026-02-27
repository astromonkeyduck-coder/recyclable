import type { Material, MatchResult, Provider } from "@/lib/providers/types";
import { scoreMaterial, type ScoredMatch } from "./scorer";

const MIN_SCORE_THRESHOLD = 0.15;

export function matchMaterial(provider: Provider, query: string): MatchResult {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      best: null,
      matches: [],
      confidence: 0,
      rationale: ["Empty query provided"],
    };
  }

  const scored: ScoredMatch[] = provider.materials
    .map((m) => scoreMaterial(m, trimmedQuery))
    .filter((s) => s.score >= MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      best: null,
      matches: [],
      confidence: 0,
      rationale: [
        `No materials matched "${trimmedQuery}" in ${provider.displayName}`,
        "Try a different search term or check spelling",
      ],
    };
  }

  const best = scored[0];
  const topMatches = scored.slice(0, 5).map((s) => ({
    material: s.material,
    score: s.score,
  }));

  const rationale: string[] = [];
  rationale.push(
    `Best match: "${best.material.name}" (${best.matchType}, score: ${best.score})`
  );

  if (scored.length > 1) {
    rationale.push(
      `${scored.length - 1} additional match${scored.length > 2 ? "es" : ""} found`
    );
  }

  const confidence = computeConfidence(best, scored);

  if (confidence < 0.5) {
    rationale.push("Low confidence. Consider refining your search.");
  }

  return {
    best: best.material,
    matches: topMatches,
    confidence,
    rationale,
  };
}

function computeConfidence(best: ScoredMatch, allScored: ScoredMatch[]): number {
  let confidence = best.score;

  // Boost confidence if there's a clear gap between best and second
  if (allScored.length >= 2) {
    const gap = best.score - allScored[1].score;
    if (gap > 0.3) {
      confidence = Math.min(1, confidence + 0.1);
    } else if (gap < 0.05 && best.score < 0.8) {
      // Ambiguous: reduce confidence
      confidence = Math.max(0, confidence - 0.15);
    }
  }

  // Exact matches get full confidence boost
  if (best.matchType === "exact-name") confidence = 1.0;
  if (best.matchType === "exact-alias") confidence = Math.max(confidence, 0.95);

  return Math.round(confidence * 100) / 100;
}

export function searchMaterials(
  provider: Provider,
  query: string,
  limit = 10
): Array<{ material: Material; score: number }> {
  const result = matchMaterial(provider, query);
  return result.matches.slice(0, limit);
}
