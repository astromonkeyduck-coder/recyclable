"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { getTipForNow, TIPS } from "@/data/tips";

const ROTATE_MS = 12_000;

export function SeasonalTipBanner() {
  const [tip, setTip] = useState(getTipForNow);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTip(getTipForNow());
      setKey((k) => k + 1);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 w-full max-w-lg rounded-lg border bg-muted/40 px-4 py-3"
      role="complementary"
      aria-live="polite"
      aria-label="Recycling tip"
    >
      <div className="flex gap-3">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" aria-hidden />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground/90">Tip: </span>
          {tip.text}
        </p>
      </div>
    </motion.div>
  );
}
