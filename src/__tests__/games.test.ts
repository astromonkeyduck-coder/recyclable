import { describe, it, expect } from "vitest";
import { scoreAnswer, getSpeedMultiplier, SCORING } from "@/lib/games/scoring";
import { getDailyChallengeSeed, suggestDifficulty } from "@/lib/games/progress";

describe("Scoring System", () => {
  it("returns 0 for wrong answers", () => {
    expect(scoreAnswer(false, 5000, 3, "easy")).toBe(0);
    expect(scoreAnswer(false, 1000, 10, "expert")).toBe(0);
  });

  it("gives base points for correct answer", () => {
    const pts = scoreAnswer(true, 10000, 0, "easy");
    expect(pts).toBeGreaterThan(0);
  });

  it("gives more points for faster answers", () => {
    const fast = scoreAnswer(true, 2000, 0, "easy");
    const slow = scoreAnswer(true, 14000, 0, "easy");
    expect(fast).toBeGreaterThan(slow);
  });

  it("gives streak bonus", () => {
    const noStreak = scoreAnswer(true, 5000, 0, "easy");
    const withStreak = scoreAnswer(true, 5000, 5, "easy");
    expect(withStreak).toBeGreaterThan(noStreak);
  });

  it("caps streak bonus at maximum", () => {
    const high = scoreAnswer(true, 5000, 50, "easy");
    const max = scoreAnswer(true, 5000, 100, "easy");
    expect(high).toBe(max);
  });

  it("applies difficulty multiplier", () => {
    const easy = scoreAnswer(true, 5000, 0, "easy");
    const hard = scoreAnswer(true, 5000, 0, "hard");
    const expert = scoreAnswer(true, 5000, 0, "expert");
    expect(hard).toBeGreaterThan(easy);
    expect(expert).toBeGreaterThan(hard);
  });

  it("expert gives 3x multiplier vs easy", () => {
    const easy = scoreAnswer(true, 5000, 0, "easy");
    const expert = scoreAnswer(true, 5000, 0, "expert");
    expect(expert).toBe(easy * 3);
  });
});

describe("Speed Multiplier", () => {
  it("gives max multiplier for very fast answers", () => {
    expect(getSpeedMultiplier(1000)).toBe(SCORING.MAX_SPEED_MULTIPLIER);
    expect(getSpeedMultiplier(3000)).toBe(SCORING.MAX_SPEED_MULTIPLIER);
  });

  it("gives min multiplier for very slow answers", () => {
    expect(getSpeedMultiplier(15000)).toBe(SCORING.MIN_SPEED_MULTIPLIER);
    expect(getSpeedMultiplier(20000)).toBe(SCORING.MIN_SPEED_MULTIPLIER);
  });

  it("gives intermediate values for medium speed", () => {
    const mid = getSpeedMultiplier(9000);
    expect(mid).toBeGreaterThan(SCORING.MIN_SPEED_MULTIPLIER);
    expect(mid).toBeLessThan(SCORING.MAX_SPEED_MULTIPLIER);
  });

  it("decreases as time increases", () => {
    const fast = getSpeedMultiplier(4000);
    const med = getSpeedMultiplier(8000);
    const slow = getSpeedMultiplier(12000);
    expect(fast).toBeGreaterThan(med);
    expect(med).toBeGreaterThan(slow);
  });
});

describe("Daily Challenge Seed", () => {
  it("returns a number", () => {
    const seed = getDailyChallengeSeed();
    expect(typeof seed).toBe("number");
    expect(seed).toBeGreaterThanOrEqual(0);
  });

  it("returns same seed for same day", () => {
    const a = getDailyChallengeSeed();
    const b = getDailyChallengeSeed();
    expect(a).toBe(b);
  });
});

describe("Difficulty Suggestion", () => {
  it("suggests easy for new players", () => {
    expect(suggestDifficulty("nonexistent-mode")).toBe("easy");
  });
});
