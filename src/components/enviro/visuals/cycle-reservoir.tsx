"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState } from "react";

const CYCLES = [
  {
    id: "carbon",
    title: "Carbon Cycle",
    topicNumber: "1.4",
    reservoirs: [
      { label: "Atmosphere\n(CO₂)", x: 300, y: 40, size: "medium" },
      { label: "Plants\n(Photosynthesis)", x: 100, y: 160, size: "medium" },
      { label: "Animals\n(Consumers)", x: 300, y: 200, size: "small" },
      { label: "Soil/Decomposers", x: 100, y: 320, size: "medium" },
      { label: "Fossil Fuels\n(Long-term)", x: 500, y: 320, size: "large" },
      { label: "Ocean\n(Dissolved CO₂)", x: 500, y: 160, size: "large" },
      { label: "Sediments/Rocks\n(Limestone)", x: 300, y: 400, size: "large" },
    ],
    arrows: [
      { from: 0, to: 1, label: "Photosynthesis", type: "fast" },
      { from: 1, to: 2, label: "Consumption", type: "fast" },
      { from: 2, to: 0, label: "Respiration", type: "fast" },
      { from: 1, to: 3, label: "Death/Decay", type: "fast" },
      { from: 3, to: 0, label: "Decomposition", type: "fast" },
      { from: 4, to: 0, label: "Combustion\n(HUMAN)", type: "fast" },
      { from: 3, to: 4, label: "Millions of years", type: "slow" },
      { from: 0, to: 5, label: "Dissolution", type: "fast" },
      { from: 5, to: 6, label: "Sedimentation", type: "slow" },
      { from: 6, to: 4, label: "Geologic processes", type: "slow" },
    ],
    apTrap: "Do not confuse short-term carbon exchange (photosynthesis/respiration) with long-term carbon storage (fossil fuels/sediments).",
    humanImpact: "Burning fossil fuels moves carbon from long-term geologic storage into the atmosphere much faster than natural processes can remove it.",
  },
  {
    id: "nitrogen",
    title: "Nitrogen Cycle",
    topicNumber: "1.5",
    reservoirs: [
      { label: "Atmosphere\n(N₂ — 78%)", x: 300, y: 40, size: "large" },
      { label: "Nitrogen-fixing\nbacteria", x: 80, y: 160, size: "small" },
      { label: "Ammonium\n(NH₄⁺)", x: 80, y: 300, size: "small" },
      { label: "Nitrite/Nitrate\n(NO₂⁻/NO₃⁻)", x: 300, y: 300, size: "medium" },
      { label: "Plants", x: 300, y: 180, size: "medium" },
      { label: "Animals", x: 500, y: 180, size: "small" },
      { label: "Denitrifying\nbacteria", x: 520, y: 300, size: "small" },
      { label: "Fertilizer\n(HUMAN)", x: 520, y: 40, size: "small" },
      { label: "Waterways\n(Leaching)", x: 160, y: 400, size: "medium" },
    ],
    arrows: [
      { from: 0, to: 1, label: "N₂ fixation", type: "fast" },
      { from: 1, to: 2, label: "Fixed to NH₄⁺", type: "fast" },
      { from: 2, to: 3, label: "Nitrification", type: "fast" },
      { from: 3, to: 4, label: "Assimilation", type: "fast" },
      { from: 4, to: 5, label: "Consumption", type: "fast" },
      { from: 5, to: 2, label: "Ammonification\n(Death/waste)", type: "fast" },
      { from: 3, to: 6, label: "Denitrification", type: "fast" },
      { from: 6, to: 0, label: "Back to N₂", type: "fast" },
      { from: 7, to: 3, label: "Synthetic fertilizer", type: "fast" },
      { from: 3, to: 8, label: "Leaching/Runoff", type: "fast" },
    ],
    apTrap: "Nitrogen fixation converts atmospheric N₂ into usable forms — it does NOT mean nitrogen is 'fixed' or repaired.",
    humanImpact: "Synthetic fertilizer (Haber-Bosch process) adds reactive nitrogen, causing eutrophication in waterways and nitrous oxide (N₂O) greenhouse gas emissions.",
  },
  {
    id: "phosphorus",
    title: "Phosphorus Cycle",
    topicNumber: "1.6",
    reservoirs: [
      { label: "Rocks/Minerals\n(Apatite)", x: 100, y: 60, size: "large" },
      { label: "Soil\n(Dissolved PO₄³⁻)", x: 100, y: 220, size: "medium" },
      { label: "Plants", x: 300, y: 160, size: "medium" },
      { label: "Animals", x: 500, y: 160, size: "small" },
      { label: "Decomposers", x: 300, y: 320, size: "small" },
      { label: "Waterways/Ocean", x: 500, y: 320, size: "large" },
      { label: "Ocean Sediments", x: 500, y: 60, size: "large" },
      { label: "Fertilizer\n(HUMAN)", x: 300, y: 60, size: "small" },
    ],
    arrows: [
      { from: 0, to: 1, label: "Weathering", type: "slow" },
      { from: 1, to: 2, label: "Uptake", type: "fast" },
      { from: 2, to: 3, label: "Consumption", type: "fast" },
      { from: 3, to: 4, label: "Death/waste", type: "fast" },
      { from: 4, to: 1, label: "Decomposition", type: "fast" },
      { from: 1, to: 5, label: "Runoff", type: "fast" },
      { from: 5, to: 6, label: "Sedimentation", type: "slow" },
      { from: 6, to: 0, label: "Geologic uplift\n(millions of yrs)", type: "slow" },
      { from: 7, to: 1, label: "Fertilizer application", type: "fast" },
    ],
    apTrap: "Phosphorus has NO major atmospheric component — it cycles through rocks, water, soil, and organisms only. This makes it the slowest major biogeochemical cycle.",
    humanImpact: "Mining phosphate rock for fertilizer and excess application causes phosphorus runoff → algal blooms → eutrophication. Phosphorus is often the limiting nutrient in freshwater systems.",
  },
  {
    id: "water",
    title: "Hydrologic (Water) Cycle",
    topicNumber: "1.7",
    reservoirs: [
      { label: "Atmosphere\n(Water vapor)", x: 300, y: 40, size: "medium" },
      { label: "Ocean\n(96.5% of water)", x: 520, y: 200, size: "large" },
      { label: "Ice/Glaciers\n(1.7%)", x: 520, y: 60, size: "medium" },
      { label: "Surface water\n(Lakes/Rivers)", x: 100, y: 200, size: "medium" },
      { label: "Groundwater", x: 100, y: 350, size: "large" },
      { label: "Soil moisture", x: 300, y: 220, size: "small" },
      { label: "Plants\n(Transpiration)", x: 300, y: 140, size: "small" },
    ],
    arrows: [
      { from: 1, to: 0, label: "Evaporation", type: "fast" },
      { from: 0, to: 3, label: "Precipitation", type: "fast" },
      { from: 0, to: 1, label: "Precipitation\n(over ocean)", type: "fast" },
      { from: 3, to: 1, label: "Runoff", type: "fast" },
      { from: 3, to: 5, label: "Infiltration", type: "fast" },
      { from: 5, to: 4, label: "Percolation", type: "slow" },
      { from: 4, to: 3, label: "Groundwater flow", type: "slow" },
      { from: 5, to: 6, label: "Root uptake", type: "fast" },
      { from: 6, to: 0, label: "Transpiration", type: "fast" },
    ],
    apTrap: "Transpiration is water loss from plant leaves — it is a major driver of the water cycle on land, not just evaporation from surfaces.",
    humanImpact: "Impervious surfaces increase runoff and decrease infiltration. Groundwater overdraft depletes aquifers faster than recharge. Deforestation reduces transpiration and alters local precipitation patterns.",
  },
];

