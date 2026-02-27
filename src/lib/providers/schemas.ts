import { z } from "zod";

export const DisposalCategorySchema = z.enum([
  "recycle",
  "trash",
  "compost",
  "dropoff",
  "hazardous",
  "unknown",
]);

export const MaterialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  category: DisposalCategorySchema,
  instructions: z.array(z.string()),
  notes: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
});

export const RulesSummarySchema = z.object({
  accepted: z.object({
    recycle: z.array(z.string()),
    compost: z.array(z.string()).optional(),
    trash: z.array(z.string()).optional(),
  }),
  notAccepted: z.object({
    recycle: z.array(z.string()),
    compost: z.array(z.string()).optional(),
  }),
  tips: z.array(z.string()),
});

export const DropoffLocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  url: z.string().optional(),
  accepts: z.array(z.string()),
  hours: z.string().optional(),
  notes: z.string().optional(),
});

export const ProviderCoverageSchema = z.object({
  country: z.string().min(1),
  region: z.string().optional(),
  city: z.string().optional(),
  zips: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
});

export const ProviderSourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().optional(),
  generatedAt: z.string().min(1),
  notes: z.string().optional(),
  license: z.string().optional(),
});

export const ProviderSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  coverage: ProviderCoverageSchema,
  source: ProviderSourceSchema,
  materials: z.array(MaterialSchema).min(1),
  rulesSummary: RulesSummarySchema,
  locations: z.array(DropoffLocationSchema).optional(),
});

export const ScanOutputSchema = z.object({
  labels: z.array(z.string()),
  guessedItemName: z.string(),
  visionConfidence: z.number().min(0).max(1),
  notes: z.array(z.string()),
  textFound: z.string().optional(),
  materialComposition: z.string().optional(),
  productDescription: z.string().optional(),
  funnyResponse: z.string().optional(),
  isNotWaste: z.boolean().optional(),
});

export const ResolveOutputSchema = z.object({
  bestMaterialId: z.string().nullable(),
  alternatives: z.array(
    z.object({
      materialId: z.string(),
      score: z.number().min(0).max(1),
    })
  ),
  resolveConfidence: z.number().min(0).max(1),
  reasoning: z.array(z.string()),
});

export const SearchResultSchema = z.object({
  materialId: z.string(),
  name: z.string(),
  category: DisposalCategorySchema,
  score: z.number().min(0).max(1),
});
