"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import type { AnalysisPhase } from "./scan-button";

const PHASES: Array<{ text: string; sub: string }> = [
  { text: "Reading", sub: "Scanning text and labels" },
  { text: "Identifying", sub: "Asking the bins what this is" },
  { text: "Matching", sub: "Checking local disposal rules" },
  { text: "Done", sub: "Almost there..." },
];

const PHASE_INDEX: Record<AnalysisPhase, number> = {
  uploading: 0,
  scanning: 1,
  matching: 2,
  finalizing: 3,
};

type AnalyzingOverlayProps = {
  imageDataUrl: string;
  phase?: AnalysisPhase;
};

export function AnalyzingOverlay({ imageDataUrl, phase: externalPhase }: AnalyzingOverlayProps) {
  const targetIndex = externalPhase ? PHASE_INDEX[externalPhase] : 0;
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (targetIndex > phase) setPhase(targetIndex);
  }, [targetIndex, phase]);

  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => Math.min(Math.max(p + 1, targetIndex), PHASES.length - 1));
    }, 3200);
    return () => clearInterval(t);
  }, [targetIndex]);

  const progress = ((phase + 1) / PHASES.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Blurred background */}
      <div
        className="absolute inset-[-10%] blur-3xl opacity-25 scale-110"
        style={{
          backgroundImage: `url(${imageDataUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-xs px-6"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Photo */}
        <motion.div
          className="relative mb-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow behind photo */}
          <div
            className="absolute -inset-6 rounded-3xl opacity-40 blur-2xl"
            style={{
              background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Single rotating ring */}
          <motion.div
            className="absolute -inset-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 240 240" className="w-full h-full" fill="none">
              <circle
                cx="120" cy="120" r="116"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
              <motion.circle
                cx="120" cy="120" r="116"
                stroke="rgba(34,197,94,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="80 650"
                animate={{ strokeDashoffset: [0, -730] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </motion.div>

          {/* Photo */}
          <div
            className="relative w-44 h-44 rounded-[20px] overflow-hidden"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(0,0,0,0.5)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Captured item"
              className="h-full w-full object-cover"
            />

            {/* Single clean scan line */}
            <motion.div
              className="absolute inset-x-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)",
                boxShadow: "0 0 12px rgba(34,197,94,0.2)",
              }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>

        {/* Phase text */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={phase}
              className="text-xl font-semibold text-white tracking-tight"
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {PHASES[phase].text}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="text-sm text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              {PHASES[phase].sub}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-full mb-6"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #22C55E, #16A34A)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Shimmer on progress bar */}
            <motion.div
              className="absolute inset-y-0 w-16 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
              animate={{ left: ["-20%", "120%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="flex items-center justify-between w-full"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {PHASES.map((p, i) => {
            const isDone = i < phase;
            const isActive = i === phase;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <motion.div
                  className="flex items-center justify-center rounded-full"
                  animate={{
                    width: isActive ? 32 : 24,
                    height: isActive ? 32 : 24,
                    backgroundColor: isDone
                      ? "rgba(34,197,94,0.15)"
                      : isActive
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    borderWidth: 1,
                    borderColor: isDone
                      ? "rgba(34,197,94,0.3)"
                      : isActive
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.05)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {isDone ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <motion.div
                      className="rounded-full"
                      animate={{
                        width: isActive ? 6 : 4,
                        height: isActive ? 6 : 4,
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.15)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-[10px] font-medium ${
                    isDone
                      ? "text-green-400/60"
                      : isActive
                        ? "text-white/50"
                        : "text-white/20"
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Elapsed time */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="text-[11px] text-white/20 tabular-nums">{elapsed}s</span>
          <AnimatePresence>
            {elapsed >= 8 && (
              <motion.span
                className="text-[11px] text-white/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Almost there...
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
