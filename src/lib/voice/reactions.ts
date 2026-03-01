/**
 * Voice reaction lines for scan results and game events.
 * Short, witty variants with ElevenLabs-style audio tags for expression.
 * Tags: [excited], [playfully], [cheerfully], [warmly], [laughs], [gently], [resigned], etc.
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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const SCAN_LINES: Record<VoiceLineCategory, string[]> = {
  recycle: [
    "[cheerfully] That one's good to recycle.",
    "[excited] Green light for the blue bin!",
    "[warmly] Recycle win. Second life incoming.",
    "[playfully] The bin will thank you.",
  ],
  trash: [
    "[warmly] That goes in the trash.",
    "[cheerfully] Trash can's waiting.",
    "[playfully] One-way trip to the bin.",
    "[gently] Not this bin. The other one.",
  ],
  compost: [
    "[cheerfully] That can go in compost.",
    "[excited] Compost will love it!",
    "[warmly] Feed the soil, not the landfill.",
    "[playfully] Future dirt. Nice.",
  ],
  dropoff: [
    "[warmly] That needs special drop-off.",
    "[gently] Special trip for this one.",
    "[cheerfully] Don't bin it. Drop it off.",
    "[resigned tone] The kind that needs a dedicated run.",
  ],
  hazardous: [
    "[gently] Handle that carefully.",
    "[warmly] No regular bins for this one.",
    "[seriously] Hazardous. Treat it with respect.",
    "[gently] Special handling required.",
  ],
  unknown: [
    "[hesitates] I'm not fully sure on that one.",
    "[gently] Hmm. When in doubt, check locally.",
    "[resigned tone] My confidence is low on this one.",
    "[warmly] Could go either way. Check your area.",
  ],
};

const CORRECT_LINES = [
  "[cheerfully] Nice one!",
  "[excited] Nailed it!",
  "[playfully] You know your bins.",
  "[excited] Correct. The bins approve!",
  "[cheerfully] Bingo!",
];
const STREAK_3_LINES = [
  "[excited] You're on a roll!",
  "[cheerfully] Three in a row. Nice!",
  "[excited] Streak mode activated!",
];
const STREAK_5_LINES = [
  "[excited] Impressive streak!",
  "[excited] Five in a row. Legend!",
  "[playfully] The bins bow to you.",
];

const INCORRECT_LINES = [
  "[gently] Not quite.",
  "[playfully] The bin disagrees.",
  "[warmly] Wrong container. So close!",
  "[cheerfully] Oops. Other bin.",
];
const INCORRECT_CLOSE_LINES = [
  "[warmly] Close, but not this time.",
  "[gently] Almost. Wrong bin though.",
  "[cheerfully] So close. Wrong one.",
];

const LESSON_COMPLETE_LINES = [
  "[warmly] Lesson complete.",
  "[cheerfully] Class dismissed. You're ready!",
  "[playfully] Done. Go forth and sort.",
];
const LESSON_STRONG_LINES = [
  "[excited] Strong finish!",
  "[excited] Graduated with honors!",
  "[cheerfully] You crushed it!",
];

export function generateVoiceLine(params: VoiceLineParams): string {
  const { eventType, category, streakCount = 0, confidence = 0, accuracy = 0 } = params;

  switch (eventType) {
    case "scan_result": {
      const cat = category ?? "unknown";
      return pick(SCAN_LINES[cat]);
    }

    case "correct_answer": {
      if (streakCount >= 5) return pick(STREAK_5_LINES);
      if (streakCount >= 3) return pick(STREAK_3_LINES);
      return pick(CORRECT_LINES);
    }

    case "incorrect_answer": {
      if (confidence < 0.4) return pick(INCORRECT_CLOSE_LINES);
      return pick(INCORRECT_LINES);
    }

    case "lesson_complete": {
      if (accuracy >= 85) return pick(LESSON_STRONG_LINES);
      return pick(LESSON_COMPLETE_LINES);
    }

    default:
      return pick(CORRECT_LINES);
  }
}
