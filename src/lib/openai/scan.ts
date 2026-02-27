import { getOpenAIClient, getVisionModel } from "./client";
import { ScanOutputSchema } from "@/lib/providers/schemas";
import type { z } from "zod";

export type ScanOutput = z.infer<typeof ScanOutputSchema>;

export async function scanImage(imageBase64: string): Promise<ScanOutput> {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: getVisionModel(),
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a waste identification assistant. Given an image, identify the waste item(s) shown.
Return STRICT JSON with this exact shape:
{
  "labels": ["label1", "label2"],
  "guessedItemName": "best single name for the item",
  "visionConfidence": 0.0 to 1.0,
  "notes": ["any relevant notes"]
}
If you cannot identify the item or the image is unclear, return guessedItemName as "" and visionConfidence as 0.
Prefer common waste disposal names (e.g. "plastic bottle", "cardboard box", "AA battery").`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "low" },
            },
            {
              type: "text",
              text: "What waste item is this? Respond in JSON only.",
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return fallbackScanOutput("No response from vision model");
    }

    const parsed = JSON.parse(content);
    return ScanOutputSchema.parse(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vision scan failed";
    return fallbackScanOutput(message);
  }
}

function fallbackScanOutput(reason: string): ScanOutput {
  return {
    labels: [],
    guessedItemName: "",
    visionConfidence: 0,
    notes: [`Could not identify item: ${reason}`, "Please try typing the item name instead."],
  };
}
