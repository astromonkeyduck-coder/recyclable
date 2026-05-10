"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState, useMemo } from "react";

const CRAM_PRIORITY_IDS = [
  "unit1_ecosystem_hierarchy", "unit1_species_interactions", "unit1_resource_partitioning",
  "unit1_terrestrial_biomes", "unit1_aquatic_biomes", "unit1_carbon_cycle",
  "unit1_nitrogen_cycle", "unit1_phosphorus_cycle", "unit1_hydrologic_cycle",
  "unit1_primary_productivity", "unit1_trophic_levels", "unit1_energy_flow_10_percent",
  "unit1_food_webs",
  "unit2_biodiversity", "unit2_ecosystem_services", "unit2_island_biogeography",
  "unit2_ecological_tolerance", "unit2_ecological_succession",
  "unit3_survivorship_curves", "unit3_carrying_capacity", "unit3_population_growth",
  "unit3_age_structure", "unit3_demographic_transition",
  "unit4_plate_tectonics", "unit4_soil_horizons", "unit4_atmosphere_layers",
  "unit4_global_wind_patterns", "unit4_watersheds", "unit4_el_nino_la_nina",
  "unit5_tragedy_commons", "unit5_irrigation_methods", "unit5_overfishing",
  "unit5_mining_impacts", "unit5_urbanization",
  "unit6_energy_sources", "unit6_fossil_fuel_pathway", "unit6_nuclear_power",
  "unit6_renewable_tradeoffs",
  "unit7_smog_formation", "unit7_thermal_inversion", "unit7_acid_rain",
  "unit7_indoor_pollutants",
  "unit8_eutrophication", "unit8_thermal_pollution", "unit8_biomagnification",
  "unit8_sewage_treatment", "unit8_ld50",
  "unit9_ozone_depletion", "unit9_greenhouse_effect", "unit9_ocean_acidification",
  "unit9_invasive_species", "unit9_human_impacts_biodiversity",
];

export function NightCram({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  const cramCards = useMemo(() => {
    const prioritized = CRAM_PRIORITY_IDS
      .map((id) => cards.find((c) => c.id === id))
      .filter(Boolean) as TopicCard[];
    const remaining = cards
      .filter((c) => c.examWeightRelevance === "high" && !CRAM_PRIORITY_IDS.includes(c.id));
    return [...prioritized, ...remaining];
  }, [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const current = cramCards[currentIndex];

  if (!current) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No cram items available.</div>;
  }

  const progress = ((currentIndex + 1) / cramCards.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Night-Before Visual Cram</h2>
        <p className="text-sm text-muted-foreground">
          {cramCards.length} highest-yield concepts — one diagram, one sentence, one trap, one FRQ
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {cramCards.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Cram card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">
              {current.topicNumber} &middot; {current.unit}
            </span>
            <h3 className="text-lg font-bold">{current.topicTitle}</h3>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {current.examWeightRelevance}
          </span>
        </div>

        {/* Must-know */}
        <div className="rounded-md bg-primary/5 p-3">
          <p className="text-xs font-semibold text-primary mb-1">MUST KNOW</p>
          <p className="text-sm leading-relaxed">{current.mustKnowConcept}</p>
        </div>

        {/* Specific example */}
        {current.specificExamples[0] && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">SPECIFIC EXAMPLE</p>
            <p className="text-sm">{current.specificExamples[0]}</p>
          </div>
        )}

        {/* AP Trap */}
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">AP TRAP</p>
          <p className="text-sm">{current.mcqTrap}</p>
        </div>

        {/* FRQ Sentence */}
        <div className="rounded-md border border-green-500/30 bg-green-500/5 p-3">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">FRQ SENTENCE</p>
          <p className="text-sm italic">{current.modelSentence}</p>
        </div>

        {/* What not to say */}
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">DO NOT SAY</p>
          <p className="text-sm">{current.commonMistake}</p>
        </div>

        {/* Toggle more detail */}
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-xs text-primary hover:underline"
        >
          {showDetail ? "Less detail" : "More detail (causes, effects, solutions)"}
        </button>

        {showDetail && (
          <div className="space-y-2 border-t pt-3">
            {current.causes.length > 0 && (
              <div className="text-xs">
                <strong>Causes:</strong> {current.causes.join("; ")}
              </div>
            )}
            {current.effects.length > 0 && (
              <div className="text-xs">
                <strong>Effects:</strong> {current.effects.join("; ")}
              </div>
            )}
            {current.solutions.length > 0 && (
              <div className="text-xs">
                <strong>Solutions:</strong> {current.solutions.join("; ")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => { setCurrentIndex((i) => Math.max(0, i - 1)); setShowDetail(false); }}
          className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          disabled={currentIndex === 0}
        >
          ← Back
        </button>
        <button
          onClick={() => onCardClick(current)}
          className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Full Detail
        </button>
        <button
          onClick={() => { setCurrentIndex((i) => Math.min(cramCards.length - 1, i + 1)); setShowDetail(false); }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          disabled={currentIndex === cramCards.length - 1}
        >
          Next →
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        AP-style practice, not official College Board material.
      </p>
    </div>
  );
}
