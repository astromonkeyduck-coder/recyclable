import { getOpenAIClient, getVisionModel } from "./client";
import { ScanOutputSchema } from "@/lib/providers/schemas";
import type { z } from "zod";

export type ScanOutput = z.infer<typeof ScanOutputSchema>;

export async function scanImage(imageBase64: string): Promise<ScanOutput> {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: getVisionModel(),
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an advanced waste item identification system with OCR and product recognition capabilities.

When given an image, you must:

1. READ ALL VISIBLE TEXT — brand names, product titles, book titles, labels, ingredients lists, recycling symbols, warning labels, everything. This is critical for identification.

2. IDENTIFY THE SPECIFIC PRODUCT — not just "a book" but "a paperback copy of The Great Gatsby" or not just "a wrapper" but "a Snickers candy bar wrapper". Be as specific as the text and visual cues allow.

3. DETERMINE THE MATERIAL COMPOSITION — what is this object physically made of?
   - A book = paper pages + cardboard cover (possibly with glossy coating)
   - A Snickers wrapper = metallized plastic film (non-recyclable flexible packaging)
   - A Starbucks cup = paper with polyethylene lining
   - A wine bottle = glass
   - An Amazon box = corrugated cardboard with tape

4. MAP TO A WASTE DISPOSAL NAME — translate your identification into the common waste disposal term:
   - "Snickers wrapper" → "candy wrapper" or "food wrapper" or "plastic film"
   - "Harry Potter book" → "book" or "paperback book"
   - "Coca-Cola can" → "aluminum can"
   - "Tropicana carton" → "juice carton"

EXAMPLES of good identification:
- Image of a Doritos bag → textFound: "Doritos Nacho Cheese", guessedItemName: "chip bag", materialComposition: "metallized plastic film", labels: ["chip bag", "snack bag", "flexible plastic packaging", "food wrapper"]
- Image of a hardcover book → textFound: "To Kill a Mockingbird by Harper Lee", guessedItemName: "hardcover book", materialComposition: "paper pages, cardboard cover, cloth binding", labels: ["book", "hardcover book", "paper"]
- Image of a Starbucks cup → textFound: "Starbucks", guessedItemName: "disposable coffee cup", materialComposition: "paper with plastic lining", labels: ["coffee cup", "paper cup", "disposable cup", "lined paper cup"]

Return STRICT JSON:
{
  "labels": ["disposal-relevant label 1", "label 2", "label 3"],
  "guessedItemName": "the best common waste disposal name for this item",
  "visionConfidence": 0.0 to 1.0,
  "notes": ["any helpful disposal context"],
  "textFound": "all readable text from the item (brand, title, labels) or empty string if none",
  "materialComposition": "what the item is physically made of",
  "productDescription": "brief specific description like 'Snickers candy bar wrapper' or 'hardcover copy of 1984 by George Orwell'"
}

If you cannot identify the item or the image is too blurry, return guessedItemName as "" and visionConfidence as 0. But TRY HARD — even a partial read of text or a guess at material is better than nothing.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "high" },
            },
            {
              type: "text",
              text: "Identify this item for waste disposal. Read any visible text, identify the product, and determine what material it's made of. Respond in JSON only.",
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
