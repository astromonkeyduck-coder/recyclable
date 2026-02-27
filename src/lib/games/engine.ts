import type { DifficultyLabel, GameModeData, GameSession, Question } from "./types";
import { getDailyChallengeSeed } from "./progress";

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getQuestionsForDifficulty(
  mode: GameModeData,
  difficulty: DifficultyLabel
): Question[] {
  const level = mode.difficultyLevels.find((d) => d.label === difficulty);
  if (!level) {
    const fallback = mode.difficultyLevels[0];
    return fallback ? fallback.questions : [];
  }
  return level.questions;
}

export function createSession(
  mode: GameModeData,
  difficulty: DifficultyLabel,
  questionCount?: number
): GameSession {
  const allQuestions = getQuestionsForDifficulty(mode, difficulty);
  const count = questionCount ?? mode.questionsPerRound;
  const shuffled = shuffle(allQuestions);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    modeId: mode.id,
    difficulty,
    questions: selected,
    answers: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    startedAt: Date.now(),
  };
}

export function createDailyChallenge(
  mode: GameModeData,
  questionCount?: number
): GameSession {
  const seed = getDailyChallengeSeed();
  const allQuestions = mode.difficultyLevels.flatMap((d) => d.questions);
  const count = questionCount ?? mode.questionsPerRound;
  const shuffled = seededShuffle(allQuestions, seed + mode.id.length);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  const modeIndex = seed % 4;
  const difficulties: DifficultyLabel[] = ["easy", "medium", "hard", "expert"];
  const difficulty = difficulties[modeIndex % difficulties.length];

  return {
    modeId: mode.id,
    difficulty,
    questions: selected,
    answers: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    startedAt: Date.now(),
  };
}

export function getDailyChallengeMode(): string {
  const seed = getDailyChallengeSeed();
  const modes = ["recycle-or-not", "climate-iq", "dropoff-detective", "speed-sort"];
  return modes[seed % modes.length];
}
