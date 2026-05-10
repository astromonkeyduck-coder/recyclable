"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState } from "react";

const GRAPH_FAMILIES = [
  {
    id: "exponential_growth",
    title: "Exponential Growth (J-curve)",
    xAxis: "Time",
    yAxis: "Population Size",
    xUnits: "years",
    yUnits: "individuals",
    trend: "Population increases at an accelerating rate — each generation adds more individuals than the last",
    relationship: "dN/dt = rN — growth rate proportional to current population size",
    cause: "Unlimited resources, no predators, no disease — ideal conditions rarely sustained",
    apInterpretation: "The steepening curve shows that as the population grows, the rate of increase also grows because more individuals are reproducing.",
    wrongInterpretation: "Saying the growth rate is constant — the RATE increases over time even though r stays the same",
    frqSentence: "Exponential growth occurs when a population has unlimited resources and no density-dependent limiting factors, producing a J-shaped curve where the rate of growth increases as the population size increases.",
    points: [0, 10, 20, 40, 80, 160, 320, 640, 1280],
  },
  {
    id: "logistic_growth",
    title: "Logistic Growth (S-curve)",
    xAxis: "Time",
    yAxis: "Population Size",
    xUnits: "years",
    yUnits: "individuals",
    trend: "Population grows rapidly then levels off at carrying capacity (K)",
    relationship: "dN/dt = rN((K-N)/K) — growth slows as N approaches K",
    cause: "Density-dependent factors (competition, predation, disease) limit growth as population approaches resource limits",
    apInterpretation: "The S-shaped curve shows that growth rate is highest at N=K/2 and approaches zero as the population reaches carrying capacity.",
    wrongInterpretation: "Saying the population stops growing at K — it fluctuates around K, not at a fixed point",
    frqSentence: "Logistic growth occurs when density-dependent limiting factors such as competition for food, predation, and disease slow population growth as it approaches the carrying capacity (K) of the environment.",
    points: [10, 20, 45, 100, 200, 380, 500, 540, 550],
  },
  {
    id: "survivorship_curves",
    title: "Survivorship Curves (Types I, II, III)",
    xAxis: "Age (% of maximum lifespan)",
    yAxis: "Number of Survivors (log scale)",
    xUnits: "% lifespan",
    yUnits: "log survivors",
    trend: "Type I: high survival until old age (humans). Type II: constant mortality (birds). Type III: high early mortality, few survivors (oysters, plants).",
    relationship: "Mortality rate varies by life stage and reproductive strategy",
    cause: "Type I: K-selected, parental care. Type II: constant predation risk. Type III: r-selected, many offspring with no care.",
    apInterpretation: "The shape of the curve indicates the species' reproductive strategy and when in its life it faces the greatest mortality risk.",
    wrongInterpretation: "Confusing the axes — this is SURVIVORS remaining, not deaths; the curve goes DOWN",
    frqSentence: "A Type III survivorship curve, typical of r-selected species like oysters, shows high mortality in early life stages because organisms produce many offspring with little parental investment.",
    points: [1000, 950, 900, 800, 600, 300, 100, 30, 5],
  },
  {
    id: "demographic_transition",
    title: "Demographic Transition Model (DTM)",
    xAxis: "Time / Development Stage",
    yAxis: "Rate (births/deaths per 1000)",
    xUnits: "stage (1-4)",
    yUnits: "per 1000",
    trend: "Birth and death rates both decline with industrialization; population grows rapidly in Stage 2-3 then stabilizes in Stage 4",
    relationship: "Economic development → lower death rates (Stage 2) → lower birth rates (Stage 3) → population stabilization (Stage 4)",
    cause: "Improved healthcare lowers death rate first; education, urbanization, and access to contraception lower birth rate later",
    apInterpretation: "The gap between birth rate and death rate represents the rate of natural increase — widest in Stage 2.",
    wrongInterpretation: "Saying Stage 4 means zero population growth — immigration and age structure can still cause growth",
    frqSentence: "In Stage 2 of the demographic transition model, death rates decline due to improved sanitation and healthcare while birth rates remain high, resulting in rapid population growth.",
    points: [40, 40, 40, 38, 30, 18, 14, 12, 12],
  },
  {
    id: "dissolved_oxygen_sag",
    title: "Dissolved Oxygen Sag Curve",
    xAxis: "Distance Downstream from Pollution Source",
    yAxis: "Dissolved Oxygen (mg/L)",
    xUnits: "km",
    yUnits: "mg/L",
    trend: "DO drops sharply below pollution input, reaches minimum (critical point), then gradually recovers downstream",
    relationship: "Organic waste → decomposer activity → oxygen consumption → DO drops → gradual reaeration",
    cause: "Decomposition of organic pollutants consumes dissolved oxygen; recovery occurs as water is reaerated",
    apInterpretation: "The lowest point on the sag curve (critical point) indicates where aquatic organisms with high oxygen requirements are most stressed.",
    wrongInterpretation: "Saying all the fish die everywhere — only organisms in the low-DO zone (sag) are affected; upstream and far downstream are fine",
    frqSentence: "The dissolved oxygen sag curve shows that organic pollution causes a decrease in dissolved oxygen downstream as decomposers consume O₂, followed by gradual recovery as reaeration occurs.",
    points: [9, 8, 4, 2, 3, 5, 7, 8, 8.5],
  },
  {
    id: "keeling_curve",
    title: "CO₂ Concentration Over Time (Keeling Curve)",
    xAxis: "Year",
    yAxis: "Atmospheric CO₂ (ppm)",
    xUnits: "year",
    yUnits: "ppm",
    trend: "Steadily increasing CO₂ with seasonal oscillation (sawtooth pattern) — rising from ~315 ppm (1958) to >420 ppm",
    relationship: "Fossil fuel combustion + deforestation → increasing atmospheric CO₂",
    cause: "Combustion of coal, oil, and natural gas transfers carbon from long-term geologic storage into the atmosphere",
    apInterpretation: "The overall upward trend shows net CO₂ increase; the seasonal zigzag reflects Northern Hemisphere photosynthesis (summer dip) and respiration/decomposition (winter rise).",
    wrongInterpretation: "Saying the seasonal dips mean CO₂ is decreasing — the overall trend is unmistakably upward",
    frqSentence: "The Keeling Curve demonstrates that atmospheric CO₂ concentration has increased steadily since 1958 due to fossil fuel combustion, with seasonal fluctuations caused by photosynthesis in the Northern Hemisphere.",
    points: [315, 325, 335, 345, 360, 375, 390, 405, 420],
  },
  {
    id: "dose_response",
    title: "Dose-Response Curve / LD50",
    xAxis: "Dose (concentration of toxicant)",
    yAxis: "% of Test Population Affected",
    xUnits: "mg/kg body weight",
    yUnits: "%",
    trend: "Sigmoidal (S-shaped) — low effect at low doses, rapid increase at moderate doses, plateau near 100%",
    relationship: "Higher dose → greater proportion of population affected; LD50 = dose at which 50% of test population dies",
    cause: "Increasing chemical concentration overwhelms organisms' detoxification capacity",
    apInterpretation: "The LD50 is the dose at the midpoint of the curve; a LOWER LD50 means the substance is MORE toxic (less is needed to kill).",
    wrongInterpretation: "Confusing lower LD50 with less toxic — it is the OPPOSITE: lower LD50 = more toxic",
    frqSentence: "The LD50 of a pesticide is the dose required to kill 50% of the test population; a lower LD50 indicates greater toxicity because less of the substance is needed to cause death.",
    points: [0, 2, 5, 15, 50, 85, 95, 98, 100],
  },
  {
    id: "age_structure",
    title: "Age Structure Diagrams",
    xAxis: "Population Size",
    yAxis: "Age Group",
    xUnits: "millions",
    yUnits: "age cohort",
    trend: "Wide base = rapid growth (young country). Even shape = stable. Narrow base = declining (aging country).",
    relationship: "Proportion of pre-reproductive, reproductive, and post-reproductive individuals predicts future growth",
    cause: "Birth rates, death rates, and age-specific fertility determine the shape",
    apInterpretation: "A wide base indicates many young people who will enter reproductive age, predicting continued population growth even if birth rates fall (population momentum).",
    wrongInterpretation: "Saying a wide base means current rapid growth — it actually PREDICTS future growth; the current rate depends on birth/death rates",
    frqSentence: "An age structure diagram with a wide base indicates a large pre-reproductive population, suggesting future population growth due to population momentum even if fertility rates decline.",
    points: [100, 90, 80, 70, 55, 40, 25, 12, 5],
  },
];

