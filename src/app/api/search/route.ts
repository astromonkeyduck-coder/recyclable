import { NextRequest, NextResponse } from "next/server";
import { loadProvider } from "@/lib/providers/registry";
import { searchMaterials } from "@/lib/matching/engine";

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[]);
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function getSuggestions(query: string, names: string[], limit = 3): string[] {
  const q = query.toLowerCase();
  const maxDist = Math.max(2, Math.floor(q.length * 0.4));

  return names
    .map((name) => ({ name, dist: levenshtein(q, name.toLowerCase()) }))
    .filter((r) => r.dist <= maxDist && r.dist > 0)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map((r) => r.name);
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const providerId = req.nextUrl.searchParams.get("provider") ?? "general";

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  try {
    const provider = await loadProvider(providerId);
    const results = searchMaterials(provider, q, 8);

    const data = results.map((r) => ({
      materialId: r.material.id,
      name: r.material.name,
      category: r.material.category,
      score: r.score,
    }));

    if (data.length === 0) {
      const allNames = provider.materials.map((m) => m.name);
      const suggestions = getSuggestions(q, allNames);
      return NextResponse.json(
        { results: [], suggestions },
        { headers: { "Cache-Control": "public, max-age=300, s-maxage=600" } }
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=600" },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
