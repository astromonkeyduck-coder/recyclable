"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Eye,
  Cog,
  RefreshCw,
  ArrowRight,
  FlaskConical,
  BarChart3,
  PenLine,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const SECTION_ICONS = [
  BookOpen, Eye, Cog, RefreshCw, ArrowRight,
  FlaskConical, BarChart3, PenLine, AlertTriangle, XCircle,
];

const SECTION_TITLES = [
  "What It Is",
  "What It Looks Like",
  "How It Works",
  "What Changes It",
  "What Happens Next",
  "What Example Proves It",
  "What Graph/Data Could Show It",
  "What AP Might Test",
  "How to Write It",
  "What Not to Say",
];

export function TopicCardDetail({ card }: { card: TopicCard }) {
  const sections = [
    card.mustKnowConcept,
    card.diagramDescription,
    card.specificExamples.length > 0
      ? card.specificExamples.map((e, i) => <li key={i} className="ml-4 list-disc">{e}</li>)
      : "See diagram",
    card.humanImpacts.length > 0
      ? card.humanImpacts.map((h, i) => <li key={i} className="ml-4 list-disc">{h}</li>)
      : "N/A",
    card.effects.length > 0
      ? card.effects.map((e, i) => <li key={i} className="ml-4 list-disc">{e}</li>)
      : "N/A",
    card.specificExamples[0] ?? "See specific examples",
    card.graphConnection
      ? `${card.graphConnection.graphType}: ${card.graphConnection.xAxis} vs ${card.graphConnection.yAxis} — ${card.graphConnection.trend}`
      : "No direct graph connection",
    card.mcqTrap,
    card.modelSentence,
    card.commonMistake,
  ];

  return (
    <Accordion type="multiple" className="w-full">
      {SECTION_TITLES.map((title, i) => {
        const Icon = SECTION_ICONS[i];
        return (
          <AccordionItem key={i} value={`s-${i}`}>
            <AccordionTrigger className="text-sm font-medium">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed">
              {typeof sections[i] === "string" ? (
                <p>{sections[i]}</p>
              ) : (
                <ul className="space-y-1">{sections[i]}</ul>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function TopicCardCompact({
  card,
  onClick,
}: {
  card: TopicCard;
  onClick: (card: TopicCard) => void;
}) {
  return (
    <button
      onClick={() => onClick(card)}
      className="group w-full rounded-lg border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-xs font-medium text-muted-foreground">
            {card.topicNumber}
          </span>
          <h3 className="text-sm font-semibold leading-tight group-hover:text-primary">
            {card.topicTitle}
          </h3>
        </div>
        <Badge
          variant={
            card.examWeightRelevance === "high"
              ? "default"
              : card.examWeightRelevance === "medium"
                ? "secondary"
                : "outline"
          }
          className="shrink-0 text-[10px]"
        >
          {card.examWeightRelevance}
        </Badge>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {card.mustKnowConcept}
      </p>
      <div className="flex flex-wrap gap-1">
        {card.visualType.slice(0, 3).map((vt) => (
          <span
            key={vt}
            className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {vt.replace(/_/g, " ")}
          </span>
        ))}
        {card.visualType.length > 3 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            +{card.visualType.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}
