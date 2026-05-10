"use client";

import type { TopicCard, CauseEffectChain } from "@/lib/enviro/types";
import { useState } from "react";

const TYPE_COLORS: Record<string, string> = {
  cause: "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400",
  mechanism: "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400",
  effect: "bg-orange-500/10 border-orange-500/40 text-orange-700 dark:text-orange-400",
  consequence: "bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-400",
  solution: "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400",
  tradeoff: "bg-slate-500/10 border-slate-500/40 text-slate-700 dark:text-slate-400",
};

function ChainDiagram({ chain }: { chain: CauseEffectChain }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3">
        <span className="text-xs text-muted-foreground">{chain.unit} &middot; Topic {chain.topicNumber}</span>
        <h3 className="text-sm font-bold">{chain.title}</h3>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {chain.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`rounded-md border px-3 py-1.5 text-xs font-medium ${TYPE_COLORS[step.type]}`}>
              <span className="block text-[9px] uppercase opacity-70">{step.type}</span>
              {step.label}
            </div>
            {i < chain.steps.length - 1 && (
              <svg className="h-3 w-5 shrink-0 text-muted-foreground" viewBox="0 0 20 12">
                <path d="M0 6h16m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CauseEffectView({
  chains,
  cards,
  onCardClick,
}: {
  chains: CauseEffectChain[];
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  const [unitFilter, setUnitFilter] = useState("all");

  const filtered = unitFilter === "all"
    ? chains
    : chains.filter((c) => c.unit === unitFilter);

  const units = [...new Set(chains.map((c) => c.unit))].sort();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Cause &amp; Effect Chains</h2>
        <p className="text-sm text-muted-foreground">
          Every major environmental process — cause → mechanism → effect → consequence → solution → tradeoff
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(TYPE_COLORS).map(([type, cls]) => (
          <span key={type} className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
            {type}
          </span>
        ))}
      </div>

      <div className="flex justify-center">
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">All Units ({chains.length})</option>
          {units.map((u) => (
            <option key={u} value={u}>{u} ({chains.filter((c) => c.unit === u).length})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((chain) => (
          <ChainDiagram key={chain.id} chain={chain} />
        ))}
      </div>
    </div>
  );
}
