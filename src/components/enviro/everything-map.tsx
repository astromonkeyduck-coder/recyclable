"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { UNITS } from "@/lib/enviro/constants";
import { useState } from "react";

const LAYERS = [
  {
    id: "natural",
    label: "Natural Systems",
    color: "emerald",
    units: [1, 2, 3, 4],
    items: [
      "Ecosystems",
      "Biodiversity",
      "Populations",
      "Earth Systems",
      "Climate",
      "Biogeochemical Cycles",
    ],
  },
  {
    id: "human",
    label: "Human Use",
    color: "blue",
    units: [5, 6],
    items: [
      "Agriculture",
      "Forestry",
      "Fisheries",
      "Mining",
      "Urbanization",
      "Energy",
    ],
  },
  {
    id: "pollution",
    label: "Pollution & Disruption",
    color: "red",
    units: [7, 8],
    items: [
      "Air Pollution",
      "Water Pollution",
      "Soil Pollution",
      "Waste",
      "Health Effects",
      "Climate Change",
      "Biodiversity Loss",
    ],
  },
  {
    id: "solutions",
    label: "Solutions & Sustainability",
    color: "violet",
    units: [9],
    items: [
      "Conservation",
      "Mitigation",
      "Adaptation",
      "Legislation",
      "Technology",
      "Behavior Change",
      "Tradeoffs",
    ],
  },
];

const CROSS_UNIT_ARROWS = [
  { from: "Unit 1", to: "Unit 8", label: "Cycles → Eutrophication" },
  { from: "Unit 1", to: "Unit 9", label: "Cycles → Climate/Ocean Acidification" },
  { from: "Unit 2", to: "Unit 9", label: "Biodiversity → Endangered/Invasive Species" },
  { from: "Unit 3", to: "Unit 5", label: "Population Growth → Land/Water Use" },
  { from: "Unit 3", to: "Unit 6", label: "Population Growth → Energy Consumption" },
  { from: "Unit 4", to: "Unit 7", label: "Atmosphere/Wind → Air Pollution" },
  { from: "Unit 4", to: "Unit 9", label: "Climate Systems → Global Climate Change" },
  { from: "Unit 5", to: "Unit 7", label: "Agriculture/Mining → Atmospheric Pollution" },
  { from: "Unit 5", to: "Unit 8", label: "Agriculture/Mining → Water/Soil Pollution" },
  { from: "Unit 5", to: "Unit 9", label: "Land Use → Global Change" },
  { from: "Unit 6", to: "Unit 7", label: "Fossil Fuels → Atmospheric Pollution" },
  { from: "Unit 6", to: "Unit 9", label: "Fossil Fuels → Climate Change" },
  { from: "Unit 7", to: "Unit 9", label: "Air Pollution → Climate/Health" },
  { from: "Unit 8", to: "Unit 2", label: "Pollution → Biodiversity Loss" },
  { from: "Unit 8", to: "Unit 9", label: "Pollution → Global Change" },
  { from: "Unit 9", to: "Unit 1", label: "Global Change → Biome Shifts" },
];

const COLOR_MAP: Record<string, string> = {
  emerald: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  blue: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  red: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
  violet: "border-violet-500/50 bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

const DOT_MAP: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
};

export function EverythingMap({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [showArrows, setShowArrows] = useState(true);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Everything Map</h2>
        <p className="text-sm text-muted-foreground">
          APES as one interconnected system &middot; 4 layers &middot; 9 units &middot; {cards.length} topics
        </p>
      </div>

      {/* 4 System Layers */}
      <div className="grid gap-4 lg:grid-cols-2">
        {LAYERS.map((layer) => {
          const isExpanded = expandedLayer === layer.id;
          const layerCards = cards.filter((c) =>
            layer.units.some((u) => c.unit === `Unit ${u}`)
          );

          return (
            <div
              key={layer.id}
              className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${COLOR_MAP[layer.color]} ${
                isExpanded ? "lg:col-span-2" : ""
              }`}
              onClick={() =>
                setExpandedLayer(isExpanded ? null : layer.id)
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold">{layer.label}</h3>
                <span className="text-xs opacity-70">
                  Units {layer.units.join(", ")} &middot; {layerCards.length} topics
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {isExpanded && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {layerCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardClick(card);
                      }}
                      className="rounded-md border bg-background p-2 text-left text-xs hover:border-primary/50 transition-colors"
                    >
                      <span className="font-medium">{card.topicNumber}</span>{" "}
                      <span className="text-muted-foreground">{card.topicTitle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cross-unit relationship arrows */}
      <div>
        <button
          onClick={() => setShowArrows(!showArrows)}
          className="mb-3 text-sm font-semibold text-primary hover:underline"
        >
          {showArrows ? "Hide" : "Show"} Cross-Unit Connections ({CROSS_UNIT_ARROWS.length})
        </button>

        {showArrows && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CROSS_UNIT_ARROWS.map((arrow, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border bg-card p-2 text-xs"
              >
                <span className="font-medium text-primary">{arrow.from}</span>
                <svg className="h-3 w-6 shrink-0 text-muted-foreground" viewBox="0 0 24 12">
                  <path
                    d="M0 6h20m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-primary">{arrow.to}</span>
                <span className="ml-auto text-muted-foreground">{arrow.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unit cards summary */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">All Units at a Glance</h3>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {UNITS.map((unit) => {
            const unitCards = cards.filter(
              (c) => c.unit === `Unit ${unit.number}`
            );
            const highYield = unitCards.filter(
              (c) => c.examWeightRelevance === "high"
            );
            return (
              <div key={unit.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {unit.number}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold">{unit.title}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      {unit.weight} &middot; {unitCards.length} topics &middot;{" "}
                      {highYield.length} high-yield
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
