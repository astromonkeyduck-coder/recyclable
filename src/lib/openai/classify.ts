import { z } from "zod";
import { getOpenAIClient, getTextModel } from "./client";
import { DisposalCategorySchema } from "@/lib/providers/schemas";
import type { Provider, Material } from "@/lib/providers/types";

export const ClassifyOutputSchema = z.object({
  category: DisposalCategorySchema,
  confidence: z.number().min(0).max(1),
  itemName: z.string(),
  instructions: z.array(z.string()).min(1),
  notes: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  reasoning: z.string(),
});

export type ClassifyOutput = z.infer<typeof ClassifyOutputSchema>;

/**
 * Smart classify: asks GPT to reason about ANY item from scratch
 * using the provider's rules as context. This is the last resort
 * when deterministic matching and material-ID matching both fail.
 *
 * Returns a synthetic Material object that can be displayed directly.
 */
export async function aiClassify(
  provider: Provider,
  itemQuery: string
): Promise<ClassifyOutput | null> {
  const client = getOpenAIClient();

  const rulesContext = buildRulesContext(provider);

  try {
    const response = await client.chat.completions.create({
      model: getTextModel(),
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a waste disposal expert. A user wants to know how to dispose of a specific item.

You have the recycling/disposal rules for "${provider.displayName}":

${rulesContext}

Given the user's item, determine the correct disposal category and provide clear instructions.

RULES:
- Think step by step: What is the item made of? What material category does it fall under?
- A "Snickers wrapper" is a candy wrapper, which is a food-contaminated flexible plastic film → TRASH
- A "Doritos bag" is a chip bag (metallized film) → TRASH  
- A "wine bottle" is a glass bottle → RECYCLE
- Apply this same reasoning to ANY item the user asks about.
- If the item could reasonably fit into one of the rules, classify it confidently.
- When an item could be dirty, broken, or worn out (e.g. shoes, clothing), prefer trash or a "worn-out" disposal option when the user implies disposal intent, unless the provider explicitly forbids trash for that item.
- Only use "unknown" if the item is truly ambiguous or nonsensical.
- Be specific to ${provider.displayName} rules when possible.

Return STRICT JSON:
{
  "category": "recycle" | "trash" | "compost" | "dropoff" | "hazardous" | "unknown",
  "confidence": 0.0-1.0 (how sure you are),
  "itemName": "clean display name for the item",
  "instructions": ["step 1", "step 2", ...],
  "notes": ["helpful context"],
  "commonMistakes": ["things people get wrong with this item"],
  "reasoning": "one sentence explaining your logic"
}`,
        },
        {
          role: "user",
          content: `How should I dispose of: "${itemQuery}"`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return ClassifyOutputSchema.parse(parsed);
  } catch (error) {
    console.error("AI classify failed:", error);
    return null;
  }
}

function buildRulesContext(provider: Provider): string {
  const lines: string[] = [];

  const { accepted, notAccepted, tips } = provider.rulesSummary;

  lines.push("ACCEPTED IN RECYCLING:");
  accepted.recycle.forEach((r) => lines.push(`  - ${r}`));

  if (accepted.compost?.length) {
    lines.push("\nACCEPTED IN COMPOSTING:");
    accepted.compost.forEach((c) => lines.push(`  - ${c}`));
  }

  if (accepted.trash?.length) {
    lines.push("\nGOES IN TRASH:");
    accepted.trash.forEach((t) => lines.push(`  - ${t}`));
  }

  lines.push("\nNOT ACCEPTED IN RECYCLING:");
  notAccepted.recycle.forEach((r) => lines.push(`  - ${r}`));

  if (notAccepted.compost?.length) {
    lines.push("\nNOT ACCEPTED IN COMPOSTING:");
    notAccepted.compost.forEach((c) => lines.push(`  - ${c}`));
  }

  lines.push("\nKNOWN MATERIALS:");
  provider.materials.forEach((m) => {
    lines.push(`  - ${m.name} → ${m.category.toUpperCase()}`);
  });

  if (tips.length) {
    lines.push("\nTIPS:");
    tips.forEach((t) => lines.push(`  - ${t}`));
  }

  return lines.join("\n");
}

/**
 * Converts a ClassifyOutput into a Material object that
 * the result page can display just like any provider material.
 */
export function classifyOutputToMaterial(
  output: ClassifyOutput,
  itemQuery: string
): Material {
  return {
    id: `ai-classified-${itemQuery.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: output.itemName,
    aliases: [itemQuery],
    category: output.category,
    instructions: output.instructions,
    notes: [...output.notes, `AI-assisted classification: ${output.reasoning}`],
    commonMistakes: output.commonMistakes,
    tags: ["ai-classified"],
  };
}
