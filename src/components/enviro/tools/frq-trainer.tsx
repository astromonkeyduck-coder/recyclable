"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState, useMemo } from "react";

interface FRQItem {
  id: string;
  unit: string;
  topicNumber: string;
  topicTitle: string;
  prompt: string;
  taskVerb: string;
  modelSentence: string;
  weakAnswer: string;
  whyWeakFails: string;
  strongAnswer: string;
  commonMistake: string;
}

function buildFRQItems(cards: TopicCard[]): FRQItem[] {
  return cards.map((c) => ({
    id: c.id,
    unit: c.unit,
    topicNumber: c.topicNumber,
    topicTitle: c.topicTitle,
    prompt: c.frqUse,
    taskVerb: c.frqUse.toLowerCase().startsWith("explain") ? "Explain" :
              c.frqUse.toLowerCase().startsWith("describe") ? "Describe" :
              c.frqUse.toLowerCase().startsWith("identify") ? "Identify" :
              c.frqUse.toLowerCase().startsWith("calculate") ? "Calculate" : "Explain",
    modelSentence: c.modelSentence,
    weakAnswer: c.commonMistake,
    whyWeakFails: `This answer is too vague or contains the common misconception: "${c.commonMistake}"`,
    strongAnswer: c.modelSentence,
    commonMistake: c.commonMistake,
  }));
}

export function FRQTrainer({ cards }: { cards: TopicCard[] }) {
  const items = useMemo(() => buildFRQItems(cards), [cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showWeak, setShowWeak] = useState(false);
  const [unitFilter, setUnitFilter] = useState("all");

  const filtered = unitFilter === "all" ? items : items.filter((i) => i.unit === unitFilter);
  const current = filtered[currentIndex % filtered.length];
  const units = [...new Set(items.map((i) => i.unit))].sort();

  if (!current) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No FRQ items match.</div>;
  }

  function next() {
    setShowAnswer(false);
    setShowWeak(false);
    setCurrentIndex((i) => (i + 1) % filtered.length);
  }

  function prev() {
    setShowAnswer(false);
    setShowWeak(false);
    setCurrentIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">FRQ Visual Trainer</h2>
        <p className="text-sm text-muted-foreground">
          Practice AP-style FRQ responses with model sentences, weak answers, and scoring guidance
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          AP-style practice, not official College Board material.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <select
          value={unitFilter}
          onChange={(e) => { setUnitFilter(e.target.value); setCurrentIndex(0); setShowAnswer(false); }}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">All Units ({items.length})</option>
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {(currentIndex % filtered.length) + 1} / {filtered.length}
        </span>
      </div>

      {/* Prompt card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {current.taskVerb}
          </span>
          <span className="text-xs text-muted-foreground">
            {current.unit} &middot; {current.topicNumber} {current.topicTitle}
          </span>
        </div>

        <p className="text-base font-medium leading-relaxed">
          {current.prompt}
        </p>

        {/* Weak answer toggle */}
        <div>
          <button
            onClick={() => setShowWeak(!showWeak)}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            {showWeak ? "Hide" : "Show"} weak answer example
          </button>
          {showWeak && (
            <div className="mt-2 rounded-md border border-red-500/30 bg-red-500/5 p-3 space-y-1">
              <p className="text-sm italic text-red-700 dark:text-red-400">
                &ldquo;{current.weakAnswer}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Why this fails:</strong> {current.whyWeakFails}
              </p>
            </div>
          )}
        </div>

        {/* Strong answer */}
        <div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
          >
            {showAnswer ? "Hide" : "Show"} model response
          </button>
          {showAnswer && (
            <div className="mt-2 rounded-md border border-green-500/30 bg-green-500/5 p-3">
              <p className="text-sm italic text-green-700 dark:text-green-400">
                &ldquo;{current.strongAnswer}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Common mistake */}
        <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-2">
          <p className="text-xs">
            <strong className="text-amber-700 dark:text-amber-400">What NOT to say:</strong>{" "}
            {current.commonMistake}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3">
        <button onClick={prev} className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
          ← Previous
        </button>
        <button onClick={next} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Next →
        </button>
      </div>
    </div>
  );
}