function GraphCard({ graph }: { graph: (typeof GRAPH_FAMILIES)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const maxY = Math.max(...graph.points);
  const h = 160;
  const w = 320;
  const padL = 40;
  const padB = 24;
  const padT = 10;
  const padR = 10;
  const plotW = w - padL - padR;
  const plotH = h - padB - padT;

  return (
    <div
      className="cursor-pointer rounded-xl border bg-card p-4 transition-all hover:border-primary/50"
      onClick={() => setExpanded(!expanded)}
    >
      <h3 className="mb-1 text-sm font-bold">{graph.title}</h3>
      <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{graph.trend}</p>

      {/* SVG Graph */}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 180 }}>
        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="currentColor" strokeWidth={1} className="text-border" />
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="currentColor" strokeWidth={1} className="text-border" />

        {/* Y-axis label */}
        <text x={4} y={h / 2} textAnchor="middle" fontSize={7} className="fill-muted-foreground" transform={`rotate(-90, 4, ${h / 2})`}>
          {graph.yAxis}
        </text>

        {/* X-axis label */}
        <text x={w / 2} y={h - 4} textAnchor="middle" fontSize={7} className="fill-muted-foreground">
          {graph.xAxis}
        </text>

        {/* Data line */}
        <polyline
          fill="none"
          stroke="var(--color-primary, #3b82f6)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={graph.points
            .map((y, i) => {
              const px = padL + (i / (graph.points.length - 1)) * plotW;
              const py = padT + plotH - (y / maxY) * plotH;
              return `${px},${py}`;
            })
            .join(" ")}
        />

        {/* Data points */}
        {graph.points.map((y, i) => {
          const px = padL + (i / (graph.points.length - 1)) * plotW;
          const py = padT + plotH - (y / maxY) * plotH;
          return <circle key={i} cx={px} cy={py} r={2.5} className="fill-primary" />;
        })}
      </svg>

      {expanded && (
        <div className="mt-3 space-y-2 border-t pt-3">
          <div className="text-xs"><strong>Axes:</strong> {graph.xAxis} ({graph.xUnits}) vs {graph.yAxis} ({graph.yUnits})</div>
          <div className="text-xs"><strong>Relationship:</strong> {graph.relationship}</div>
          <div className="text-xs"><strong>Cause:</strong> {graph.cause}</div>
          <div className="rounded-md bg-green-500/5 border border-green-500/20 p-2 text-xs">
            <strong>AP Interpretation:</strong> {graph.apInterpretation}
          </div>
          <div className="rounded-md bg-red-500/5 border border-red-500/20 p-2 text-xs">
            <strong>Wrong Interpretation:</strong> {graph.wrongInterpretation}
          </div>
          <div className="rounded-md bg-primary/5 p-2 text-xs italic">
            <strong>FRQ Sentence:</strong> {graph.frqSentence}
          </div>
        </div>
      )}
    </div>
  );
}

export function GraphSimulatorView({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Graphs &amp; Data</h2>
        <p className="text-sm text-muted-foreground">
          {GRAPH_FAMILIES.length} graph families — axes, units, trends, AP interpretation, common traps
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {GRAPH_FAMILIES.map((g) => (
          <GraphCard key={g.id} graph={g} />
        ))}
      </div>
    </div>
  );
}
