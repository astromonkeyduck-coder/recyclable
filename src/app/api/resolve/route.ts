import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loadProvider } from "@/lib/providers/registry";
import { matchMaterial } from "@/lib/matching/engine";
import { aiResolve } from "@/lib/openai/resolve";
import { blendConfidence, CONFIDENCE_THRESHOLD } from "@/lib/utils/confidence";

const ResolveRequestSchema = z.object({
  providerId: z.string().min(1),
  guessedItemName: z.string(),
  labels: z.array(z.string()),
  visionConfidence: z.number().min(0).max(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { providerId, guessedItemName, labels, visionConfidence } =
      ResolveRequestSchema.parse(body);

    const provider = await loadProvider(providerId);

    // Step 1: Deterministic matching on guessedItemName and each label
    const queries = [guessedItemName, ...labels].filter(Boolean);
    let bestDeterministic = matchMaterial(provider, queries[0] || "");

    for (const q of queries.slice(1)) {
      const result = matchMaterial(provider, q);
      if (result.confidence > bestDeterministic.confidence) {
        bestDeterministic = result;
      }
    }

    // Step 2: If deterministic confidence is low, try AI resolve (if available)
    let aiResult = null;
    if (
      bestDeterministic.confidence < 0.8 &&
      process.env.OPENAI_API_KEY &&
      guessedItemName
    ) {
      try {
        aiResult = await aiResolve(provider, guessedItemName, labels);

        // If AI found a match, verify it exists in our materials
        if (aiResult.bestMaterialId) {
          const aiMaterial = provider.materials.find(
            (m) => m.id === aiResult!.bestMaterialId
          );
          if (aiMaterial && aiResult.resolveConfidence > bestDeterministic.confidence) {
            bestDeterministic = {
              best: aiMaterial,
              matches: [
                { material: aiMaterial, score: aiResult.resolveConfidence },
                ...bestDeterministic.matches.filter(
                  (m) => m.material.id !== aiMaterial.id
                ),
              ],
              confidence: aiResult.resolveConfidence,
              rationale: [
                ...bestDeterministic.rationale,
                ...aiResult.reasoning,
              ],
            };
          }
        }
      } catch {
        // AI resolve failed — use deterministic results only
      }
    }

    // Step 3: Blend confidences
    const finalConfidence = blendConfidence(
      bestDeterministic.confidence,
      visionConfidence,
      aiResult?.resolveConfidence
    );

    const isUnknown =
      finalConfidence < CONFIDENCE_THRESHOLD || !bestDeterministic.best;

    return NextResponse.json({
      best: isUnknown ? null : bestDeterministic.best,
      matches: bestDeterministic.matches,
      confidence: finalConfidence,
      rationale: bestDeterministic.rationale,
      providerName: provider.displayName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Resolve error:", error);
    return NextResponse.json(
      { error: "Resolve failed" },
      { status: 500 }
    );
  }
}
