"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useVoicePlayer } from "@/hooks/use-voice-player";
import type { VoiceEventType, VoiceLineCategory } from "@/lib/voice/reactions";

const STORAGE_KEY = "voice_reactions_enabled";

type VoiceLineParams = {
  category?: VoiceLineCategory;
  streakCount?: number;
  confidence?: number;
  accuracy?: number;
};

type VoiceContextValue = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  playVoice: (eventType: VoiceEventType, params?: VoiceLineParams) => void;
  caption: string | null;
  reducedMotion: boolean;
};

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setEnabledState(stored === "true");
    } catch {
      setEnabledState(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch {
      // ignore
    }
  }, []);

  const { playVoice } = useVoicePlayer({
    enabled,
    reducedMotion,
    onCaption: setCaption,
  });

  const value: VoiceContextValue = {
    enabled,
    setEnabled,
    playVoice,
    caption,
    reducedMotion,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}
