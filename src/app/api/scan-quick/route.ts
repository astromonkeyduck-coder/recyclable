import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanImageQuickFunny } from "@/lib/openai/scan-quick";

const BodySchema = z.object({
  image: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = BodySchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ line: "Checking what you got there..." }, { status: 200 });
    }

    const line = await scanImageQuickFunny(image);
    return NextResponse.json({ line: line || "Let me get a closer look." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }
    console.error("Scan-quick error:", error);
    return NextResponse.json({ line: "Ooh, scanning..." }, { status: 200 });
  }
}
