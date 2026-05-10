"use client";

import type { TopicCard } from "@/lib/enviro/types";

const PATHWAYS = [
  {
    id: "eutrophication",
    title: "Eutrophication Pathway",
    unit: "Unit 8",
    steps: [
      { label: "Fertilizer / sewage runoff", type: "source" },
      { label: "Excess N & P enter waterway", type: "pathway" },
      { label: "Algal bloom (surface)", type: "effect" },
      { label: "Sunlight blocked → aquatic plants die", type: "effect" },
      { label: "Decomposers consume O₂", type: "mechanism" },
      { label: "Dissolved oxygen drops (hypoxia)", type: "effect" },
      { label: "Fish kill / dead zone", type: "consequence" },
      { label: "Buffer strips, reduce fertilizer, wetland restoration", type: "solution" },
    ],
  },
  {
    id: "acid_rain",
    title: "Acid Rain Pathway",
    unit: "Unit 7",
    steps: [
      { label: "Fossil fuel combustion (coal power plants, vehicles)", type: "source" },
      { label: "SO₂ and NOₓ released into atmosphere", type: "pathway" },
      { label: "Combine with water → H₂SO₄ and HNO₃", type: "mechanism" },
      { label: "Acid precipitation (rain, snow, fog)", type: "effect" },
      { label: "Aquatic acidification → fish/amphibian decline", type: "consequence" },
      { label: "Soil nutrient leaching (Ca²⁺, Mg²⁺)", type: "consequence" },
      { label: "Building/monument damage", type: "consequence" },
      { label: "Scrubbers, catalytic converters, Clean Air Act", type: "solution" },
    ],
  },
  {
    id: "smog_formation",
    title: "Photochemical Smog Formation",
    unit: "Unit 7",
    steps: [
      { label: "Vehicle exhaust & industry", type: "source" },
      { label: "NOₓ + VOCs released", type: "pathway" },
      { label: "UV sunlight drives reactions", type: "mechanism" },
      { label: "Ground-level O₃ + PANs formed", type: "effect" },
      { label: "Respiratory problems, crop damage", type: "consequence" },
      { label: "Worse in sunny cities with temperature inversions", type: "condition" },
      { label: "Catalytic converters, public transit, Clean Air Act", type: "solution" },
    ],
  },
  {
    id: "biomagnification",
    title: "Bioaccumulation → Biomagnification",
    unit: "Unit 8",
    steps: [
      { label: "Persistent toxin released (DDT, mercury, PCBs)", type: "source" },
      { label: "Absorbed by organisms from water/food", type: "pathway" },
      { label: "Bioaccumulation: toxin builds up in individual tissues", type: "mechanism" },
      { label: "Consumed by predator → toxin concentrates up food chain", type: "mechanism" },
      { label: "Biomagnification: highest concentration in top predators", type: "effect" },
      { label: "Eagles: thin eggshells (DDT). Humans: mercury in tuna.", type: "consequence" },
      { label: "Ban persistent chemicals, reduce point-source pollution", type: "solution" },
    ],
  },
  {
    id: "ozone_depletion",
    title: "Stratospheric Ozone Depletion",
    unit: "Unit 9",
    steps: [
      { label: "CFCs released (aerosols, refrigerants, foam)", type: "source" },
      { label: "CFCs rise to stratosphere", type: "pathway" },
      { label: "UV breaks CFC → releases chlorine radical (Cl·)", type: "mechanism" },
      { label: "Cl· catalyzes O₃ breakdown: O₃ → O₂ + O", type: "mechanism" },
      { label: "One Cl· destroys ~100,000 O₃ molecules", type: "effect" },
      { label: "Increased UV-B reaches surface → skin cancer, cataracts, crop damage", type: "consequence" },
      { label: "Montreal Protocol (1987) — banned CFCs, ozone recovering", type: "solution" },
    ],
  },
  {
    id: "climate_change",
    title: "Enhanced Greenhouse Effect → Climate Change",
    unit: "Unit 9",
    steps: [
      { label: "Fossil fuel combustion, deforestation, agriculture", type: "source" },
      { label: "CO₂, CH₄, N₂O increase in atmosphere", type: "pathway" },
      { label: "GHGs absorb and re-emit infrared radiation", type: "mechanism" },
      { label: "Enhanced greenhouse effect → global temperature rise", type: "effect" },
      { label: "Sea level rise, ice melt, extreme weather, habitat shifts", type: "consequence" },
      { label: "Positive feedback: permafrost thaw releases more CH₄", type: "feedback" },
      { label: "Reduce emissions, renewable energy, carbon capture, international agreements", type: "solution" },
    ],
  },
  {
    id: "mining_pollution",
    title: "Mining → Water Pollution",
    unit: "Unit 5",
    steps: [
      { label: "Surface or subsurface mining operation", type: "source" },
      { label: "Overburden removed, rock exposed", type: "pathway" },
      { label: "Sulfide minerals + water + air → sulfuric acid", type: "mechanism" },
      { label: "Acid mine drainage enters waterways", type: "effect" },
      { label: "Aquatic habitat destruction, heavy metal contamination", type: "consequence" },
      { label: "Tailings ponds, soil erosion, habitat fragmentation", type: "consequence" },
      { label: "Reclamation, buffer zones, water treatment, regulation", type: "solution" },
    ],
  },
  {
    id: "urban_runoff",
    title: "Urbanization → Runoff → Flooding",
    unit: "Unit 5",
    steps: [
      { label: "Urban development, roads, parking lots", type: "source" },
      { label: "Impervious surfaces prevent infiltration", type: "pathway" },
      { label: "Rainfall → rapid surface runoff", type: "mechanism" },
      { label: "Increased flood risk, erosion, combined sewer overflows", type: "effect" },
      { label: "Pollutants carried to waterways (oil, sediment, nutrients)", type: "consequence" },
      { label: "Urban heat island from less evapotranspiration", type: "consequence" },
      { label: "Permeable pavement, green roofs, rain gardens, retention ponds", type: "solution" },
    ],
  },
];

const STEP_COLORS: Record<string, string> = {
  source: "bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-400",
  pathway: "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400",
  mechanism: "bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-400",
  effect: "bg-orange-500/15 border-orange-500/40 text-orange-700 dark:text-orange-400",
  consequence: "bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-400",
  condition: "bg-slate-500/15 border-slate-500/40 text-slate-700 dark:text-slate-400",
  feedback: "bg-pink-500/15 border-pink-500/40 text-pink-700 dark:text-pink-400",
  solution: "bg-green-500/15 border-green-500/40 text-green-700 dark:text-green-400",
};

export function PollutionPathwayView({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Pollution Pathways</h2>
        <p className="text-sm text-muted-foreground">
          Source → Pathway → Mechanism → Effect → Consequence → Solution
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-[10px]">
        {Object.entries(STEP_COLORS).map(([type, cls]) => (
          <span key={type} className={`rounded border px-2 py-0.5 font-medium ${cls}`}>{type}</span>
        ))}
      </div>

      <div className="space-y-4">
        {PATHWAYS.map((pw) => (
          <div key={pw.id} className="rounded-xl border bg-card p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold">{pw.title}</h3>
              <span className="text-xs text-muted-foreground">{pw.unit}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {pw.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`rounded-md border px-2.5 py-1.5 text-xs ${STEP_COLORS[step.type] ?? STEP_COLORS.effect}`}>
                    {step.label}
                  </div>
                  {i < pw.steps.length - 1 && (
                    <svg className="h-3 w-4 shrink-0 text-muted-foreground" viewBox="0 0 16 12">
                      <path d="M0 6h12m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
