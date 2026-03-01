"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Main site playlist — preview song is only for the preview card (e.g. /debug/og or share preview), not here
const PLAYLIST = [
  { src: "/audio/niceindie.wav", title: "Golden Hour" },
  { src: "/audio/firstsongrec.wav", title: "Curbside Dreams" },
  { src: "/audio/recycleee.wav", title: "Second Life" },
];

export type MusicPlayerState = {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: number;
  trackTitle: string;
  analyserNode: AnalyserNode | null;
  toggle: () => void;
  toggleMute: () => void;
  next: () => void;
};

const AUTOPLAY_EVENTS = ["click", "touchstart", "keydown"] as const;

export function useMusicPlayer(): MusicPlayerState {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const autoplayAttemptedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(PLAYLIST[0].src);
    audio.preload = "auto";
    audio.volume = 0.4;
    audio.setAttribute("playsinline", "true");
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setCurrentTrack((prev) => {
        const nextIdx = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[nextIdx].src;
        audio.play().catch((err) => console.warn("Track advance failed:", err));
        return nextIdx;
      });
    });

    return audio;
  }, []);

  const connectVisualizer = useCallback(async () => {
    if (sourceRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    try {
      const ctx = ctxRef.current ?? new AudioContext();
      ctxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (err) {
      console.warn("Visualizer setup failed (audio still plays):", err);
    }
  }, []);

  const toggle = useCallback(async () => {
    const audio = getAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      // On iOS, play the audio element FIRST (needs user gesture, no async before it)
      await audio.play();
      setIsPlaying(true);

      // Then connect to AudioContext for visualization (after audio is playing)
      await connectVisualizer();
    } catch (err) {
      console.warn("Audio playback failed:", err);
    }
  }, [isPlaying, getAudio, connectVisualizer]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const next = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextIdx = (currentTrack + 1) % PLAYLIST.length;
    setCurrentTrack(nextIdx);
    audio.src = PLAYLIST[nextIdx].src;

    if (isPlaying) {
      try {
        await audio.play();
        if (ctxRef.current?.state === "suspended") {
          await ctxRef.current.resume();
        }
      } catch (err) {
        console.warn("Track skip failed:", err);
      }
    }
  }, [isPlaying, currentTrack]);

  // Autoplay on first user interaction (browsers block unmuted audio until then)
  useEffect(() => {
    const tryAutoplay = () => {
      if (autoplayAttemptedRef.current) return;
      autoplayAttemptedRef.current = true;
      AUTOPLAY_EVENTS.forEach((ev) => document.removeEventListener(ev, tryAutoplay));
      const audio = getAudio();
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            connectVisualizer();
          })
          .catch(() => {});
      }
    };
    AUTOPLAY_EVENTS.forEach((ev) =>
      document.addEventListener(ev, tryAutoplay, { passive: true })
    );
    return () =>
      AUTOPLAY_EVENTS.forEach((ev) => document.removeEventListener(ev, tryAutoplay));
  }, [getAudio, connectVisualizer]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  return {
    isPlaying,
    isMuted,
    currentTrack,
    trackTitle: PLAYLIST[currentTrack].title,
    analyserNode: analyserRef.current,
    toggle,
    toggleMute,
    next,
  };
}
