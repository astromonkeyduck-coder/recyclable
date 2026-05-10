"use client";

import type { Misconception } from "@/lib/enviro/types";
import { useState } from "react";

export function MisconceptionLab({
  misconceptions,
}: {
  misconceptions: Misconception[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = misconceptions[currentIndex % misconceptions.length];

  if (!current) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading misconceptions...</div>;
  }

  function next() {
    setRevealed(false);
    setCurrentIndex((i) => (i + 1) % misconceptions.length);
  }

  function prev() {
    setRevealed(false);
    setCurrentIndex((i) => (i - 1 + misconceptions.length) % misconceptions.length);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Misconception Lab</h2>
        <p className="text-sm text-muted-foreground">
          Identify the error, learn the correction — {misconceptions.length} common AP traps
        </p>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        {currentIndex + 1} / {misconceptions.length}
      </div>

      {/* Misconception card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{current.unit} &middot; Topic {current.topicNumber}</span>
        </div>

        {/* Wrong statement */}
        <div className="rounded-lg border-2 border-red-500/40 bg-red-500/5 p-4 text-center">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-1">
            Common Wrong Statement
          </p>
          <p className="text-base font-medium">
            &ldquo;{current.wrongStatement}&rdquo;
          </p>
        </div>

        {/* Why tempting */}
        <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
          <p className="text-xs">
            <strong className="text-amber-700 dark:text-amber-400">Why it seems right:</strong>{" "}
            {current.whyTempting}
          </p>
        </div>

        {/* Reveal button */}
        {!revealed && (
          <div className="text-center">
            <button
              onClick={() => setRevealed(true)}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Reveal Correction
            </button>
          </div>
        )}

        {/* Correction */}
        {revealed && (
          <>
            <div className="rounded-lg border-2 border-green-500/40 bg-green-500/5 p-4 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">
                Correct Statement
              </p>
              <p className="text-base font-medium">
                &ldquo;{current.correctStatement}&rdquo;
              </p>
            </div>

            <div className="rounded-md bg-primary/5 p-3">
              <p className="text-xs">
                <strong className="text-primary">AP-Safe Sentence:</strong>{" "}
                <span className="italic">{current.apSafeSentence}</span>
              </p>
            </div>
          </>
        )}
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

      {/* Grid view */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">All Misconceptions</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {misconceptions.map((m, i) => (
            <button
              key={m.id}
              onClick={() => { setCurrentIndex(i); setRevealed(false); }}
              className={`rounded-md border p-2 text-left text-xs transition-colors hover:border-primary/50 ${
                i === currentIndex ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <span className="text-muted-foreground">{m.unit} {m.topicNumber}</span>
              <p className="font-medium line-clamp-1">{m.wrongStatement}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
