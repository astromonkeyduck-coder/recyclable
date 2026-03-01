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
      const fallbacks = [
        "Checking what you got there...",
        "Let me get a closer look.",
        "One sec. Peeking at your pile.",
      ];
      return NextResponse.json(
        { line: fallbacks[Math.floor(Math.random() * fallbacks.length)] },
        { status: 200 }
      );
    }

    const line = await scanImageQuickFunny(image);
    const wittyFallbacks = [
      "Let me get a closer look.",
      "Ooh, scanning...",
      "Interesting. Running it through the bin-o-meter.",
      "Hold on. Consulting the waste gods.",
    ];
    return NextResponse.json({
      line: line?.trim() || wittyFallbacks[Math.floor(Math.random() * wittyFallbacks.length)],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
    }
    console.error("Scan-quick error:", error);
    const fallbacks = [
      "Ooh, scanning...",
      "Something went sideways. Still figuring it out.",
      "The scanner blinked. Try again in a sec.",
    ];
    return NextResponse.json(
      { line: fallbacks[Math.floor(Math.random() * fallbacks.length)] },
      { status: 200 }
    );
  }
}
