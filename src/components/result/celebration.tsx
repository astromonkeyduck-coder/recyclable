"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DisposalCategory } from "@/lib/providers/types";

type CelebrationProps = {
  category: DisposalCategory;
  materialId: string;
};

const CONFETTI_COLORS: Record<string, string[]> = {
  recycle: ["#3B82F6", "#60A5FA", "#93C5FD", "#2DD4BF", "#38BDF8"],
  compost: ["#22C55E", "#4ADE80", "#86EFAC", "#34D399", "#A3E635"],
};

const PARTICLE_COUNT = 24;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ConfettiBurst({ colors }: { colors: string[] }) {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(-120, 120),
      y: randomBetween(-140, -40),
      rotate: randomBetween(0, 720),
      scale: randomBetween(0.5, 1),
      color: colors[i % colors.length],
      shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "rect",
      delay: randomBetween(0, 0.15),
    }))
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: p.scale,
            rotate: p.rotate,
          }}
          transition={{
            duration: 0.8,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            width: p.shape === "rect" ? 8 : 6,
            height: p.shape === "rect" ? 4 : 6,
            borderRadius: p.shape === "circle" ? "50%" : 1,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

function WarningPulse() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2 border-red-400/60 dark:border-red-500/40"
          initial={{ width: 80, height: 80, opacity: 0.7 }}
          animate={{ width: 160, height: 160, opacity: 0 }}
          transition={{
            duration: 1.2,
            delay: i * 0.25,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function DropoffPulse() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2 border-orange-400/50 dark:border-orange-500/30"
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{ width: 140, height: 140, opacity: 0 }}
          transition={{
            duration: 1,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function Celebration({ category, materialId }: CelebrationProps) {
  const prefersReduced = useReducedMotion();
  const [fired, setFired] = useState(false);
  const prevIdRef = useRef(materialId);

  useEffect(() => {
    if (prevIdRef.current !== materialId) {
      prevIdRef.current = materialId;
      setFired(false);
    }
  }, [materialId]);

  useEffect(() => {
    if (!fired) {
      setFired(true);
    }
  }, [fired]);

  if (prefersReduced || !fired) return null;

  if (category === "recycle" || category === "compost") {
    return <ConfettiBurst colors={CONFETTI_COLORS[category]} />;
  }

  if (category === "hazardous") {
    return <WarningPulse />;
  }

  if (category === "dropoff") {
    return <DropoffPulse />;
  }

  return null;
}
