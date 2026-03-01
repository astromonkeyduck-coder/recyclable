"use client";

import { useEffect, useRef } from "react";
import { useVoice } from "@/components/voice/voice-context";
import { getWelcomeLine, recordVisit } from "@/lib/voice/welcome";

const EVENTS = ["click", "touchstart", "keydown"] as const;

export function WelcomeOnFirstTouch() {
  const { playCustomLine, enabled } = useVoice();
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleFirstInteraction = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      EVENTS.forEach((ev) => document.removeEventListener(ev, handleFirstInteraction));

      recordVisit();
      playCustomLine(getWelcomeLine());
    };

    EVENTS.forEach((ev) =>
      document.addEventListener(ev, handleFirstInteraction, { passive: true })
    );
    return () =>
      EVENTS.forEach((ev) => document.removeEventListener(ev, handleFirstInteraction));
  }, [enabled, playCustomLine]);

  return null;
}
