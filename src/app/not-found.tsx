"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const ITEMS = [
  "🥫", "📦", "🔋", "🍌", "🧴", "📰", "🥤", "💡", "👟", "🎨",
  "📱", "🍕", "🧃", "🪫", "🧹", "🛍️", "🥡", "🧊", "🪣", "🧻",
];

function FallingItem({ emoji, delay, x }: { emoji: string; delay: number; x: number }) {
  return (
    <motion.span
      className="absolute text-2xl select-none pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ y: -40, opacity: 0, rotate: 0 }}
      animate={{
        y: ["0vh", "105vh"],
        opacity: [0, 0.6, 0.6, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden
    >
      {emoji}
    </motion.span>
  );
}

export default function NotFound() {
  const [particles, setParticles] = useState<
    Array<{ id: number; emoji: string; delay: number; x: number }>
  >([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: ITEMS[i % ITEMS.length],
      delay: i * 0.7,
      x: 5 + (i * 5.2) % 90,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Background falling items */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {particles.map((p) => (
          <FallingItem key={p.id} emoji={p.emoji} delay={p.delay} x={p.x} />
        ))}
      </div>

      {/* Glowing orb behind the 404 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-green-500/10 blur-[100px] dark:bg-green-400/5" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        {/* Big 404 with animated recycle symbol */}
        <div className="flex items-center gap-3">
          <motion.span
            className="text-8xl font-black tracking-tighter text-foreground/90 sm:text-9xl"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            4
          </motion.span>
          <motion.span
            className="text-7xl sm:text-8xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ♻️
          </motion.span>
          <motion.span
            className="text-8xl font-black tracking-tighter text-foreground/90 sm:text-9xl"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            4
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            This page got recycled
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Looks like this page doesn&apos;t exist anymore. Maybe it was composted,
            maybe it was never here. Either way, let&apos;s get you back on track.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <Search className="h-4 w-4" />
              Search an item
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button
            onClick={() => history.back()}
            className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
