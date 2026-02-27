import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loadProvider } from "@/lib/providers/registry";
import { matchMaterial } from "@/lib/matching/engine";
import { aiResolve } from "@/lib/openai/resolve";
import { aiClassify, classifyOutputToMaterial } from "@/lib/openai/classify";
import { blendConfidence, CONFIDENCE_THRESHOLD } from "@/lib/utils/confidence";
import type { MatchResult } from "@/lib/providers/types";

const ResolveRequestSchema = z.object({
  providerId: z.string().min(1),
  guessedItemName: z.string(),
  labels: z.array(z.string()),
  visionConfidence: z.number().min(0).max(1).optional(),
});

/**
 * Three-tier intelligence pipeline:
 *
 * TIER 1: Deterministic matching (instant, no API call)
 *   - Exact name/alias match, fuzzy search, trigrams
 *   - If confidence >= 0.7, return immediately
 *
 * TIER 2: AI-assisted material matching (fast GPT call)
 *   - Asks GPT to map the item to one of the provider's known materials
 *   - "Snickers wrapper" → maps to "plastic-bags" material
 *   - If GPT finds a match, use that material's rules
 *
 * TIER 3: AI smart classify (reasoning from scratch)
 *   - When the item doesn't match ANY known material
 *   - Asks GPT to reason about the item using the provider's rules
 *   - Generates a full synthetic result with instructions
 *   - "Candy wrapper" → GPT reasons it's flexible plastic → TRASH
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { providerId, guessedItemName, labels, visionConfidence } =
      ResolveRequestSchema.parse(body);

    const provider = await loadProvider(providerId);
    const hasAI = !!process.env.OPENAI_API_KEY;

    // === TIER 1: Deterministic matching ===
    const queries = [guessedItemName, ...labels].filter(Boolean);
    let bestResult: MatchResult = matchMaterial(provider, queries[0] || "");

    for (const q of queries.slice(1)) {
      const result = matchMaterial(provider, q);
      if (result.confidence > bestResult.confidence) {
        bestResult = result;
      }
    }

    // If deterministic match is strong, return immediately
    if (bestResult.confidence >= 0.7 && bestResult.best) {
      const finalConfidence = blendConfidence(
        bestResult.confidence,
        visionConfidence
      );
      return NextResponse.json({
        best: bestResult.best,
        matches: bestResult.matches,
        confidence: finalConfidence,
        rationale: [...bestResult.rationale, "Matched via local rules database"],
        providerName: provider.displayName,
      });
    }

    // === TIER 2: AI-assisted material matching ===
    if (hasAI && guessedItemName) {
      try {
        const aiResult = await aiResolve(provider, guessedItemName, labels);

        if (aiResult.bestMaterialId) {
          const aiMaterial = provider.materials.find(
            (m) => m.id === aiResult.bestMaterialId
          );
          if (aiMaterial) {
            const finalConfidence = blendConfidence(
              Math.max(bestResult.confidence, 0.3),
              visionConfidence,
              aiResult.resolveConfidence
            );

            return NextResponse.json({
              best: aiMaterial,
              matches: [
                { material: aiMaterial, score: aiResult.resolveConfidence },
                ...bestResult.matches.filter(
                  (m) => m.material.id !== aiMaterial.id
                ),
              ],
              confidence: finalConfidence,
              rationale: [
                ...bestResult.rationale,
                ...aiResult.reasoning,
                "Matched via AI-assisted material lookup",
              ],
              providerName: provider.displayName,
            });
          }
        }
      } catch {
        // Tier 2 failed, fall through to Tier 3
      }
    }

    // === TIER 3: AI smart classify (reason from scratch) ===
    if (hasAI && guessedItemName) {
      try {
        const classified = await aiClassify(provider, guessedItemName);

        if (classified && classified.category !== "unknown") {
          const syntheticMaterial = classifyOutputToMaterial(
            classified,
            guessedItemName
          );

          const finalConfidence = blendConfidence(
            classified.confidence * 0.85, // slight penalty for synthetic
            visionConfidence,
            classified.confidence
          );

          return NextResponse.json({
            best: syntheticMaterial,
            matches: [
              { material: syntheticMaterial, score: classified.confidence },
              ...bestResult.matches,
            ],
            confidence: finalConfidence,
            rationale: [
              ...bestResult.rationale,
              classified.reasoning,
              `AI classified "${guessedItemName}" as ${classified.category.toUpperCase()} based on ${provider.displayName} rules`,
            ],
            providerName: provider.displayName,
          });
        }
      } catch {
        // Tier 3 failed, fall through to unknown
      }
    }

    // === FALLBACK: Unknown ===
    const finalConfidence = blendConfidence(
      bestResult.confidence,
      visionConfidence
    );

    const isUnknown =
      finalConfidence < CONFIDENCE_THRESHOLD || !bestResult.best;

    return NextResponse.json({
      best: isUnknown ? null : bestResult.best,
      matches: bestResult.matches,
      confidence: finalConfidence,
      rationale: [
        ...bestResult.rationale,
        ...(hasAI
          ? []
          : [
              "Set OPENAI_API_KEY for smarter item recognition",
            ]),
      ],
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
