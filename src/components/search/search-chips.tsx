"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@/hooks/use-location";
import { useSfx } from "@/components/sfx/sfx-context";

const EVERGREEN = [
  "Plastic bottle",
  "Pizza box",
  "Batteries",
  "Glass jar",
  "Styrofoam",
  "Old phone",
];

const SEASONAL: Record<number, string[]> = {
  0: ["Christmas tree", "Wrapping paper", "Gift boxes", "Ribbons"],
  1: ["Valentine cards", "Chocolate wrappers", "Gift wrap"],
  2: ["Seed packets", "Plant pots", "Potting soil bags"],
  3: ["Easter egg packaging", "Plastic grass", "Spring cleaning junk"],
  4: ["Paint cans", "Garden hose", "Flower pots"],
  5: ["Sunscreen bottle", "Pool noodle", "Popsicle sticks"],
  6: ["Firework debris", "Picnic plates", "Solo cups"],
  7: ["Plastic bags", "Water bottles", "Cooler packs"],
  8: ["School supplies", "Binders", "Markers"],
  9: ["Pumpkins", "Candy wrappers", "Costume packaging"],
  10: ["Leaf bags", "Raked leaves", "Turkey trays"],
  11: ["Gift boxes", "Wrapping paper", "Shipping boxes"],
};

function getPopularSearches(): string[] {
  const month = new Date().getMonth();
  const seasonal = SEASONAL[month] ?? [];
  const picks = seasonal.slice(0, 4);
  const evergreen = EVERGREEN.filter(
    (e) => !picks.some((p) => p.toLowerCase() === e.toLowerCase())
  ).slice(0, 8 - picks.length);
  return [...picks, ...evergreen];
}

export function SearchChips() {
  const router = useRouter();
  const { providerId } = useLocation();
  const sfx = useSfx();
  const searches = useMemo(getPopularSearches, []);

  return (
    <div
      className="flex flex-wrap justify-center gap-2"
      role="list"
      aria-label="Popular searches"
    >
      {searches.map((item, i) => (
        <motion.button
          key={item}
          onClick={() => {
            sfx.pop();
            router.push(
              `/result?q=${encodeURIComponent(item)}&provider=${providerId}`
            );
          }}
          className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
          role="listitem"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {item}
        </motion.button>
      ))}
    </div>
  );
}
