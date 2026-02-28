"use client";

import { useCallback, useRef } from "react";
import { generateVoiceLine, type VoiceEventType, type VoiceLineParams } from "@/lib/voice/reactions";

const COOLDOWN_MS = 3000;
const DELAY_MS = 150;
const VOLUME = 0.7;
const CAPTION_CLEAR_MS = 2500;

type PlayParams = Omit<VoiceLineParams, "eventType"> & { eventType: VoiceEventType };

export function useVoicePlayer(options: {
  enabled: boolean;
  reducedMotion: boolean;
  onCaption: (text: string | null) => void;
}) {
  const { enabled, reducedMotion, onCaption } = options;
  const lastPlayedRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const captionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCaption = useCallback(() => {
    if (captionTimeoutRef.current) {
      clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = null;
    }
    onCaption(null);
  }, [onCaption]);

  const playVoice = useCallback(
    async (eventType: VoiceEventType, params: Omit<PlayParams, "eventType"> = {}) => {
      if (!enabled || reducedMotion) return;
      if (typeof window === "undefined") return;

      const now = Date.now();
      if (now - lastPlayedRef.current < COOLDOWN_MS) return;

      const fullParams: VoiceLineParams = { eventType, ...params };
      const captionText = generateVoiceLine(fullParams);
      onCaption(captionText);

      lastPlayedRef.current = now;

      setTimeout(async () => {
        try {
          const res = await fetch("/api/voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventType,
              category: params.category,
              streakCount: params.streakCount,
              confidence: params.confidence,
              accuracy: params.accuracy,
            }),
          });

          if (!res.ok) return;

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);

          if (currentUrlRef.current) {
            URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = null;
          }
          currentUrlRef.current = url;

          if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = VOLUME;
          }
          const audio = audioRef.current;
          audio.pause();
          audio.src = url;
          audio.onended = () => {
            if (currentUrlRef.current === url) {
              URL.revokeObjectURL(url);
              currentUrlRef.current = null;
            }
            if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
            captionTimeoutRef.current = setTimeout(clearCaption, CAPTION_CLEAR_MS);
          };
          audio.onerror = () => {
            if (currentUrlRef.current === url) {
              URL.revokeObjectURL(url);
              currentUrlRef.current = null;
            }
            clearCaption();
          };
          await audio.play();
        } catch {
          clearCaption();
        }
      }, DELAY_MS);
    },
    [enabled, reducedMotion, onCaption, clearCaption]
  );

  return { playVoice };
}
