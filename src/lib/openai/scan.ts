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

CRITICAL — WHEN TO USE "isNotWaste": true (use RARELY):
Only set "isNotWaste": true when the image shows something that CANNOT ever be disposed of in a bin (recycle/trash/compost). If someone can eventually throw it away or recycle it, it is WASTE — identify it and return disposal info.

NEVER set isNotWaste for: water bottles, plastic bottles, cans, cups, paper, cardboard, pencils, pens, packaging, wrappers, containers, food (even uneaten — identify as food/organics), books, mail, boxes, bags, or any other disposable/recyclable/compostable item. People use this app because they want to dispose of something — assume that intent. A water bottle (empty or full), a pencil, a sheet of paper, or a piece of packaging are ALWAYS waste items; identify them and return isNotWaste: false.

ONLY set isNotWaste: true for things that are literally not disposal items, e.g.:
- Person/selfie → "That's a whole human! Definitely not recyclable. Last time we checked, people belong outside the bin."
- Dog/cat/pet → "That's a good boy/girl, not garbage! Please do not recycle your pets. They have feelings."
- Car (entire vehicle in frame) → "That's a car. While technically it IS made of recyclable materials... maybe just drive it instead?"
- A living tree/plant outdoors (not cut flowers or potted plant you're disposing) → "That's a living tree! It's already doing the recycling — turning CO2 into oxygen. Leave it alone!"
- Landscape/scenery (no specific item) → "Beautiful view! But we can't recycle a sunset. Try pointing at an actual item."
- Baby/child → "Adorable! But babies are non-recyclable, non-compostable, and definitely not trash. Keep that one."
- Money → "That's money! Don't throw that away. If you don't want it, I'll take it."
- Computer screen showing this app → "Very meta. You're scanning the scanner. We need to go deeper."

When in doubt, treat the item as WASTE and identify it. Be funny only for the narrow cases above. Keep funny responses to 1-2 sentences max.

For NON-WASTE items, return:
{
  "labels": [],
  "guessedItemName": "",
  "visionConfidence": 0.95,
  "notes": [],
  "isNotWaste": true,
  "funnyResponse": "your funny line here",
  "productDescription": "what the image actually shows"
}

FOR ACTUAL WASTE ITEMS — follow these rules:

1. READ ALL VISIBLE TEXT — brand names, product titles, book titles, labels, ingredients lists, recycling symbols, warning labels, everything.

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

For WASTE items, return:
{
  "labels": ["disposal-relevant label 1", "label 2", "label 3"],
  "guessedItemName": "the best common waste disposal name for this item",
  "visionConfidence": 0.0 to 1.0,
  "notes": ["any helpful disposal context"],
  "textFound": "all readable text from the item (brand, title, labels) or empty string if none",
  "materialComposition": "what the item is physically made of",
  "productDescription": "brief specific description",
  "isNotWaste": false
}

If you cannot identify the item or the image is too blurry, return guessedItemName as "" and visionConfidence as 0.`,
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
              text: "Identify this item for waste disposal. If it's not a waste item, be funny about it. Respond in JSON only.",
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
