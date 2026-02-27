"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Leaf, ChevronDown, TrendingUp } from "lucide-react";
import { useEcoStats } from "@/hooks/use-eco-stats";
import { CATEGORY_META } from "@/lib/utils/categories";
import { CategoryIcon } from "@/components/common/category-icon";
import type { DisposalCategory } from "@/lib/providers/types";

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];

function nextMilestone(total: number): number {
  return MILESTONES.find((m) => m > total) ?? total + 100;
}

export function EcoStatsBanner() {
  const { stats, topCategory } = useEcoStats();
  const [expanded, setExpanded] = useState(false);

  if (stats.totalItems === 0) return null;

  const milestone = nextMilestone(stats.totalItems);
  const progress = Math.min((stats.totalItems / milestone) * 100, 100);

  const sortedCategories = Object.entries(stats.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = sortedCategories[0]?.[1] ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full max-w-lg"
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full rounded-xl border bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            {/* Items count */}
            <div className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-green-600" />
              <span className="text-sm font-semibold">{stats.totalItems}</span>
              <span className="text-xs text-muted-foreground">
                item{stats.totalItems !== 1 ? "s" : ""} checked
              </span>
            </div>

            {/* Streak */}
            {stats.streakDays > 1 && (
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-sm font-semibold">{stats.streakDays}</span>
                <span className="text-xs text-muted-foreground">day streak</span>
              </div>
            )}

            {/* Top category chip */}
            {topCategory && (
              <div className="hidden sm:flex items-center gap-1.5">
                <CategoryIcon
                  category={topCategory[0] as DisposalCategory}
                  size="xs"
                  bare
                />
                <span className="text-xs text-muted-foreground">
                  {CATEGORY_META[topCategory[0] as DisposalCategory]?.label}
                </span>
              </div>
            )}
          </div>

          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Progress to next milestone */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {stats.totalItems}/{milestone}
          </span>
        </div>
      </button>

      {/* Expanded dashboard */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border bg-muted/20 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category breakdown
                </span>
              </div>

              <div className="space-y-2.5">
                {sortedCategories.map(([cat, count]) => {
                  const meta = CATEGORY_META[cat as DisposalCategory];
                  if (!meta) return null;
                  const pct = (count / maxCount) * 100;

                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <CategoryIcon
                        category={cat as DisposalCategory}
                        size="xs"
                        bare
                      />
                      <span className="text-xs font-medium w-16 truncate">
                        {meta.label}
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: meta.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {stats.firstUseDate && (
                <p className="text-[10px] text-muted-foreground text-center pt-1">
                  Tracking since{" "}
                  {new Date(stats.firstUseDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
