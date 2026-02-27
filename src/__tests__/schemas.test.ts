import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { ProviderSchema, ScanOutputSchema, ResolveOutputSchema } from "@/lib/providers/schemas";

describe("Provider Schema Validation", () => {
  it("validates general.json", () => {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data/providers/general.json"),
      "utf-8"
    );
    const data = JSON.parse(raw);
    const result = ProviderSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("validates orlando.json", () => {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data/providers/orlando.json"),
      "utf-8"
    );
    const data = JSON.parse(raw);
    const result = ProviderSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects provider with missing required fields", () => {
    const result = ProviderSchema.safeParse({
      id: "test",
      displayName: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects material with invalid category", () => {
    const result = ProviderSchema.safeParse({
      id: "test",
      displayName: "Test",
      coverage: { country: "US" },
      source: { name: "Test", generatedAt: "2026-01-01" },
      materials: [
        {
          id: "m1",
          name: "Test Material",
          aliases: [],
          category: "invalid-category",
          instructions: ["Test"],
          notes: [],
          commonMistakes: [],
        },
      ],
      rulesSummary: {
        accepted: { recycle: [] },
        notAccepted: { recycle: [] },
        tips: [],
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("ScanOutput Schema", () => {
  it("validates valid scan output", () => {
    const result = ScanOutputSchema.safeParse({
      labels: ["plastic bottle", "water bottle"],
      guessedItemName: "plastic bottle",
      visionConfidence: 0.85,
      notes: [],
    });
    expect(result.success).toBe(true);
  });

  it("validates empty scan output (failed scan)", () => {
    const result = ScanOutputSchema.safeParse({
      labels: [],
      guessedItemName: "",
      visionConfidence: 0,
      notes: ["Could not identify item"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects confidence > 1", () => {
    const result = ScanOutputSchema.safeParse({
      labels: [],
      guessedItemName: "test",
      visionConfidence: 1.5,
      notes: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("ResolveOutput Schema", () => {
  it("validates valid resolve output", () => {
    const result = ResolveOutputSchema.safeParse({
      bestMaterialId: "plastic-bottles",
      alternatives: [{ materialId: "plastic-containers", score: 0.7 }],
      resolveConfidence: 0.9,
      reasoning: ["Matched to plastic bottles"],
    });
    expect(result.success).toBe(true);
  });

  it("validates null bestMaterialId", () => {
    const result = ResolveOutputSchema.safeParse({
      bestMaterialId: null,
      alternatives: [],
      resolveConfidence: 0,
      reasoning: ["Unknown item"],
    });
    expect(result.success).toBe(true);
  });
});
