"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Package, MapPin, Layers } from "lucide-react";

const STATS = [
  { value: 112, suffix: "+", label: "Materials covered", icon: Package },
  { value: 9, suffix: "", label: "City providers", icon: MapPin },
  { value: 6, suffix: "", label: "Disposal categories", icon: Layers },
];

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let frame: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start, prefersReducedMotion]);

  return count;
}

function StatCard({ value, suffix, label, icon: Icon, index }: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Package;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(value, 1200, isInView);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center shadow-sm"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-3xl font-bold tabular-nums tracking-tight">
        {count}{suffix}
      </span>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export function AnimatedStats() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  );
}
