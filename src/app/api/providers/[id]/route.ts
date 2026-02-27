import { NextRequest, NextResponse } from "next/server";
import { loadProvider } from "@/lib/providers/registry";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const provider = await loadProvider(id);
    return NextResponse.json(provider, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
  } catch (error) {
    console.error("Provider load error:", error);
    return NextResponse.json(
      { error: "Provider not found" },
      { status: 404 }
    );
  }
}
