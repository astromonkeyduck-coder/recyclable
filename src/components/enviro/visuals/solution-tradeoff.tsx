"use client";

import type { TopicCard, SolutionTradeoff } from "@/lib/enviro/types";

export function SolutionTradeoffView({
  solutions,
  cards,
  onCardClick,
}: {
  solutions: SolutionTradeoff[];
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Solutions &amp; Tradeoffs</h2>
        <p className="text-sm text-muted-foreground">
          Every environmental solution — mechanism, advantage, disadvantage, unintended consequence, stakeholder tradeoff
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((sol) => (
          <div key={sol.id} className="rounded-xl border bg-card p-4 space-y-2">
            <div>
              <span className="text-[10px] text-muted-foreground">{sol.unit} &middot; Topic {sol.topicNumber}</span>
              <h3 className="text-sm font-bold">{sol.solution}</h3>
            </div>

            <div className="text-xs">
              <p className="text-muted-foreground"><strong>Mechanism:</strong> {sol.mechanism}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-green-500/5 border border-green-500/20 p-2">
                <span className="font-semibold text-green-700 dark:text-green-400">Advantage</span>
                <p className="text-muted-foreground">{sol.advantage}</p>
              </div>
              <div className="rounded-md bg-red-500/5 border border-red-500/20 p-2">
                <span className="font-semibold text-red-700 dark:text-red-400">Disadvantage</span>
                <p className="text-muted-foreground">{sol.disadvantage}</p>
              </div>
            </div>

            <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-2 text-xs">
              <span className="font-semibold text-amber-700 dark:text-amber-400">Unintended Consequence</span>
              <p className="text-muted-foreground">{sol.unintendedConsequence}</p>
            </div>

            <div className="text-xs text-muted-foreground">
              <strong>Stakeholder Tradeoff:</strong> {sol.stakeholderTradeoff}
            </div>

            <div className="rounded-md bg-primary/5 p-2 text-xs italic">
              <strong>FRQ:</strong> {sol.frqSentence}
            </div>
          </div>
        ))}

        {solutions.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-8">
            Solution tradeoff data loading...
          </div>
        )}
      </div>
    </div>
  );
}
