import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { matchMaterial, searchMaterials } from "@/lib/matching/engine";
import { tokenize, trigramSimilarity } from "@/lib/matching/tokenizer";
import type { Provider } from "@/lib/providers/types";

let orlando: Provider;
let general: Provider;

beforeAll(() => {
  const orlandoRaw = fs.readFileSync(
    path.join(process.cwd(), "data/providers/orlando.json"),
    "utf-8"
  );
  orlando = JSON.parse(orlandoRaw);

  const generalRaw = fs.readFileSync(
    path.join(process.cwd(), "data/providers/general.json"),
    "utf-8"
  );
  general = JSON.parse(generalRaw);
});

describe("Tokenizer", () => {
  it("tokenizes and normalizes", () => {
    expect(tokenize("Plastic Bottles")).toEqual(["plastic", "bottle"]);
  });

  it("removes stop words", () => {
    expect(tokenize("a bag of chips")).toEqual(["bag", "chip"]);
  });

  it("handles hyphens", () => {
    expect(tokenize("e-waste")).toEqual(["e", "waste"]);
  });
});

describe("Trigram Similarity", () => {
  it("returns 1 for identical strings", () => {
    expect(trigramSimilarity("plastic", "plastic")).toBe(1);
  });

  it("returns high similarity for similar strings", () => {
    const sim = trigramSimilarity("plastic bottle", "plastic bottles");
    expect(sim).toBeGreaterThan(0.7);
  });

  it("returns low similarity for unrelated strings", () => {
    const sim = trigramSimilarity("plastic", "battery");
    expect(sim).toBeLessThan(0.3);
  });
});

describe("matchMaterial - Orlando Provider", () => {
  it("matches 'plastic bottle' to recycle", () => {
    const result = matchMaterial(orlando, "plastic bottle");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("recycle");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("matches 'plastic bag' to trash with high confidence", () => {
    const result = matchMaterial(orlando, "plastic bag");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("trash");
    expect(result.best!.id).toBe("plastic-bags");
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it("matches 'soda can' to recycle via alias", () => {
    const result = matchMaterial(orlando, "soda can");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("recycle");
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it("matches 'styrofoam' to trash", () => {
    const result = matchMaterial(orlando, "styrofoam");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("trash");
  });

  it("matches 'batteries' to hazardous", () => {
    const result = matchMaterial(orlando, "batteries");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("hazardous");
  });

  it("matches 'old TV' to dropoff", () => {
    const result = matchMaterial(orlando, "television");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("dropoff");
  });

  it("returns low confidence for unknown items", () => {
    const result = matchMaterial(orlando, "unicorn horn");
    expect(result.confidence).toBeLessThan(0.4);
  });

  it("returns empty result for empty query", () => {
    const result = matchMaterial(orlando, "");
    expect(result.best).toBeNull();
    expect(result.matches).toHaveLength(0);
  });
});

describe("matchMaterial - General Provider", () => {
  it("matches 'aluminum can' to recycle", () => {
    const result = matchMaterial(general, "aluminum can");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("recycle");
  });

  it("matches 'food scraps' to compost", () => {
    const result = matchMaterial(general, "food scraps");
    expect(result.best).not.toBeNull();
    expect(result.best!.category).toBe("compost");
  });
});

describe("searchMaterials", () => {
  it("returns multiple results sorted by score", () => {
    const results = searchMaterials(orlando, "plastic");
    expect(results.length).toBeGreaterThan(1);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("respects limit", () => {
    const results = searchMaterials(orlando, "can", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe("Determinism", () => {
  it("returns same results for same query", () => {
    const r1 = matchMaterial(orlando, "glass bottle");
    const r2 = matchMaterial(orlando, "glass bottle");
    expect(r1.best?.id).toBe(r2.best?.id);
    expect(r1.confidence).toBe(r2.confidence);
    expect(r1.matches.length).toBe(r2.matches.length);
  });
});
