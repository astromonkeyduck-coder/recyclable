"use client";

import { useCallback, useRef } from "react";

export type SfxName =
  | "click"
  | "tap"
  | "whoosh"
  | "shutter"
  | "success"
  | "warning"
  | "error"
  | "pop"
  | "ding"
  | "toggle"
  | "countdown"
  | "reveal"
  | "sweep";

export type SoundEffects = Record<SfxName, () => void>;

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext {
  if (!ref.current) ref.current = new AudioContext();
  if (ref.current.state === "suspended") ref.current.resume();
  return ref.current;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  volume: number,
  ramp?: { to: number; at?: number },
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (ramp) {
    osc.frequency.exponentialRampToValueAtTime(
      ramp.to,
      ctx.currentTime + (ramp.at ?? duration),
    );
  }
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(
  ctx: AudioContext,
  duration: number,
  volume: number,
  bandpass?: { freq: number; Q: number },
) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  if (bandpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = bandpass.freq;
    filter.Q.value = bandpass.Q;
    source.connect(filter).connect(gain).connect(ctx.destination);
  } else {
    source.connect(gain).connect(ctx.destination);
  }
  source.start();
  source.stop(ctx.currentTime + duration);
}

export function useSoundEffects(): SoundEffects {
  const ctxRef = useRef<AudioContext | null>(null);

  const click = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 1800, "sine", 0.06, 0.08);
    playTone(ctx, 2400, "sine", 0.03, 0.04);
  }, []);

  const tap = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 2200, "sine", 0.04, 0.06);
  }, []);

  const whoosh = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playNoise(ctx, 0.25, 0.06, { freq: 1200, Q: 0.5 });
    playTone(ctx, 600, "sine", 0.2, 0.03, { to: 1400 });
  }, []);

  const shutter = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playNoise(ctx, 0.08, 0.12, { freq: 4000, Q: 1 });
    setTimeout(() => {
      playNoise(ctx, 0.06, 0.1, { freq: 3500, Q: 1.2 });
    }, 80);
  }, []);

  const success = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 523, "sine", 0.15, 0.1);
    setTimeout(() => playTone(ctx, 659, "sine", 0.15, 0.1), 100);
    setTimeout(() => playTone(ctx, 784, "sine", 0.25, 0.12), 200);
  }, []);

  const warning = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 440, "triangle", 0.2, 0.1);
    setTimeout(() => playTone(ctx, 370, "triangle", 0.3, 0.08), 180);
  }, []);

  const error = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 330, "sawtooth", 0.15, 0.06);
    setTimeout(() => playTone(ctx, 262, "sawtooth", 0.25, 0.06), 150);
  }, []);

  const pop = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 1000, "sine", 0.08, 0.1, { to: 300, at: 0.06 });
  }, []);

  const ding = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 1568, "sine", 0.4, 0.08);
    playTone(ctx, 2093, "sine", 0.3, 0.05);
  }, []);

  const toggle = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 1200, "sine", 0.06, 0.07);
    setTimeout(() => playTone(ctx, 1600, "sine", 0.06, 0.07), 50);
  }, []);

  const countdown = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 880, "sine", 0.12, 0.1);
  }, []);

  const reveal = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 440, "sine", 0.1, 0.06);
    setTimeout(() => playTone(ctx, 554, "sine", 0.1, 0.06), 60);
    setTimeout(() => playTone(ctx, 659, "sine", 0.1, 0.06), 120);
    setTimeout(() => playTone(ctx, 880, "sine", 0.2, 0.08), 180);
  }, []);

  const sweep = useCallback(() => {
    const ctx = getCtx(ctxRef);
    playTone(ctx, 400, "sine", 0.15, 0.05, { to: 800 });
    playNoise(ctx, 0.12, 0.03, { freq: 2000, Q: 0.3 });
  }, []);

  return { click, tap, whoosh, shutter, success, warning, error, pop, ding, toggle, countdown, reveal, sweep };
}
