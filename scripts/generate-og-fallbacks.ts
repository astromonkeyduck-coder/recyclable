/**
 * Pre-generates static OG fallback images per category.
 * These live at /public/og/{category}.png and serve as reliable fallbacks
 * if the dynamic /api/og edge function is unavailable.
 *
 * Run: npx tsx scripts/generate-og-fallbacks.ts
 * Requires the dev server to be running on localhost:3000.
 */
import fs from "fs";
import path from "path";

const CATEGORIES = [
  { category: "recycle", item: "Recyclable Item", loc: "Your area", confidence: 90 },
  { category: "trash", item: "Trash Item", loc: "Your area", confidence: 90 },
  { category: "compost", item: "Compostable Item", loc: "Your area", confidence: 90 },
  { category: "dropoff", item: "Drop-off Required", loc: "Your area", confidence: 90 },
  { category: "hazardous", item: "Hazardous Waste", loc: "Your area", confidence: 90 },
  { category: "unknown", item: "Unknown Item", loc: "Your area", confidence: 20 },
  { category: "recycle", item: "Is this recyclable?", loc: "Your area", confidence: 0 },
];

async function main() {
  const outDir = path.join(process.cwd(), "public", "og");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

  for (const entry of CATEGORIES) {
    const params = new URLSearchParams({
      category: entry.category,
      item: entry.item,
      loc: entry.loc,
      confidence: String(entry.confidence),
    });

    const fileName =
      entry.item === "Is this recyclable?" ? "default" : entry.category;
    const url = `${baseUrl}/api/og?${params.toString()}`;

    console.log(`Fetching: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  Failed (${res.status}): ${fileName}`);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const outPath = path.join(outDir, `${fileName}.png`);
      fs.writeFileSync(outPath, buffer);
      console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  Error for ${fileName}:`, err);
    }
  }

  console.log("\nDone! Static OG fallbacks generated in /public/og/");
}

main();
