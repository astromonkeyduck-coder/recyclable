import { NextRequest, NextResponse } from "next/server";
import { loadProvider } from "@/lib/providers/registry";
import { searchMaterials } from "@/lib/matching/engine";

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
