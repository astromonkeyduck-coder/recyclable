/**
 * Pre-generates static OG fallback images per category + page variant.
 * These live at /public/og/{name}.png and serve as reliable fallbacks
 * if the dynamic /api/og edge function is unavailable.
 *
 * Run: npx tsx scripts/generate-og-fallbacks.ts
 * Requires the dev server to be running on localhost:3000.
 */
import fs from "fs";
import path from "path";

type Entry = {
  name: string;
  params: Record<string, string>;
};

const ENTRIES: Entry[] = [
  // Category result cards
  { name: "recycle", params: { category: "recycle", item: "Recyclable Item", loc: "Your area", confidence: "90" } },
  { name: "trash", params: { category: "trash", item: "Trash Item", loc: "Your area", confidence: "90" } },
  { name: "compost", params: { category: "compost", item: "Compostable Item", loc: "Your area", confidence: "90" } },
  { name: "dropoff", params: { category: "dropoff", item: "Drop-off Required", loc: "Your area", confidence: "90" } },
  { name: "hazardous", params: { category: "hazardous", item: "Hazardous Waste", loc: "Your area", confidence: "90" } },
  { name: "unknown", params: { category: "unknown", item: "Unknown Item", loc: "Your area", confidence: "20" } },

  // Homepage
  { name: "default", params: { variant: "homepage" } },

  // Page variants
  { name: "about", params: { variant: "about" } },
  { name: "faq", params: { variant: "faq" } },
  { name: "games", params: { variant: "games" } },
  { name: "facilities", params: { variant: "facilities" } },
  { name: "privacy", params: { variant: "privacy" } },
];

async function main() {
  const outDir = path.join(process.cwd(), "public", "og");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

  for (const entry of ENTRIES) {
    const sp = new URLSearchParams(entry.params);
    const url = `${baseUrl}/api/og?${sp.toString()}`;

    console.log(`Fetching: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  Failed (${res.status}): ${entry.name}`);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const outPath = path.join(outDir, `${entry.name}.png`);
      fs.writeFileSync(outPath, buffer);
      console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  Error for ${entry.name}:`, err);
    }
  }

  console.log("\nDone! Static OG fallbacks generated in /public/og/");
}

main();
