import { z } from "zod";

/** Engine output: strictly one of 5 categories. No donate, yard-waste, deposit, unknown. */
export const EngineCategorySchema = z.enum([
  "recycle",
  "compost",
  "trash",
  "dropoff",
  "hazardous",
]);
export type EngineCategory = z.infer<typeof EngineCategorySchema>;

/** Material hint for scoring / vision boost (e.g. paper, plastic, metal). */
export const MaterialTagSchema = z.enum([
  "paper",
  "plastic",
  "metal",
  "glass",
  "textile",
  "organic",
  "electronic",
  "hazardous",
  "mixed",
]);
export type MaterialTag = z.infer<typeof MaterialTagSchema>;

/** Form hint (e.g. rigid, film, container). */
export const FormTagSchema = z.enum([
  "rigid",
  "film",
  "container",
  "bottle",
  "can",
  "box",
  "bag",
  "wrapper",
  "utensil",
  "scrap",
  "broken",
]);
export type FormTag = z.infer<typeof FormTagSchema>;

/** Contamination / state (e.g. food-soiled, clean). */
export const ContaminantTagSchema = z.enum([
  "clean",
  "food-soiled",
  "greasy",
  "coated",
  "laminated",
  "thermal",
]);
export type ContaminantTag = z.infer<typeof ContaminantTagSchema>;

export const ConceptAttributesSchema = z
  .object({
    likelyMaterials: z.array(MaterialTagSchema).optional(),
    likelyForms: z.array(FormTagSchema).optional(),
    commonContaminants: z.array(ContaminantTagSchema).optional(),
    mixedMaterial: z.boolean().optional(),
  })
  .optional();
export type ConceptAttributes = z.infer<typeof ConceptAttributesSchema>;

export const FollowupQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
});
export type FollowupQuestion = z.infer<typeof FollowupQuestionSchema>;

export const ConceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()).min(1),
  examples: z.array(z.string()).optional(),
  defaultCategory: EngineCategorySchema,
  attributes: ConceptAttributesSchema,
  followup: z.array(FollowupQuestionSchema).optional(),
});
export type Concept = z.infer<typeof ConceptSchema>;

export const ClassificationResultSchema = z.object({
  category: EngineCategorySchema,
  confidence: z.number().min(0).max(1),
  conceptId: z.string().nullable(),
  conceptName: z.string().nullable(),
  topMatches: z.array(
    z.object({
      conceptId: z.string(),
      score: z.number().min(0).max(1),
      matchType: z
        .enum([
          "exact-id",
          "exact-name",
          "exact-alias",
          "partial",
          "token",
          "trigram",
          "attribute",
        ])
        .optional(),
    })
  ),
  why: z.array(z.string()),
  doNext: z.array(z.string()),
  followupQuestion: FollowupQuestionSchema.optional(),
  warnings: z.array(z.string()).optional(),
});
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/** Single concept file: array of concepts. */
export const ConceptArraySchema = z.array(ConceptSchema);
