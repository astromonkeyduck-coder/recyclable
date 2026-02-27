import type { AnswerRecord, DifficultyLabel, GameResult } from "./types";

export const SCORING = {
  BASE_POINTS: 100,
  SPEED_BONUS_THRESHOLD_MS: 3000,
  SPEED_PENALTY_THRESHOLD_MS: 15000,
  MAX_SPEED_MULTIPLIER: 2.0,
  MIN_SPEED_MULTIPLIER: 0.5,
  STREAK_BONUS_PER: 10,
  MAX_STREAK_BONUS: 100,
  DIFFICULTY_MULTIPLIERS: {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 3.0,
  } as Record<DifficultyLabel, number>,
} as const;

export function getSpeedMultiplier(timeMs: number): number {
  if (timeMs <= SCORING.SPEED_BONUS_THRESHOLD_MS) {
    return SCORING.MAX_SPEED_MULTIPLIER;
  }
  if (timeMs >= SCORING.SPEED_PENALTY_THRESHOLD_MS) {
    return SCORING.MIN_SPEED_MULTIPLIER;
  }
  const range = SCORING.SPEED_PENALTY_THRESHOLD_MS - SCORING.SPEED_BONUS_THRESHOLD_MS;
  const elapsed = timeMs - SCORING.SPEED_BONUS_THRESHOLD_MS;
  const ratio = 1 - elapsed / range;
  return (
    SCORING.MIN_SPEED_MULTIPLIER +
    ratio * (SCORING.MAX_SPEED_MULTIPLIER - SCORING.MIN_SPEED_MULTIPLIER)
  );
}

export function scoreAnswer(
  correct: boolean,
  timeMs: number,
  streak: number,
  difficulty: DifficultyLabel
): number {
  if (!correct) return 0;

  const base = SCORING.BASE_POINTS;
  const speed = getSpeedMultiplier(timeMs);
  const streakBonus = Math.min(streak * SCORING.STREAK_BONUS_PER, SCORING.MAX_STREAK_BONUS);
  const diffMult = SCORING.DIFFICULTY_MULTIPLIERS[difficulty];

  return Math.round((base * speed + streakBonus) * diffMult);
}

export function calculateFinalScore(
  answers: AnswerRecord[],
  modeId: string,
  modeName: string,
  difficulty: DifficultyLabel,
  isNewHighScore: boolean
): GameResult {
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const totalScore = answers.reduce((sum, a) => sum + a.points, 0);

  let bestStreak = 0;
  let currentStreak = 0;
  for (const a of answers) {
    if (a.correct) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0);
  const averageTimeMs = totalQuestions > 0 ? Math.round(totalTimeMs / totalQuestions) : 0;

  const maxPossible = totalQuestions * Math.round(
    SCORING.BASE_POINTS * SCORING.MAX_SPEED_MULTIPLIER * SCORING.DIFFICULTY_MULTIPLIERS[difficulty]
    + SCORING.MAX_STREAK_BONUS * SCORING.DIFFICULTY_MULTIPLIERS[difficulty]
  );

  const funFacts = answers
    .map((a, i) => ({ correct: a.correct, index: i }))
    .filter((a) => a.correct);
  const randomFact = funFacts.length > 0
    ? funFacts[Math.floor(Math.random() * funFacts.length)]
    : null;

  return {
    modeId,
    modeName,
    difficulty,
    totalScore,
    maxPossibleScore: maxPossible,
    accuracy,
    correctCount,
    totalQuestions,
    bestStreak,
    averageTimeMs,
    answers,
    isNewHighScore,
    completedAt: Date.now(),
    funFact: randomFact ? undefined : undefined,
  };
}
