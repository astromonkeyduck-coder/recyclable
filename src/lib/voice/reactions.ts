/**
 * Deterministic voice reaction lines for scan results and game events.
 * All lines are under 12 words. No AI; no randomness.
 */

export type VoiceEventType =
  | "scan_result"
  | "correct_answer"
  | "incorrect_answer"
  | "lesson_complete";

export type VoiceLineCategory =
  | "recycle"
  | "trash"
  | "compost"
  | "dropoff"
  | "hazardous"
  | "unknown";

export type VoiceLineParams = {
  eventType: VoiceEventType;
  category?: VoiceLineCategory;
  streakCount?: number;
  confidence?: number;
  accuracy?: number;
};

const SCAN_LINES: Record<VoiceLineCategory, string> = {
  recycle: "That one's good to recycle.",
  trash: "That goes in the trash.",
  compost: "That can go in compost.",
  dropoff: "That needs special drop-off.",
  hazardous: "Handle that carefully.",
  unknown: "I'm not fully sure on that one.",
};

export function generateVoiceLine(params: VoiceLineParams): string {
  const { eventType, category, streakCount = 0, confidence = 0, accuracy = 0 } = params;

  switch (eventType) {
    case "scan_result": {
      const cat = category ?? "unknown";
      return SCAN_LINES[cat];
    }

    case "correct_answer": {
      if (streakCount >= 5) return "Impressive streak.";
      if (streakCount >= 3) return "You're on a roll.";
      return "Nice one.";
    }

    case "incorrect_answer": {
      if (confidence < 0.4) return "Close, but not this time.";
      return "Not quite.";
    }

    case "lesson_complete": {
      if (accuracy >= 85) return "Strong finish.";
      return "Lesson complete.";
    }

    default:
      return "Nice one.";
  }
}
