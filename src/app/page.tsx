"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Recycle, MapPin, X, Bookmark } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchChips } from "@/components/search/search-chips";
import { ScanUploadButtons } from "@/components/scan/scan-button";
import { SeasonalTipBanner } from "@/components/common/seasonal-tip-banner";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useLocation } from "@/hooks/use-location";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useProviderList } from "@/hooks/use-provider";
import { useSfx } from "@/components/sfx/sfx-context";
import { CATEGORY_META } from "@/lib/utils/categories";
import { CategoryIcon } from "@/components/common/category-icon";
import { Suspense, useEffect, useState } from "react";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providerId, cityName } = useLocation();
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();
  const { bookmarks } = useBookmarks();
  const { data: providers } = useProviderList();
  const sfx = useSfx();
  const [cameraRequested, setCameraRequested] = useState(false);

  const currentProvider = providers?.find((p) => p.id === providerId);

  useEffect(() => {
    if (searchParams.get("openCamera") === "true") {
      setCameraRequested(true);
      window.history.replaceState(null, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="relative flex flex-col items-center px-4 pb-16">
      {/* Hero */}
      <motion.div
        className="flex flex-col items-center gap-4 pt-16 pb-10 text-center sm:pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Recycle className="h-18 w-18 text-green-600 sm:h-20 sm:w-20" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Is this recyclable?
        </h1>
        <p className="max-w-md text-muted-foreground text-base sm:text-lg">
          Snap it, search it, sort it. Stop guessing and start disposing like a
          pro with {cityName ? `${cityName}'s` : "your"} local rules.
        </p>

        {/* Location pill */}
        {currentProvider && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <MapPin className="h-3 w-3" />
            Rules for: <span className="text-foreground font-semibold">{currentProvider.displayName}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex w-full max-w-lg flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <ScanUploadButtons autoOpenCamera={cameraRequested} />

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            or search
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <SearchBar onSearch={(q) => addToHistory(q)} autoFocus />
      </motion.div>

      <SeasonalTipBanner />

      {/* Saved items */}
      {bookmarks.length > 0 && (
        <motion.div
          className="mt-6 w-full max-w-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Saved items
            </p>
          </div>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="list"
            aria-label="Saved items"
          >
            {bookmarks.slice(0, 8).map((b) => {
              const meta = CATEGORY_META[b.category];
              return (
                <motion.button
                  key={b.query}
                  onClick={() => {
                    sfx.pop();
                    router.push(
                      `/result?q=${encodeURIComponent(b.query)}&provider=${b.providerId}`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
                  role="listitem"
                >
                  <CategoryIcon category={b.category} size="xs" bare />
                  {b.query}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent searches */}
      {history.length > 0 && (
        <motion.div
          className="mt-6 w-full max-w-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent searches
            </p>
            <button
              type="button"
              onClick={() => {
                sfx.tap();
                clearHistory();
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="list"
            aria-label="Recent searches"
          >
            {history.slice(0, 10).map((entry, i) => {
              const meta = entry.category
                ? CATEGORY_META[entry.category]
                : null;
              return (
                <div
                  key={`${entry.query}-${i}`}
                  className="group relative inline-flex focus-within:z-10"
                  role="listitem"
                >
                  <button
                    onClick={() => {
                      sfx.pop();
                      addToHistory(entry.query, entry.category);
                      router.push(
                        `/result?q=${encodeURIComponent(entry.query)}&provider=${providerId}`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 pl-3 pr-7 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {meta && <CategoryIcon category={entry.category!} size="xs" bare />}
                    {entry.query}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.tap();
                      removeFromHistory(entry.query);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-full"
                    aria-label={`Remove ${entry.query}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Popular searches */}
      <motion.div
        className="mt-10 w-full max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="mb-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Popular searches
        </p>
        <SearchChips />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
