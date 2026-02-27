"use client";

import { useState, useCallback, useEffect } from "react";
import type { DisposalCategory } from "@/lib/providers/types";

export type EcoStats = {
  totalItems: number;
  categories: Record<string, number>;
  streakDays: number;
  lastActiveDate: string | null;
  firstUseDate: string | null;
};

const STORAGE_KEY = "itr-eco-stats";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

function loadStats(): EcoStats {
  if (typeof window === "undefined") {
    return emptyStats();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    return JSON.parse(raw) as EcoStats;
  } catch {
    return emptyStats();
  }
}

function emptyStats(): EcoStats {
  return {
    totalItems: 0,
    categories: {},
    streakDays: 0,
    lastActiveDate: null,
    firstUseDate: null,
  };
}

function saveStats(stats: EcoStats) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function useEcoStats() {
  const [stats, setStats] = useState<EcoStats>(emptyStats);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const logLookup = useCallback((category: DisposalCategory) => {
    setStats((prev) => {
      const todayStr = today();
      let streak = prev.streakDays;

      if (prev.lastActiveDate) {
        const gap = daysBetween(prev.lastActiveDate, todayStr);
        if (gap === 1) {
          streak += 1;
        } else if (gap > 1) {
          streak = 1;
        }
        // gap === 0 means same day, streak stays
      } else {
        streak = 1;
      }

      const next: EcoStats = {
        totalItems: prev.totalItems + 1,
        categories: {
          ...prev.categories,
          [category]: (prev.categories[category] ?? 0) + 1,
        },
        streakDays: streak,
        lastActiveDate: todayStr,
        firstUseDate: prev.firstUseDate ?? todayStr,
      };

      saveStats(next);
      return next;
    });
  }, []);

  const topCategory = Object.entries(stats.categories).sort(
    (a, b) => b[1] - a[1]
  )[0] as [string, number] | undefined;

  return { stats, logLookup, topCategory };
}
