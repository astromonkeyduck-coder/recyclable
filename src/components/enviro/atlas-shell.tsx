"use client";

import { useState, useMemo, useCallback } from "react";
import { NAV_MODES, type NavMode, UNITS } from "@/lib/enviro/constants";
import type { TopicCard, CauseEffectChain, Misconception, SolutionTradeoff } from "@/lib/enviro/types";
import { AtlasNav } from "./atlas-nav";
import { TopicCardGrid } from "./topic-card-grid";
import { TopicCardDetail } from "./topic-card";
import { EverythingMap } from "./everything-map";
import { CycleView } from "./visuals/cycle-reservoir";
import { BiomeExplorer } from "./visuals/biome-explorer";
import { CauseEffectView } from "./visuals/cause-effect-chain";
import { GraphSimulatorView } from "./visuals/graph-simulator";
import { PercentChangeLab } from "./tools/percent-change-lab";
import { PollutionPathwayView } from "./visuals/pollution-pathway";
import { EnergyView } from "./visuals/energy-matrix";
import { SolutionTradeoffView } from "./visuals/solution-tradeoff";
import { FRQTrainer } from "./tools/frq-trainer";
import { MisconceptionLab } from "./tools/misconception-lab";
import { NightCram } from "./tools/night-cram";
import { SidePanel } from "./side-panel";
import { SearchFilterBar } from "./search-filter-bar";

import atlasDataRaw from "@/../data/enviro/atlas-data.json";
import causeEffectRaw from "@/../data/enviro/cause-effect-bank.json";
import misconceptionsRaw from "@/../data/enviro/misconceptions.json";
import solutionsRaw from "@/../data/enviro/solution-tradeoffs.json";

const atlasData = atlasDataRaw as TopicCard[];
const causeEffectData = causeEffectRaw as CauseEffectChain[];
const misconceptionsData = misconceptionsRaw as Misconception[];
const solutionsData = solutionsRaw as SolutionTradeoff[];

export function AtlasShell() {
  const [mode, setMode] = useState<NavMode>("everything");
  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<TopicCard | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const filteredCards = useMemo(() => {
    let cards = atlasData;
    if (unitFilter !== "all") {
      cards = cards.filter((c) => c.unit === unitFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.topicTitle.toLowerCase().includes(q) ||
          c.mustKnowConcept.toLowerCase().includes(q) ||
          c.specificExamples.some((e) => e.toLowerCase().includes(q)) ||
          c.id.toLowerCase().includes(q)
      );
    }
    return cards;
  }, [unitFilter, search]);

  const openSidePanel = useCallback((card: TopicCard) => {
    setSelectedCard(card);
    setSidePanelOpen(true);
  }, []);

  const closeSidePanel = useCallback(() => {
    setSidePanelOpen(false);
    setSelectedCard(null);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AtlasNav mode={mode} onModeChange={setMode} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-wrap items-center gap-3 border-b bg-background/95 backdrop-blur px-4 py-2.5 sm:flex-nowrap sm:px-6">
          <div className="min-w-0 shrink-0">
            <h1 className="text-base font-bold tracking-tight sm:text-lg whitespace-nowrap">
              APES Visual Exam Atlas
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              AP-style practice, not official College Board material
            </p>
          </div>
          <div className="ml-auto">
            <SearchFilterBar
              search={search}
              onSearchChange={setSearch}
              unitFilter={unitFilter}
              onUnitFilterChange={setUnitFilter}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {mode === "everything" && (
            <EverythingMap cards={atlasData} onCardClick={openSidePanel} />
          )}

          {mode === "units" && (
            <div className="space-y-8">
              {UNITS.map((unit) => {
                const unitCards = filteredCards.filter(
                  (c) => c.unit === `Unit ${unit.number}`
                );
                if (unitCards.length === 0) return null;
                return (
                  <section key={unit.id}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {unit.number}
                      </span>
                      <div>
                        <h2 className="text-base font-semibold">{unit.title}</h2>
                        <span className="text-xs text-muted-foreground">
                          {unit.weight} of exam &middot; {unit.topicCount} topics
                        </span>
                      </div>
                    </div>
                    <TopicCardGrid cards={unitCards} onCardClick={openSidePanel} />
                  </section>
                );
              })}
            </div>
          )}

          {mode === "cycles" && <CycleView cards={filteredCards} onCardClick={openSidePanel} />}
          {mode === "biomes" && <BiomeExplorer cards={filteredCards} onCardClick={openSidePanel} />}
          {mode === "cause-effect" && (
            <CauseEffectView chains={causeEffectData} cards={filteredCards} onCardClick={openSidePanel} />
          )}
          {mode === "graphs" && <GraphSimulatorView cards={filteredCards} onCardClick={openSidePanel} />}
          {mode === "percent-change" && <PercentChangeLab />}
          {mode === "pollution" && <PollutionPathwayView cards={filteredCards} onCardClick={openSidePanel} />}
          {mode === "energy" && <EnergyView cards={filteredCards} onCardClick={openSidePanel} />}
          {mode === "solutions" && (
            <SolutionTradeoffView solutions={solutionsData} onCardClick={openSidePanel} cards={filteredCards} />
          )}
          {mode === "frq" && <FRQTrainer cards={filteredCards} />}
          {mode === "misconceptions" && <MisconceptionLab misconceptions={misconceptionsData} />}
          {mode === "cram" && <NightCram cards={atlasData} onCardClick={openSidePanel} />}
        </main>
      </div>

      {sidePanelOpen && selectedCard && (
        <SidePanel card={selectedCard} onClose={closeSidePanel} />
      )}
    </div>
  );
}
