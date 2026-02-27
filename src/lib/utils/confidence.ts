export function blendConfidence(
  deterministicConfidence: number,
  visionConfidence?: number,
  resolveConfidence?: number
): number {
  if (visionConfidence == null && resolveConfidence == null) {
    return deterministicConfidence;
  }

  const weights = { deterministic: 0.5, vision: 0.25, resolve: 0.25 };
  let total = deterministicConfidence * weights.deterministic;
  let weightSum = weights.deterministic;

  if (visionConfidence != null) {
    total += visionConfidence * weights.vision;
    weightSum += weights.vision;
  }

  if (resolveConfidence != null) {
    total += resolveConfidence * weights.resolve;
    weightSum += weights.resolve;
  }

  return Math.round((total / weightSum) * 100) / 100;
}

export const CONFIDENCE_THRESHOLD = 0.4;
export const HIGH_CONFIDENCE_THRESHOLD = 0.75;
