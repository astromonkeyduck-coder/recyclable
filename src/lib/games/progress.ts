import type { DifficultyLabel, GameResult, ModeProgress, PlayerProgress } from "./types";

const STORAGE_KEY = "itr-games-v1";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function defaultProgress(): PlayerProgress {
  return {
    version: 1,
    modes: {},
    totalGamesPlayed: 0,
    currentDayStreak: 0,
    longestDayStreak: 0,
    lastPlayedDate: "",
  };
}

function defaultModeProgress(): ModeProgress {
  return {
    highScore: 0,
    bestStreak: 0,
    totalPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    lastPlayed: "",
    lastDifficulty: "easy",
  };
}

export function loadProgress(): PlayerProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return defaultProgress();
    return parsed as PlayerProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordGameResult(result: GameResult): PlayerProgress {
  const progress = loadProgress();
  const today = getToday();

  if (!progress.modes[result.modeId]) {
    progress.modes[result.modeId] = defaultModeProgress();
  }

  const mode = progress.modes[result.modeId];
  mode.totalPlayed++;
  mode.totalCorrect += result.correctCount;
  mode.totalQuestions += result.totalQuestions;
  mode.lastPlayed = today;
  mode.lastDifficulty = result.difficulty;

  if (result.totalScore > mode.highScore) {
    mode.highScore = result.totalScore;
  }
  if (result.bestStreak > mode.bestStreak) {
    mode.bestStreak = result.bestStreak;
  }

  progress.totalGamesPlayed++;

  if (progress.lastPlayedDate === today) {
    // Already played today, streak unchanged
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (progress.lastPlayedDate === yesterdayStr) {
      progress.currentDayStreak++;
    } else {
      progress.currentDayStreak = 1;
    }
  }

  progress.lastPlayedDate = today;
  progress.longestDayStreak = Math.max(
    progress.longestDayStreak,
    progress.currentDayStreak
  );

  saveProgress(progress);
  return progress;
}

export function getModeProgress(modeId: string): ModeProgress {
  const progress = loadProgress();
  return progress.modes[modeId] ?? defaultModeProgress();
}

export function getGlobalAccuracy(): number {
  const progress = loadProgress();
  let totalCorrect = 0;
  let totalQuestions = 0;
  for (const mode of Object.values(progress.modes)) {
    totalCorrect += mode.totalCorrect;
    totalQuestions += mode.totalQuestions;
  }
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
}

export function suggestDifficulty(modeId: string): DifficultyLabel {
  const mode = getModeProgress(modeId);
  if (mode.totalPlayed < 3) return "easy";

  const accuracy = mode.totalQuestions > 0
    ? mode.totalCorrect / mode.totalQuestions
    : 0;

  if (accuracy > 0.9) return "expert";
  if (accuracy > 0.8) return "hard";
  if (accuracy > 0.6) return "medium";
  return "easy";
}

export type PlayerRank = {
  label: string;
  icon: string;
  minGames: number;
};

const RANKS: PlayerRank[] = [
  { label: "Legend", icon: "👑", minGames: 100 },
  { label: "Master", icon: "💎", minGames: 50 },
  { label: "Expert", icon: "🏆", minGames: 25 },
  { label: "Sorter", icon: "🌿", minGames: 10 },
  { label: "Rookie", icon: "🌱", minGames: 0 },
];

export function getPlayerRank(totalGames: number): PlayerRank {
  return RANKS.find((r) => totalGames >= r.minGames) ?? RANKS[RANKS.length - 1];
}

export function getNextRank(totalGames: number): PlayerRank | null {
  const current = getPlayerRank(totalGames);
  const idx = RANKS.indexOf(current);
  return idx > 0 ? RANKS[idx - 1] : null;
}

export function getDailyChallengeSeed(): number {
  const today = getToday();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
