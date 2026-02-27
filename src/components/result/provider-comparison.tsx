"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import { CATEGORY_META } from "@/lib/utils/categories";
import { cn } from "@/lib/utils";
import type { DisposalCategory } from "@/lib/providers/types";

const COMPARE_PROVIDERS = ["general", "nyc", "chicago", "la", "sf", "seattle"];

type ComparisonResult = {
  providerId: string;
  providerName: string;
  category: DisposalCategory;
};

type ProviderComparisonProps = {
  itemName: string;
  currentProviderId: string;
  currentCategory: DisposalCategory;
};

export function ProviderComparison({
  itemName,
  currentProviderId,
  currentCategory,
}: ProviderComparisonProps) {
  const [open, setOpen] = useState(false);

  const otherProviders = COMPARE_PROVIDERS.filter(
    (id) => id !== currentProviderId
  ).slice(0, 3);

  const { data: comparisons, isLoading } = useQuery<ComparisonResult[]>({
    queryKey: ["compare", itemName, ...otherProviders],
    queryFn: async () => {
      const results = await Promise.all(
        otherProviders.map(async (pid): Promise<ComparisonResult | null> => {
          try {
            const res = await fetch("/api/resolve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                providerId: pid,
                guessedItemName: itemName,
                labels: [itemName],
              }),
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (!data.best) return null;
            return {
              providerId: pid,
              providerName: data.providerName,
              category: data.best.category,
            };
          } catch {
            return null;
          }
        })
      );
      return results.filter((r): r is ComparisonResult => r !== null);
    },
    enabled: open,
    staleTime: 10 * 60_000,
  });

  const hasDifferences = comparisons?.some(
    (c) => c.category !== currentCategory
  );

  return (
    <div className="w-full max-w-lg">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
      >
        <Globe className="h-3.5 w-3.5" />
        Compare locations
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-2 pt-2 pb-1">
              {isLoading &&
                otherProviders.map((id) => (
                  <div
                    key={id}
                    className="h-7 w-28 rounded-full bg-muted animate-pulse"
                  />
                ))}
              {comparisons?.map((c) => {
                const meta = CATEGORY_META[c.category];
                const isDifferent = c.category !== currentCategory;
                return (
                  <span
                    key={c.providerId}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                      isDifferent
                        ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50"
                        : "bg-muted/50"
                    )}
                  >
                    <span>{meta.icon}</span>
                    {c.providerName}: {meta.label}
                  </span>
                );
              })}
              {comparisons && comparisons.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No comparison data available
                </p>
              )}
            </div>
            {hasDifferences && (
              <p className="text-[11px] text-muted-foreground text-center mt-1">
                Rules vary by location for this item
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
