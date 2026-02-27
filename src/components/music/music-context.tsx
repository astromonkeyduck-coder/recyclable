"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMusicPlayer, type MusicPlayerState } from "@/hooks/use-music-player";

const MusicContext = createContext<MusicPlayerState | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const player = useMusicPlayer();
  return <MusicContext.Provider value={player}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicPlayerState {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
