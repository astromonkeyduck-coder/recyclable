"use client";

import { useState, useCallback, useEffect } from "react";
import type { DisposalCategory } from "@/lib/providers/types";

export type Bookmark = {
  query: string;
  category: DisposalCategory;
  providerName: string;
  providerId: string;
  timestamp: number;
};

const STORAGE_KEY = "itr-bookmarks";
const MAX_ITEMS = 30;

function loadBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Bookmark[]).slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(items: Bookmark[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const isBookmarked = useCallback(
    (query: string) =>
      bookmarks.some((b) => b.query.toLowerCase() === query.toLowerCase()),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (bookmark: Omit<Bookmark, "timestamp">) => {
      setBookmarks((prev) => {
        const exists = prev.some(
          (b) => b.query.toLowerCase() === bookmark.query.toLowerCase()
        );
        const next = exists
          ? prev.filter(
              (b) => b.query.toLowerCase() !== bookmark.query.toLowerCase()
            )
          : [{ ...bookmark, timestamp: Date.now() }, ...prev].slice(
              0,
              MAX_ITEMS
            );
        saveBookmarks(next);
        return next;
      });
    },
    []
  );

  const removeBookmark = useCallback((query: string) => {
    setBookmarks((prev) => {
      const next = prev.filter(
        (b) => b.query.toLowerCase() !== query.toLowerCase()
      );
      saveBookmarks(next);
      return next;
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}
