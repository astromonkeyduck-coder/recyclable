import { getOpenAIClient, getTextModel } from "./client";
import { ResolveOutputSchema } from "@/lib/providers/schemas";
import type { Provider } from "@/lib/providers/types";
import type { z } from "zod";

export type ResolveOutput = z.infer<typeof ResolveOutputSchema>;

export async function aiResolve(
  provider: Provider,
  guessedItemName: string,
  labels: string[]
): Promise<ResolveOutput> {
  const client = getOpenAIClient();

  const materialList = provider.materials
    .map((m) => `- ${m.id}: ${m.name} [${m.category}] (aliases: ${m.aliases.slice(0, 5).join(", ")})`)
    .join("\n");

  try {
    const response = await client.chat.completions.create({
      model: getTextModel(),
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a waste item classifier. Match the user's item to the BEST material from this provider's list.

Available materials for "${provider.displayName}":
${materialList}

MATCHING RULES:
- Think about what the item is MADE OF, not just its name.
- "Snickers wrapper" → it's a candy wrapper (flexible plastic film) → match to "plastic-bags" or similar trash category
- "Doritos bag" → chip bag (metallized plastic) → trash
- "Amazon box" → cardboard → match to "cardboard"  
- "iPhone" → electronics → match to "electronics"
- "used napkin" → paper towel/napkin → match to "paper-towels" or compost
- When an item could be dirty, broken, or worn out (e.g. shoes, clothing), prefer matching to a trash or "worn-out" disposal option when the user implies disposal intent, unless the provider explicitly forbids trash for that item.
- Be AGGRESSIVE about matching. Most real-world items CAN be mapped to one of these materials.
- Only return null for bestMaterialId if the item is truly unrecognizable or nonsensical.

Return STRICT JSON:
{
  "bestMaterialId": "material-id from the list above, or null only if truly unmatchable",
  "alternatives": [{"materialId": "id", "score": 0.0-1.0}],
  "resolveConfidence": 0.0-1.0,
  "reasoning": ["why this match makes sense"]
}`,
        },
        {
          role: "user",
          content: `Item: "${guessedItemName}"\nLabels: ${JSON.stringify(labels)}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return fallbackResolveOutput("No response from model");
    }

    const parsed = JSON.parse(content);
    return ResolveOutputSchema.parse(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resolve failed";
    return fallbackResolveOutput(message);
  }
}

function fallbackResolveOutput(reason: string): ResolveOutput {
  return {
    bestMaterialId: null,
    alternatives: [],
    resolveConfidence: 0,
    reasoning: [`AI resolve unavailable: ${reason}`],
  };
}
