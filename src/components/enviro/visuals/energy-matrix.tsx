"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState } from "react";

const ENERGY_SOURCES = [
  { name: "Coal", type: "nonrenewable", advantages: "Abundant, cheap, reliable baseload", disadvantages: "CO₂, SO₂, NOₓ, particulates, mercury, mining habitat destruction, ash disposal", efficiency: "33–40%", co2: "Very high (~2.2 lb CO₂/kWh)", use: "Electricity, industry", note: "Largest source of electricity globally; declining in many countries" },
  { name: "Oil/Petroleum", type: "nonrenewable", advantages: "Energy-dense, portable, existing infrastructure", disadvantages: "CO₂, air pollution, oil spills, geopolitical conflicts", efficiency: "20–35% (vehicles)", co2: "High (~1.6 lb CO₂/kWh)", use: "Transportation, industry, heating", note: "Dominant transportation fuel" },
  { name: "Natural Gas", type: "nonrenewable", advantages: "Cleanest fossil fuel, flexible, combined-cycle efficient", disadvantages: "CH₄ leaks (potent GHG), fracking impacts, water contamination", efficiency: "40–60%", co2: "Moderate (~0.9 lb CO₂/kWh)", use: "Electricity, heating, cooking", note: "Bridge fuel debate — cleaner than coal but still fossil fuel" },
  { name: "Nuclear Fission", type: "nonrenewable", advantages: "No CO₂ during operation, high energy density, reliable baseload", disadvantages: "Radioactive waste, meltdown risk, high construction cost, uranium mining", efficiency: "33–37%", co2: "Very low (lifecycle only)", use: "Electricity (baseload)", note: "Produces radioactive waste requiring long-term storage" },
  { name: "Solar (PV)", type: "renewable", advantages: "No emissions during operation, abundant, modular, decreasing cost", disadvantages: "Intermittent (night/clouds), land use, manufacturing pollution, battery storage needed", efficiency: "15–22%", co2: "None during operation", use: "Electricity, heating", note: "Fastest-growing energy source" },
  { name: "Wind", type: "renewable", advantages: "No emissions during operation, low operating cost, scalable", disadvantages: "Intermittent, bird/bat mortality, visual/noise impacts, manufacturing footprint", efficiency: "25–45%", co2: "None during operation", use: "Electricity", note: "Offshore wind has higher capacity factor" },
  { name: "Hydroelectric", type: "renewable", advantages: "No emissions during operation, reliable, flood control, recreation", disadvantages: "Habitat disruption, altered sediment flow, methane from reservoirs, displacement of communities", efficiency: "80–90%+", co2: "Very low", use: "Electricity", note: "Dams block fish migration and alter river ecosystems" },
  { name: "Biomass/Biofuel", type: "renewable", advantages: "Carbon-neutral if regrown, uses waste, domestic production", disadvantages: "Land use competition with food, deforestation risk, lower energy density, air pollution from burning", efficiency: "20–40%", co2: "Net low if sustainably sourced", use: "Electricity, transportation, heating", note: "Ethanol from corn competes with food production" },
  { name: "Geothermal", type: "renewable", advantages: "Reliable (24/7), small footprint, low emissions", disadvantages: "Location-limited (tectonic areas), high upfront cost, potential induced seismicity, H₂S release", efficiency: "10–23%", co2: "Very low", use: "Electricity, direct heating", note: "Limited to geologically active regions" },
  { name: "Hydrogen Fuel Cell", type: "renewable", advantages: "Only produces water vapor, high efficiency, versatile", disadvantages: "Requires energy to produce H₂ (often from fossil fuels), storage challenges, infrastructure needed", efficiency: "40–60%", co2: "Depends on production method", use: "Transportation, backup power", note: "'Green hydrogen' from electrolysis with renewable energy is truly clean" },
];

export function EnergyView({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "renewable" | "nonrenewable">("all");

  const filtered = filter === "all"
    ? ENERGY_SOURCES
    : ENERGY_SOURCES.filter((e) => e.type === filter);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Energy &amp; Math</h2>
        <p className="text-sm text-muted-foreground">
          {ENERGY_SOURCES.length} energy sources — advantages, disadvantages, efficiency, emissions, tradeoffs
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(["all", "renewable", "nonrenewable"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {f === "all" ? "All" : f === "renewable" ? "Renewable" : "Nonrenewable"}
          </button>
        ))}
      </div>

      {/* Comparison table for desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2 font-semibold">Source</th>
              <th className="p-2 font-semibold">Type</th>
              <th className="p-2 font-semibold">Efficiency</th>
              <th className="p-2 font-semibold">CO₂</th>
              <th className="p-2 font-semibold">Advantages</th>
              <th className="p-2 font-semibold">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.name} className="border-b hover:bg-muted/50">
                <td className="p-2 font-medium">{e.name}</td>
                <td className="p-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    e.type === "renewable" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  }`}>
                    {e.type}
                  </span>
                </td>
                <td className="p-2">{e.efficiency}</td>
                <td className="p-2">{e.co2}</td>
                <td className="p-2 text-muted-foreground">{e.advantages}</td>
                <td className="p-2 text-muted-foreground">{e.disadvantages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {filtered.map((e) => (
          <div
            key={e.name}
            className="cursor-pointer rounded-xl border bg-card p-3 transition-all hover:border-primary/50"
            onClick={() => setExpanded(expanded === e.name ? null : e.name)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{e.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                e.type === "renewable" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}>
                {e.type}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <span className="text-muted-foreground">Efficiency: {e.efficiency}</span>
              <span className="text-muted-foreground">CO₂: {e.co2}</span>
            </div>
            {expanded === e.name && (
              <div className="mt-2 space-y-1 border-t pt-2 text-xs">
                <p><strong className="text-green-600 dark:text-green-400">+</strong> {e.advantages}</p>
                <p><strong className="text-red-600 dark:text-red-400">−</strong> {e.disadvantages}</p>
                <p className="text-muted-foreground italic">{e.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
