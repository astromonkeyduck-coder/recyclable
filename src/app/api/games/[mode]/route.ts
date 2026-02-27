import { NextRequest, NextResponse } from "next/server";
import { loadGameMode } from "@/lib/games/loader";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mode: string }> }
) {
  try {
    const { mode } = await params;
    const data = await loadGameMode(mode);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Game mode not found" }, { status: 404 });
  }
}
