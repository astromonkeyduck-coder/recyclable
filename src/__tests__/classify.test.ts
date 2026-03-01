import { describe, it, expect, beforeAll } from "vitest";
import { classify } from "@/lib/classify/engine";
import { clearConceptCache } from "@/lib/classify/loader";

beforeAll(() => {
  clearConceptCache();
});

describe("classify - paper", () => {
  it("matches 'piece of paper' to paper_sheet (recycle), not newspaper", async () => {
    const result = await classify({ query: "piece of paper" });
    expect(result.conceptId).toBe("paper_sheet");
    expect(result.category).toBe("recycle");
    const topIds = result.topMatches.map((m) => m.conceptId);
    expect(topIds).toContain("paper_sheet");
    expect(result.topMatches[0]?.conceptId).toBe("paper_sheet");
  });

  it("matches 'receipt' to receipt_thermal (trash)", async () => {
    const result = await classify({ query: "receipt" });
    expect(result.conceptId).toBe("receipt_thermal");
    expect(result.category).toBe("trash");
  });

  it("matches 'glossy photo' or 'photo paper' to photo_paper_glossy (trash)", async () => {
    const result = await classify({ query: "glossy photo paper" });
    expect(result.conceptId).toBe("photo_paper_glossy");
    expect(result.category).toBe("trash");
  });

  it("matches 'pizza box' to pizza_box concept", async () => {
    const result = await classify({ query: "pizza box" });
    const topIds = result.topMatches.map((m) => m.conceptId);
    expect(
      topIds.some((id) => id === "pizza_box_clean" || id === "pizza_box_greasy")
    ).toBe(true);
    expect(["recycle", "compost"]).toContain(result.category);
  });

  it("matches 'newspaper' to newspaper (recycle)", async () => {
    const result = await classify({ query: "newspaper" });
    expect(result.conceptId).toBe("newspaper");
    expect(result.category).toBe("recycle");
  });
});

describe("classify - plastic", () => {
  it("matches 'candy wrapper' to candy_wrapper (trash)", async () => {
    const result = await classify({ query: "candy wrapper" });
    expect(result.conceptId).toBe("candy_wrapper");
    expect(result.category).toBe("trash");
  });

  it("matches 'plastic bag of candy' to candy_wrapper or plastic_bags", async () => {
    const result = await classify({ query: "plastic bag of candy" });
    const topIds = result.topMatches.map((m) => m.conceptId);
    expect(
      topIds.some((id) => id === "candy_wrapper" || id === "plastic_bags")
    ).toBe(true);
    expect(result.category).toBe("trash");
  });
});

describe("classify - metal", () => {
  it("matches 'keys' to keys (recycle)", async () => {
    const result = await classify({ query: "keys" });
    expect(result.conceptId).toBe("keys");
    expect(result.category).toBe("recycle");
  });
});

describe("classify - glass", () => {
  it("matches 'drinking glass' to drinking_glass (trash)", async () => {
    const result = await classify({ query: "drinking glass" });
    expect(result.conceptId).toBe("drinking_glass");
    expect(result.category).toBe("trash");
  });

  it("matches 'wine bottle' to glass_bottle (recycle)", async () => {
    const result = await classify({ query: "wine bottle" });
    expect(result.conceptId).toBe("glass_bottle");
    expect(result.category).toBe("recycle");
  });
});

describe("classify - hazardous", () => {
  it("matches 'batteries' to hazardous", async () => {
    const result = await classify({ query: "batteries" });
    expect(result.conceptId).toBe("batteries");
    expect(result.category).toBe("hazardous");
  });
});

describe("classify - household", () => {
  it("matches 'ceramic mug' to ceramic_mug (trash)", async () => {
    const result = await classify({ query: "ceramic mug" });
    expect(result.conceptId).toBe("ceramic_mug");
    expect(result.category).toBe("trash");
  });

  it("matches 'broken ceramic' to broken_ceramic", async () => {
    const result = await classify({ query: "broken ceramic" });
    expect(result.conceptId).toBe("broken_ceramic");
    expect(result.category).toBe("trash");
  });

  it("matches 'balloon' to balloon concept", async () => {
    const result = await classify({ query: "balloon" });
    const topIds = result.topMatches.map((m) => m.conceptId);
    expect(
      topIds.some((id) => id === "balloon_latex" || id === "balloon_foil")
    ).toBe(true);
    expect(result.category).toBe("trash");
  });
});

describe("classify - edge cases", () => {
  it("returns empty match for empty query", async () => {
    const result = await classify({ query: "   " });
    expect(result.conceptId).toBeNull();
    expect(result.confidence).toBe(0);
  });

  it("includes why and doNext", async () => {
    const result = await classify({ query: "keys" });
    expect(result.why.length).toBeGreaterThan(0);
    expect(result.doNext.length).toBeGreaterThan(0);
  });
});
