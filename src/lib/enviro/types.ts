import { z } from "zod";

export const GraphConnectionSchema = z.object({
  graphType: z.string(),
  xAxis: z.string(),
  yAxis: z.string(),
  trend: z.string(),
  possibleCalculation: z.string().optional(),
});

export const TopicCardSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  topicTitle: z.string(),
  cedLearningObjective: z.string(),
  bigIdea: z.string(),
  sciencePractices: z.array(z.string()),
  examWeightRelevance: z.enum(["high", "medium", "low"]),
  visualType: z.array(z.string()),
  mustKnowConcept: z.string(),
  diagramDescription: z.string(),
  specificExamples: z.array(z.string()),
  causes: z.array(z.string()),
  effects: z.array(z.string()),
  humanImpacts: z.array(z.string()),
  solutions: z.array(z.string()),
  graphConnection: GraphConnectionSchema.optional(),
  frqUse: z.string(),
  mcqTrap: z.string(),
  commonMistake: z.string(),
  modelSentence: z.string(),
  sourceStatus: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

export type TopicCard = z.infer<typeof TopicCardSchema>;
export type GraphConnection = z.infer<typeof GraphConnectionSchema>;

export const CauseEffectChainSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  title: z.string(),
  steps: z.array(
    z.object({
      label: z.string(),
      type: z.enum(["cause", "mechanism", "effect", "consequence", "solution", "tradeoff"]),
    })
  ),
});

export type CauseEffectChain = z.infer<typeof CauseEffectChainSchema>;

export const MisconceptionSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  wrongStatement: z.string(),
  whyTempting: z.string(),
  correctStatement: z.string(),
  apSafeSentence: z.string(),
});

export type Misconception = z.infer<typeof MisconceptionSchema>;

export const ExampleSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  example: z.string(),
  type: z.enum(["specific", "cause_effect", "graph_data", "frq", "mcq_trap", "misconception"]),
});

export type Example = z.infer<typeof ExampleSchema>;

export const SolutionTradeoffSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  solution: z.string(),
  mechanism: z.string(),
  advantage: z.string(),
  disadvantage: z.string(),
  unintendedConsequence: z.string(),
  stakeholderTradeoff: z.string(),
  frqSentence: z.string(),
});

export type SolutionTradeoff = z.infer<typeof SolutionTradeoffSchema>;

export const PercentChangePresetSchema = z.object({
  id: z.string(),
  label: z.string(),
  initialValue: z.number(),
  finalValue: z.number(),
  timePeriod: z.number().optional(),
  units: z.string(),
  variable: z.string(),
  population: z.number().optional(),
});

export type PercentChangePreset = z.infer<typeof PercentChangePresetSchema>;

export const GraphConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  family: z.string(),
  xAxis: z.string(),
  xUnits: z.string(),
  yAxis: z.string(),
  yUnits: z.string(),
  trend: z.string(),
  relationship: z.string(),
  cause: z.string(),
  apInterpretation: z.string(),
  wrongInterpretation: z.string(),
  frqSentence: z.string(),
  dataPoints: z.array(z.object({ x: z.number(), y: z.number() })),
});

export type GraphConfig = z.infer<typeof GraphConfigSchema>;

export const FRQPromptSchema = z.object({
  id: z.string(),
  unit: z.string(),
  topicNumber: z.string(),
  prompt: z.string(),
  taskVerb: z.string(),
  modelSentence: z.string(),
  weakAnswer: z.string(),
  whyWeakFails: z.string(),
  strongAnswer: z.string(),
  commonMistake: z.string(),
});

export type FRQPrompt = z.infer<typeof FRQPromptSchema>;
