"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const PRESETS = [
  { label: "CO₂ ppm increase (1960→2024)", initial: 317, final: 422, time: 64, units: "ppm", variable: "CO₂ concentration" },
  { label: "World population growth (1950→2024)", initial: 2.5, final: 8.1, time: 74, units: "billion people", variable: "World population" },
  { label: "US energy consumption (2000→2023)", initial: 98.8, final: 93.6, time: 23, units: "quads (10¹⁵ BTU)", variable: "Energy consumption" },
  { label: "Solar electricity cost drop (2010→2023)", initial: 0.36, final: 0.049, time: 13, units: "$/kWh", variable: "Solar LCOE" },
  { label: "Dissolved oxygen decline (upstream→downstream)", initial: 9.2, final: 3.1, time: 1, units: "mg/L", variable: "DO concentration" },
  { label: "Nitrate increase (pre-fertilizer→post)", initial: 2.5, final: 18.7, time: 1, units: "mg/L", variable: "Nitrate concentration" },
  { label: "Amazon deforestation (2000→2022)", initial: 4130000, final: 3340000, time: 22, units: "km²", variable: "Amazon forest area" },
  { label: "Species decline (Living Planet Index 1970→2018)", initial: 100, final: 31, time: 48, units: "index", variable: "Wildlife population index" },
  { label: "US recycling rate (1980→2018)", initial: 9.6, final: 32.1, time: 38, units: "%", variable: "Recycling rate" },
  { label: "Municipal solid waste (1960→2018)", initial: 88, final: 292, time: 58, units: "million tons/yr", variable: "MSW generated" },
  { label: "Global water use (1950→2020)", initial: 1382, final: 4600, time: 70, units: "km³/yr", variable: "Water withdrawal" },
  { label: "US coal electricity share (2005→2023)", initial: 49.6, final: 16.2, time: 18, units: "%", variable: "Coal share of electricity" },
];

export function PercentChangeLab() {
  const [initial, setInitial] = useState(317);
  const [final_, setFinal] = useState(422);
  const [time, setTime] = useState(64);
  const [units, setUnits] = useState("ppm");
  const [variable, setVariable] = useState("CO₂ concentration");
  const [population, setPopulation] = useState<number | null>(null);

  const percentChange = initial !== 0 ? ((final_ - initial) / initial) * 100 : 0;
  const rateOfChange = time > 0 ? (final_ - initial) / time : 0;
  const perCapita = population && population > 0 ? final_ / population : null;
  const isIncrease = final_ > initial;

  function loadPreset(p: (typeof PRESETS)[number]) {
    setInitial(p.initial);
    setFinal(p.final);
    setTime(p.time);
    setUnits(p.units);
    setVariable(p.variable);
    setPopulation(null);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Percent Change Lab</h2>
        <p className="text-sm text-muted-foreground">
          Calculate percent change, rate of change, per capita values with AP-style interpretation
        </p>
      </div>

      {/* Presets */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Presets</h3>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p)}
              className="rounded-md border bg-card px-2.5 py-1 text-[11px] hover:border-primary/50 hover:bg-accent transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Variable Name</label>
          <Input value={variable} onChange={(e) => setVariable(e.target.value)} className="h-9 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Initial Value</label>
          <Input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Final Value</label>
          <Input type="number" value={final_} onChange={(e) => setFinal(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Time Period (years)</label>
          <Input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Units</label>
          <Input value={units} onChange={(e) => setUnits(e.target.value)} className="h-9 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Population (optional)</label>
          <Input type="number" value={population ?? ""} onChange={(e) => setPopulation(e.target.value ? Number(e.target.value) : null)} className="h-9 text-sm" placeholder="For per capita" />
        </div>
      </div>

      {/* Before/After Bar */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Before → After</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-16 text-xs text-muted-foreground">Initial</span>
            <div className="flex-1 rounded-full bg-muted h-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500/70 transition-all"
                style={{ width: `${Math.min(100, (initial / Math.max(initial, final_)) * 100)}%` }}
              />
            </div>
            <span className="w-24 text-right text-xs font-medium">{initial.toLocaleString()} {units}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-xs text-muted-foreground">Final</span>
            <div className="flex-1 rounded-full bg-muted h-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isIncrease ? "bg-red-500/70" : "bg-green-500/70"}`}
                style={{ width: `${Math.min(100, (final_ / Math.max(initial, final_)) * 100)}%` }}
              />
            </div>
            <span className="w-24 text-right text-xs font-medium">{final_.toLocaleString()} {units}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Percent Change */}
        <div className="rounded-xl border bg-card p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Percent Change</h4>
          <p className={`text-2xl font-bold ${isIncrease ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(1)}%
          </p>
          <div className="mt-2 rounded-md bg-muted p-2 text-xs font-mono">
            <p>% change = ((final − initial) / initial) × 100</p>
            <p>= (({final_} − {initial}) / {initial}) × 100</p>
            <p>= ({(final_ - initial).toLocaleString()} / {initial}) × 100</p>
            <p>= <strong>{percentChange.toFixed(2)}%</strong></p>
          </div>
        </div>

        {/* Rate of Change */}
        <div className="rounded-xl border bg-card p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Rate of Change</h4>
          <p className={`text-2xl font-bold ${isIncrease ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {rateOfChange >= 0 ? "+" : ""}{rateOfChange.toFixed(2)} {units}/yr
          </p>
          <div className="mt-2 rounded-md bg-muted p-2 text-xs font-mono">
            <p>rate = (final − initial) / time</p>
            <p>= ({final_} − {initial}) / {time}</p>
            <p>= <strong>{rateOfChange.toFixed(4)} {units}/yr</strong></p>
          </div>
        </div>

        {/* Per capita */}
        {perCapita !== null && (
          <div className="rounded-xl border bg-card p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Per Capita</h4>
            <p className="text-2xl font-bold text-primary">
              {perCapita.toFixed(4)} {units}/person
            </p>
            <div className="mt-2 rounded-md bg-muted p-2 text-xs font-mono">
              <p>per capita = total / population</p>
              <p>= {final_} / {population!.toLocaleString()}</p>
              <p>= <strong>{perCapita.toFixed(4)}</strong></p>
            </div>
          </div>
        )}

        {/* Average annual change */}
        {time > 0 && (
          <div className="rounded-xl border bg-card p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Avg Annual % Change</h4>
            <p className="text-2xl font-bold text-primary">
              {(percentChange / time).toFixed(2)}%/yr
            </p>
          </div>
        )}
      </div>

      {/* AP Interpretation */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <h4 className="mb-1 text-sm font-semibold text-primary">AP-Style Interpretation</h4>
        <p className="text-sm leading-relaxed">
          {variable} {isIncrease ? "increased" : "decreased"} from {initial.toLocaleString()} {units} to {final_.toLocaleString()} {units}
          {time > 0 ? ` over ${time} years` : ""}, representing a {Math.abs(percentChange).toFixed(1)}% {isIncrease ? "increase" : "decrease"}
          {time > 0 ? ` at an average rate of ${Math.abs(rateOfChange).toFixed(2)} ${units} per year` : ""}.
        </p>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        AP-style practice, not official College Board material.
      </p>
    </div>
  );
}
