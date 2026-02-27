"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

export function useMusicPlayer(): MusicPlayerState {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(PLAYLIST[0].src);
    audio.preload = "auto";
    audio.volume = 0.4;
    audioRef.current = audio;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;

    const source = ctx.createMediaElementSource(audio);
    sourceRef.current = source;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audio.addEventListener("ended", () => {
      setCurrentTrack((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[next].src;
        audio.play().catch((err) => console.warn("Track advance failed:", err));
        return next;
      });
    });

    return audio;
  }, []);

  const toggle = useCallback(async () => {
    const audio = initAudio();

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (ctxRef.current?.state === "suspended") {
          await ctxRef.current.resume();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio playback failed:", err);
      }
    }
  }, [isPlaying, hasInteracted, initAudio]);

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
        if (ctxRef.current?.state === "suspended") {
          await ctxRef.current.resume();
        }
        await audio.play();
      } catch (err) {
        console.warn("Track skip failed:", err);
      }
    }
  }, [isPlaying, currentTrack]);

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
