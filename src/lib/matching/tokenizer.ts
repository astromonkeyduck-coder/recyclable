const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "in", "on", "for", "to", "with",
  "is", "it", "at", "by", "from", "that", "this", "my", "your",
]);

const PLURAL_RULES: Array<[RegExp, string]> = [
  [/ies$/i, "y"],
  [/ves$/i, "f"],
  [/ses$/i, "s"],
  [/s$/i, ""],
];

function depluralize(word: string): string {
  if (word.length <= 3) return word;
  for (const [pattern, replacement] of PLURAL_RULES) {
    if (pattern.test(word)) {
      return word.replace(pattern, replacement);
    }
  }
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w))
    .map(depluralize);
}

export function generateTrigrams(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const trigrams = new Set<string>();
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.substring(i, i + 3));
  }
  return trigrams;
}

export function trigramSimilarity(a: string, b: string): number {
  const trigramsA = generateTrigrams(a);
  const trigramsB = generateTrigrams(b);

  if (trigramsA.size === 0 || trigramsB.size === 0) return 0;

  let intersection = 0;
  for (const t of trigramsA) {
    if (trigramsB.has(t)) intersection++;
  }

  const union = trigramsA.size + trigramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
