import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["multiple_choice", "true_false", "speed_sort", "scenario", "estimation"]),
  prompt: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(1),
  category: z.enum(["recycling", "climate", "waste", "materials", "energy"]),
  funFact: z.string().optional(),
  timeLimit: z.number().positive().optional(),
});

export const DifficultyLevelSchema = z.object({
  id: z.string().min(1),
  label: z.enum(["easy", "medium", "hard", "expert"]),
  questions: z.array(QuestionSchema).min(1),
});

export const GameModeDataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string(),
  color: z.string(),
  defaultTimeLimit: z.number().positive().optional(),
  questionsPerRound: z.number().positive(),
  difficultyLevels: z.array(DifficultyLevelSchema).min(1),
});
