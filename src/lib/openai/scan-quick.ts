import { getOpenAIClient, getVisionModel } from "./client";

/**
 * Fast vision pass: one short funny line about the image for voice during scan.
 * Kept minimal (low max_tokens) so it returns as soon as possible.
 */
export async function scanImageQuickFunny(imageBase64: string): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: getVisionModel(),
    max_tokens: 60,
    messages: [
      {
        role: "system",
        content: `You see a photo someone took to check how to dispose of something. Reply with ONLY one short, witty or funny sentence (under 12 words) about what's in the image. Relate to recycling, trash, bins, or disposal when you can. Be warm, a bit silly, and clever — puns and light humor welcome. No JSON, no quotes, no explanation — just the single sentence.`,
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
            text: "One short funny line about this image.",
          },
        ],
      },
    ],
  });

  const line = response.choices[0]?.message?.content?.trim() ?? "";
  return line.slice(0, 150);
}
