"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
};

const COLORS = [
  "#22C55E", "#3B82F6", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 100),
    rotation: Math.random() * 720 - 360,
    scale: Math.random() * 0.6 + 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.15,
  }));
}

export function ConfettiBurst({
  trigger,
  count = 16,
  duration = 1.0,
  size = "sm",
}: {
  trigger: boolean;
  count?: number;
  duration?: number;
  size?: "sm" | "lg";
}) {
  const reduced = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger || reduced) return;
    setParticles(generateParticles(count));
    setShow(true);
    const timer = setTimeout(() => setShow(false), duration * 1000 + 300);
    return () => clearTimeout(timer);
  }, [trigger, count, duration, reduced]);

  if (!show || reduced) return null;

  const spread = size === "lg" ? 1.8 : 1;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
      <div className="relative h-full w-full">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{
              width: size === "lg" ? 10 : 6,
              height: size === "lg" ? 10 : 6,
              backgroundColor: p.color,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: p.x * spread,
              y: p.y * spread,
              scale: p.scale,
              rotate: p.rotation,
              opacity: 0,
            }}
            transition={{
              duration,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
