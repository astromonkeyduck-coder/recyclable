"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PHASES = [
  { text: "Reading text & labels", icon: "🔍" },
  { text: "Identifying material", icon: "🧪" },
  { text: "Checking disposal rules", icon: "📋" },
  { text: "Almost there", icon: "✨" },
];

type AnalyzingOverlayProps = {
  imageDataUrl: string;
};

export function AnalyzingOverlay({ imageDataUrl }: AnalyzingOverlayProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < PHASES.length - 1 ? p + 1 : p));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const current = PHASES[phase];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Blurred photo background */}
      <div
        className="absolute inset-0 opacity-30 blur-2xl scale-110"
        style={{
          backgroundImage: `url(${imageDataUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-sm">
        {/* Photo thumbnail with scanning effect */}
        <div className="relative">
          <motion.div
            className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ perspective: "800px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Captured item"
              className="h-full w-full object-cover"
            />

            {/* Scanning sweep line */}
            <motion.div
              className="absolute inset-x-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(34,197,94,0.8), transparent)",
                boxShadow: "0 0 15px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.15)",
              }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Orbiting ring */}
          <motion.div
            className="absolute -inset-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(34,197,94,0.6)" />
                  <stop offset="50%" stopColor="rgba(34,197,94,0)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="100 200"
              />
            </svg>
          </motion.div>

          {/* Pulsing corner dots */}
          {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
            (pos, i) => (
              <motion.div
                key={pos}
                className="absolute h-2 w-2 rounded-full bg-green-400"
                style={{
                  ...(pos.includes("top") ? { top: -4 } : { bottom: -4 }),
                  ...(pos.includes("left") ? { left: -4 } : { right: -4 }),
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            )
          )}
        </div>

        {/* Phase text with icon */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            key={phase}
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xl">{current.icon}</span>
            <span className="text-base font-medium text-white/90">{current.text}</span>
          </motion.div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {PHASES.map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full"
                animate={{
                  width: i <= phase ? 20 : 6,
                  backgroundColor:
                    i <= phase ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.15)",
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Bottom wave bars */}
        <div className="flex items-end gap-[3px] h-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-green-500/40"
              animate={{
                height: [4, 12 + Math.random() * 20, 4],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
