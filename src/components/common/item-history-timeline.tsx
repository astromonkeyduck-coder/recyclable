"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { CategoryIcon } from "@/components/common/category-icon";
import { useSfx } from "@/components/sfx/sfx-context";
import type { HistoryEntry } from "@/hooks/use-search-history";
import type { DisposalCategory } from "@/lib/providers/types";

type Props = {
  history: HistoryEntry[];
  providerId: string;
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
};

type Group = {
  label: string;
  entries: HistoryEntry[];
};

function groupByDate(entries: HistoryEntry[]): Group[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86_400_000;
  const weekStart = todayStart - 6 * 86_400_000;

  const groups: Record<string, HistoryEntry[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };

  for (const entry of entries) {
    const ts = entry.timestamp || 0;
    if (ts >= todayStart) groups.Today.push(entry);
    else if (ts >= yesterdayStart) groups.Yesterday.push(entry);
    else if (ts >= weekStart) groups["This week"].push(entry);
    else groups.Earlier.push(entry);
  }

  return Object.entries(groups)
    .filter(([, entries]) => entries.length > 0)
    .map(([label, entries]) => ({ label, entries }));
}

function relativeTime(ts: number): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ItemHistoryTimeline({
  history,
  providerId,
  onSelect,
  onRemove,
  onClear,
}: Props) {
  const groups = useMemo(() => groupByDate(history), [history]);
  const sfx = useSfx();

  if (history.length === 0) return null;

  return (
    <motion.div
      className="mt-6 w-full max-w-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            History
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.tap();
            onClear();
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-widest mb-1.5 pl-1">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.entries.map((entry, i) => (
                <div
                  key={`${entry.query}-${i}`}
                  className="group flex items-center gap-2 rounded-lg px-2.5 py-2 -mx-1 transition-colors hover:bg-muted/50"
                >
                  <button
                    onClick={() => {
                      sfx.pop();
                      onSelect(entry);
                    }}
                    className="flex flex-1 items-center gap-2.5 min-w-0 text-left focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    {entry.category ? (
                      <CategoryIcon
                        category={entry.category as DisposalCategory}
                        size="xs"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium truncate">
                      {entry.query}
                    </span>
                    {entry.timestamp > 0 && (
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-auto">
                        {relativeTime(entry.timestamp)}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.tap();
                      onRemove(entry.query);
                    }}
                    className="rounded-full p-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                    aria-label={`Remove ${entry.query}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
