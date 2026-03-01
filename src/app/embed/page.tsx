"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Recycle } from "lucide-react";

const PREVIEW_SONG_SRC = "/audio/isthisredcyaudio.m4a";

export default function EmbedPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.add("embed-mode");
    return () => document.body.classList.remove("embed-mode");
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-[#052E16] via-[#064E3B] to-[#115E59] p-4">
      <div
        className="w-full max-w-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]/95 backdrop-blur"
        style={{ minHeight: "320px" }}
      >
        {/* Card visual: matches OG preview */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 text-xl shadow-lg">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white/90 text-sm tracking-tight">
              isthisrecyclable.com
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Is this recyclable?
          </h1>
          <p className="text-white/70 text-sm font-medium mb-6">
            Snap it, search it, sort it.
          </p>

          {/* Play button — Spotify-style */}
          <div className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/15 p-4">
            <audio
              ref={audioRef}
              src={PREVIEW_SONG_SRC}
              onEnded={() => setPlaying(false)}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
            />
            <button
              type="button"
              onClick={toggle}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              aria-label={playing ? "Pause" : "Play preview song"}
            >
              {playing ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Preview</p>
              <p className="text-white/60 text-xs truncate">isthisrecyclable.com</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block mt-4 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
          >
            Open app →
          </Link>
        </div>
      </div>
    </div>
  );
}
