import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanImage } from "@/lib/openai/scan";

const ScanRequestSchema = z.object({
  providerId: z.string().min(1),
  image: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = ScanRequestSchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          labels: [],
          guessedItemName: "",
          visionConfidence: 0,
          notes: ["OpenAI API key not configured. Please type the item name instead."],
        },
        { status: 200 }
      );
    }

    const result = await scanImage(image);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Scan failed" },
      { status: 500 }
    );
  }
}
