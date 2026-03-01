import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateVoiceLine } from "@/lib/voice/reactions";

/** Two voices used 50/50 for variety. Mark + second premade. */
const VOICE_IDS = ["UgBBYS2sOqTuMpoF3BR0", "DLsHlh26Ugcm6ELvS0qi"] as const;

function pickVoiceId(): string {
  return VOICE_IDS[Math.random() < 0.5 ? 0 : 1];
}

const MAX_CACHE_ENTRIES = 50;

const VoiceRequestSchema = z.object({
  /** When set, speak this exact text (for scan funny line). Takes precedence over eventType. */
  text: z.string().max(200).optional(),
  eventType: z.enum(["scan_result", "correct_answer", "incorrect_answer", "lesson_complete"]).optional(),
  category: z.enum(["recycle", "trash", "compost", "dropoff", "hazardous", "unknown", "donate", "yard-waste", "deposit"]).optional(),
  streakCount: z.number().optional(),
  confidence: z.number().optional(),
  accuracy: z.number().optional(),
});

const cache = new Map<string, ArrayBuffer>();
const cacheOrder: string[] = [];

function getCached(key: string): ArrayBuffer | undefined {
  return cache.get(key);
}

function setCache(key: string, buffer: ArrayBuffer) {
  if (cacheOrder.length >= MAX_CACHE_ENTRIES) {
    const oldest = cacheOrder.shift();
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, buffer);
  cacheOrder.push(key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VoiceRequestSchema.parse(body);

    const apiKey = process.env.ELEVENLABS_KEY;
    if (!apiKey) {
      return new NextResponse(null, { status: 503 });
    }

    const text = parsed.text ?? generateVoiceLine({
      eventType: parsed.eventType ?? "scan_result",
      category: parsed.category,
      streakCount: parsed.streakCount,
      confidence: parsed.confidence,
      accuracy: parsed.accuracy,
    });

    const voiceId = process.env.ELEVENLABS_VOICE_ID ?? pickVoiceId();
    const hasAudioTags = text.includes("[");
    const modelId = hasAudioTags ? "eleven_v3" : "eleven_multilingual_v2";
    const cacheKey = `${voiceId}:${modelId}:${text}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new NextResponse(cached, {
        headers: { "Content-Type": "audio/mpeg" },
      });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const payload: Record<string, unknown> = {
      text,
      model_id: modelId,
      voice_settings: {
        stability: hasAudioTags ? 0.35 : 0.4,
        similarity_boost: 0.7,
        style: hasAudioTags ? 0.75 : 0.6,
        use_speaker_boost: true,
      },
    };
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && hasAudioTags) {
      const textStripped = text.replace(/\s*\[[^\]]*\]\s*/g, " ").replace(/\s+/g, " ").trim();
      if (textStripped) {
        payload.text = textStripped;
        payload.model_id = "eleven_multilingual_v2";
        (payload.voice_settings as Record<string, number | boolean>) = {
          stability: 0.4,
          similarity_boost: 0.7,
          style: 0.6,
          use_speaker_boost: true,
        };
        const fallbackKey = `${voiceId}:eleven_multilingual_v2:${textStripped}`;
        const cachedFallback = getCached(fallbackKey);
        if (cachedFallback) {
          return new NextResponse(cachedFallback, { headers: { "Content-Type": "audio/mpeg" } });
        }
        response = await fetch(url, {
          method: "POST",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          setCache(fallbackKey, buffer);
          return new NextResponse(buffer, { headers: { "Content-Type": "audio/mpeg" } });
        }
      }
    }

    if (!response.ok) {
      console.error("ElevenLabs TTS error:", response.status, await response.text());
      return new NextResponse(null, { status: 503 });
    }

    const buffer = await response.arrayBuffer();
    setCache(cacheKey, buffer);

    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Voice API error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
