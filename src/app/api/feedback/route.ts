import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const FeedbackSchema = z.object({
  providerId: z.string().min(1),
  query: z.string(),
  expectedCategory: z
    .enum(["recycle", "compost", "trash", "dropoff", "hazardous"])
    .optional(),
  reportedCategory: z
    .enum(["recycle", "compost", "trash", "dropoff", "hazardous"])
    .optional(),
  conceptId: z.string().optional(),
  materialId: z.string().optional(),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FeedbackSchema.parse(body);

    const entry = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    const feedbackDir = path.join(process.cwd(), "data", "feedback");
    const filePath = path.join(feedbackDir, "report-wrong.jsonl");
    await fs.mkdir(feedbackDir, { recursive: true });
    await fs.appendFile(filePath, JSON.stringify(entry) + "\n", "utf-8");

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid feedback", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Feedback error:", err);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
