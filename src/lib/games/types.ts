export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "speed_sort"
  | "scenario"
  | "estimation";

export type QuestionCategory =
  | "recycling"
  | "climate"
  | "waste"
  | "materials"
  | "energy";

export type DifficultyLabel = "easy" | "medium" | "hard" | "expert";

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  category: QuestionCategory;
  funFact?: string;
  timeLimit?: number;
};

export type DifficultyLevel = {
  id: string;
  label: DifficultyLabel;
  questions: Question[];
};

export type GameModeData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultTimeLimit?: number;
  questionsPerRound: number;
  difficultyLevels: DifficultyLevel[];
};

export type AnswerRecord = {
  questionId: string;
  correct: boolean;
  timeMs: number;
  points: number;
  streak: number;
};

export type GameSession = {
  modeId: string;
  difficulty: DifficultyLabel;
  questions: Question[];
  answers: AnswerRecord[];
  currentIndex: number;
  score: number;
  streak: number;
  startedAt: number;
};

export type GameResult = {
  modeId: string;
  modeName: string;
  difficulty: DifficultyLabel;
  totalScore: number;
  maxPossibleScore: number;
  accuracy: number;
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
  averageTimeMs: number;
  answers: AnswerRecord[];
  funFact?: string;
  isNewHighScore: boolean;
  completedAt: number;
};

export type ModeProgress = {
  highScore: number;
  bestStreak: number;
  totalPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  lastPlayed: string;
  lastDifficulty: DifficultyLabel;
};

export type PlayerProgress = {
  version: 1;
  modes: Record<string, ModeProgress>;
  totalGamesPlayed: number;
  currentDayStreak: number;
  longestDayStreak: number;
  lastPlayedDate: string;
};

export const GAME_MODES_META: Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}> = [
  {
    id: "recycle-or-not",
    name: "Recycle or Not?",
    description: "Rapid-fire item classification. How fast can you sort?",
    icon: "♻️",
    color: "#3B82F6",
  },
  {
    id: "dropoff-detective",
    name: "Drop-Off Detective",
    description: "Scenario-based puzzles. Figure out the right disposal plan.",
    icon: "🔍",
    color: "#F97316",
  },
  {
    id: "climate-iq",
    name: "Climate IQ",
    description: "Test your environmental knowledge with data-driven trivia.",
    icon: "🧠",
    color: "#8B5CF6",
  },
  {
    id: "speed-sort",
    name: "Speed Sort",
    description: "30-second challenge. Tap to sort items into the right bin.",
    icon: "⚡",
    color: "#22C55E",
  },
];
