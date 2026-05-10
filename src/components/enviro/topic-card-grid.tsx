"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { TopicCardCompact } from "./topic-card";

export function TopicCardGrid({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  if (cards.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No topics match your search.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <TopicCardCompact key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
}
