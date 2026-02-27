"use client";

import { useState, useCallback, useEffect } from "react";
import type { DisposalCategory } from "@/lib/providers/types";

export type HistoryEntry = {
  query: string;
  category?: DisposalCategory;
  timestamp: number;
};

const STORAGE_KEY = "itr-search-history";
const MAX_ITEMS = 15;

function migrate(raw: string): HistoryEntry[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item: unknown): HistoryEntry | null => {
      if (typeof item === "string") {
        return { query: item, timestamp: 0 };
      }
      if (
        item &&
        typeof item === "object" &&
        "query" in item &&
        typeof (item as HistoryEntry).query === "string"
      ) {
        return item as HistoryEntry;
      }
      return null;
    })
    .filter((x): x is HistoryEntry => x !== null)
    .slice(0, MAX_ITEMS);
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return migrate(raw);
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_ITEMS))
    );
  } catch {
    // ignore
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback(
    (query: string, category?: DisposalCategory) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setHistory((prev) => {
        const next = [
          { query: trimmed, category, timestamp: Date.now() },
          ...prev.filter(
            (e) => e.query.toLowerCase() !== trimmed.toLowerCase()
          ),
        ].slice(0, MAX_ITEMS);
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter(
        (e) => e.query.toLowerCase() !== query.toLowerCase()
      );
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
