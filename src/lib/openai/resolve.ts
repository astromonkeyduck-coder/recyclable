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
    .map((m) => `- ${m.id}: ${m.name} (${m.category})`)
    .join("\n");

  try {
    const response = await client.chat.completions.create({
      model: getTextModel(),
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You help match waste items to a known material list. Given an item name and labels, find the BEST match from the provider's materials.

Available materials for "${provider.displayName}":
${materialList}

Return STRICT JSON:
{
  "bestMaterialId": "material-id or null if no good match",
  "alternatives": [{"materialId": "id", "score": 0.0-1.0}],
  "resolveConfidence": 0.0-1.0,
  "reasoning": ["why this match"]
}
Prefer null over guessing. Only return bestMaterialId if you're reasonably confident.`,
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
