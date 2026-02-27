import { NextResponse } from "next/server";
import { listProviders } from "@/lib/providers/registry";

export async function GET() {
  try {
    const providers = await listProviders();
    return NextResponse.json(providers);
  } catch (error) {
    console.error("Failed to list providers:", error);
    return NextResponse.json(
      { error: "Failed to load providers" },
      { status: 500 }
    );
  }
}
