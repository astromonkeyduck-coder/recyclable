import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { classify } from "@/lib/classify/engine";

const DebugClassifySchema = z.object({
  q: z.string().min(1),
  labels: z.array(z.string()).optional(),
  followupAnswer: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const labelsParam = req.nextUrl.searchParams.get("labels");
  const followupAnswer = req.nextUrl.searchParams.get("followupAnswer") ?? undefined;
  if (!q) {
    return NextResponse.json(
      { error: "Missing query param: q" },
      { status: 400 }
    );
  }
  const labels = labelsParam ? (JSON.parse(labelsParam) as string[]) : undefined;
  const parsed = DebugClassifySchema.safeParse({ q, labels, followupAnswer });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid params", details: parsed.error.issues },
      { status: 400 }
    );
  }
  try {
    const result = await classify({
      query: parsed.data.q,
      labels: parsed.data.labels,
      followupAnswer: parsed.data.followupAnswer,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Debug classify error:", err);
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DebugClassifySchema.parse(body);
    const result = await classify({
      query: parsed.q,
      labels: parsed.labels,
      followupAnswer: parsed.followupAnswer,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid body", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Debug classify error:", err);
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 }
    );
  }
}