function CycleDiagram({ cycle }: { cycle: (typeof CYCLES)[number] }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const svgWidth = 620;
  const svgHeight = 460;

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-1 text-base font-bold">{cycle.title}</h3>
      <p className="mb-3 text-xs text-muted-foreground">Topic {cycle.topicNumber}</p>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: 420 }}
      >
        <defs>
          <marker id={`arrow-${cycle.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-muted-foreground" />
          </marker>
          <marker id={`arrow-slow-${cycle.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-amber-500" />
          </marker>
        </defs>

        {/* Arrows */}
        {cycle.arrows.map((arrow, i) => {
          const from = cycle.reservoirs[arrow.from];
          const to = cycle.reservoirs[arrow.to];
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const isSlow = arrow.type === "slow";

          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isSlow ? "var(--color-amber-500, #f59e0b)" : "var(--color-muted-foreground, #888)"}
                strokeWidth={isSlow ? 1.5 : 1.5}
                strokeDasharray={isSlow ? "6 3" : "none"}
                markerEnd={`url(#arrow-${isSlow ? "slow-" : ""}${cycle.id})`}
                opacity={0.6}
              />
              <text
                x={mx}
                y={my - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={8}
              >
                {arrow.label.split("\n").map((line, j) => (
                  <tspan key={j} x={mx} dy={j === 0 ? 0 : 10}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* Reservoirs */}
        {cycle.reservoirs.map((res, i) => {
          const isHovered = hoveredNode === i;
          const w = res.size === "large" ? 110 : res.size === "medium" ? 90 : 70;
          const h = res.size === "large" ? 50 : res.size === "medium" ? 42 : 34;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <rect
                x={res.x - w / 2}
                y={res.y - h / 2}
                width={w}
                height={h}
                rx={8}
                className={`${isHovered ? "fill-primary/20 stroke-primary" : "fill-card stroke-border"}`}
                strokeWidth={1.5}
              />
              <text
                x={res.x}
                y={res.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground"
                fontSize={9}
                fontWeight={500}
              >
                {res.label.split("\n").map((line, j) => (
                  <tspan key={j} x={res.x} dy={j === 0 ? (res.label.includes("\n") ? -6 : 0) : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(10, ${svgHeight - 30})`}>
          <line x1={0} y1={0} x2={30} y2={0} stroke="var(--color-muted-foreground, #888)" strokeWidth={1.5} />
          <text x={35} y={4} fontSize={8} className="fill-muted-foreground">Fast process</text>
          <line x1={120} y1={0} x2={150} y2={0} stroke="var(--color-amber-500, #f59e0b)" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={155} y={4} fontSize={8} className="fill-muted-foreground">Slow process (geologic time)</text>
        </g>
      </svg>

      {/* AP Trap + Human Impact */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2">
          <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">AP TRAP</p>
          <p className="text-xs leading-relaxed">{cycle.apTrap}</p>
        </div>
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-2">
          <p className="text-[10px] font-semibold text-red-700 dark:text-red-400">HUMAN IMPACT</p>
          <p className="text-xs leading-relaxed">{cycle.humanImpact}</p>
        </div>
      </div>
    </div>
  );
}

export function CycleView({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Biogeochemical Cycles</h2>
        <p className="text-sm text-muted-foreground">
          4 major cycles — reservoirs, processes, human impacts, AP traps
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {CYCLES.map((cycle) => (
          <CycleDiagram key={cycle.id} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}
