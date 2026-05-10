"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, BookOpen, Target, FlaskConical, BarChart3, PenLine, AlertTriangle, XCircle, Lightbulb, Link2 } from "lucide-react";
import { TopicCardDetail } from "./topic-card";

export function SidePanel({
  card,
  onClose,
}: {
  card: TopicCard;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l bg-background shadow-2xl sm:w-[480px]">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <span className="text-xs text-muted-foreground">
            {card.topicNumber} &middot; {card.unit}
          </span>
          <h2 className="text-base font-bold">{card.topicTitle}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{card.cedLearningObjective}</Badge>
            <Badge variant="outline">Big Idea: {card.bigIdea}</Badge>
            {card.sciencePractices.map((sp) => (
              <Badge key={sp} variant="secondary" className="text-[10px]">
                SP {sp}
              </Badge>
            ))}
            <Badge
              variant={card.examWeightRelevance === "high" ? "default" : "secondary"}
            >
              {card.examWeightRelevance} yield
            </Badge>
          </div>

          {/* Must-know concept */}
          <section>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Must-Know Concept
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {card.mustKnowConcept}
            </p>
          </section>

          {/* Diagram description */}
          <section>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Diagram
            </h3>
            <p className="text-sm text-muted-foreground">
              {card.diagramDescription}
            </p>
          </section>

          {/* Specific examples */}
          {card.specificExamples.length > 0 && (
            <section>
              <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <FlaskConical className="h-4 w-4 text-primary" /> Specific Examples
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {card.specificExamples.map((ex, i) => (
                  <li key={i} className="ml-4 list-disc">{ex}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Causes */}
          {card.causes.length > 0 && (
            <section>
              <h3 className="mb-1 text-sm font-semibold">Causes</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {card.causes.map((c, i) => (
                  <li key={i} className="ml-4 list-disc">{c}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Effects */}
          {card.effects.length > 0 && (
            <section>
              <h3 className="mb-1 text-sm font-semibold">Effects</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {card.effects.map((e, i) => (
                  <li key={i} className="ml-4 list-disc">{e}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Solutions */}
          {card.solutions.length > 0 && (
            <section>
              <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" /> Solutions
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {card.solutions.map((s, i) => (
                  <li key={i} className="ml-4 list-disc">{s}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Graph connection */}
          {card.graphConnection && (
            <section className="rounded-lg border bg-muted/50 p-3">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-primary" /> Graph Connection
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>{card.graphConnection.graphType}:</strong>{" "}
                {card.graphConnection.xAxis} vs {card.graphConnection.yAxis}
              </p>
              <p className="text-sm text-muted-foreground">
                Trend: {card.graphConnection.trend}
              </p>
              {card.graphConnection.possibleCalculation && (
                <p className="text-sm text-muted-foreground">
                  Calculation: {card.graphConnection.possibleCalculation}
                </p>
              )}
            </section>
          )}

          {/* FRQ model sentence */}
          <section className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
              <PenLine className="h-4 w-4" /> FRQ Model Sentence
            </h3>
            <p className="text-sm italic leading-relaxed">{card.modelSentence}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              <strong>FRQ Use:</strong> {card.frqUse}
            </p>
          </section>

          {/* MCQ Trap */}
          <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> MCQ Trap
            </h3>
            <p className="text-sm leading-relaxed">{card.mcqTrap}</p>
          </section>

          {/* Common mistake */}
          <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
              <XCircle className="h-4 w-4" /> Common Mistake
            </h3>
            <p className="text-sm leading-relaxed">{card.commonMistake}</p>
          </section>

          {/* Source */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link2 className="h-3 w-3" />
            {card.sourceStatus} &middot; Confidence: {card.confidence}
          </div>

          {/* Full accordion detail */}
          <TopicCardDetail card={card} />
        </div>
      </ScrollArea>
    </div>
  );
}
