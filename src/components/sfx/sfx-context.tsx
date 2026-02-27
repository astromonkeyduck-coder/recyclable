"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSoundEffects, type SoundEffects } from "@/hooks/use-sound-effects";

const SfxContext = createContext<SoundEffects | null>(null);

export function SfxProvider({ children }: { children: ReactNode }) {
  const sfx = useSoundEffects();
  return <SfxContext.Provider value={sfx}>{children}</SfxContext.Provider>;
}

export function useSfx(): SoundEffects {
  const ctx = useContext(SfxContext);
  if (!ctx) throw new Error("useSfx must be used within SfxProvider");
  return ctx;
}
