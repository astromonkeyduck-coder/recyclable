"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TIPS = [
  "Rinse containers before recycling",
  "Flatten cardboard boxes to save space",
  "Never bag recyclables in plastic bags",
  "Batteries can cause fires in garbage trucks",
  "When in doubt, throw it out",
  "Pizza boxes with light grease are usually fine",
  "Styrofoam is almost never recyclable curbside",
  "Aluminum is infinitely recyclable",
];

const RING_SEGMENTS = [
  { color: "#3B82F6", label: "Recycle" },
  { color: "#6B7280", label: "Trash" },
  { color: "#22C55E", label: "Compost" },
  { color: "#F97316", label: "Drop-off" },
  { color: "#EF4444", label: "Hazardous" },
];

function SegmentedRing() {
  const size = 80;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / RING_SEGMENTS.length;
  const gap = 4;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {RING_SEGMENTS.map((seg, i) => {
          const offset = i * segmentLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${segmentLength - gap} ${circumference - segmentLength + gap}`}
              strokeDashoffset={-offset}
              className="opacity-80"
            />
          );
        })}
      </motion.svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ♻️
        </motion.span>
      </div>
    </div>
  );
}

function PulsingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-foreground/30"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ShimmerBar({ width, delay }: { width: string; delay: number }) {
  return (
    <motion.div
      className="relative h-3 overflow-hidden rounded-full bg-muted"
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1.5, repeat: Infinity, delay, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default function Loading() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinner */}
        <SegmentedRing />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground/70">Loading</span>
            <PulsingDots />
          </div>
        </div>

        {/* Skeleton preview card */}
        <motion.div
          className="w-full max-w-xs rounded-xl border bg-card p-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="h-8 w-24 rounded-full bg-muted"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-5 w-16 rounded-full bg-muted"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </div>
          <div className="space-y-2.5">
            <ShimmerBar width="85%" delay={0} />
            <ShimmerBar width="70%" delay={0.1} />
            <ShimmerBar width="60%" delay={0.2} />
          </div>
          <div className="mt-4 h-px bg-border" />
          <div className="mt-3 flex justify-between">
            <ShimmerBar width="40%" delay={0.3} />
            <ShimmerBar width="20%" delay={0.4} />
          </div>
        </motion.div>

        {/* Rotating tips */}
        <motion.div
          className="h-10 flex items-center"
          key={tipIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-xs text-muted-foreground max-w-xs">
            <span className="font-medium text-foreground/60">Tip:</span>{" "}
            {TIPS[tipIndex]}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
