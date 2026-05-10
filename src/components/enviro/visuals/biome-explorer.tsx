"use client";

import type { TopicCard } from "@/lib/enviro/types";
import { useState } from "react";

const TERRESTRIAL_BIOMES = [
  { name: "Tropical Rainforest", temp: "25–28°C", precip: ">200 cm/yr", latitude: "0–10°", productivity: "Very high", soil: "Nutrient-poor (rapid uptake)", keyAdaptation: "Tall canopy, epiphytes, drip-tip leaves", example: "Amazon — nutrient-poor soil because rapid decomposition and uptake prevent nutrient accumulation", climateShift: "Expanding droughts threaten moisture-dependent species" },
  { name: "Tropical Seasonal Forest/Savanna", temp: "20–30°C", precip: "50–130 cm/yr", latitude: "10–25°", productivity: "Moderate–High", soil: "Low nutrients, fire-adapted", keyAdaptation: "Thick bark, deep roots, fire resistance", example: "African savanna — seasonal fires maintain grassland and prevent tree encroachment", climateShift: "Longer dry seasons expand desertification" },
  { name: "Desert", temp: "Hot: 20–50°C / Cold: -10–20°C", precip: "<25 cm/yr", latitude: "15–35° (hot) / interior (cold)", productivity: "Very low", soil: "Sandy/rocky, little organic matter", keyAdaptation: "Waxy cuticle (cactus), fat storage (camel), nocturnal behavior", example: "Cactus waxy cuticle reduces water loss; camel stores fat not water in humps", climateShift: "Desertification expanding due to overgrazing and climate change" },
  { name: "Temperate Grassland", temp: "0–25°C", precip: "25–75 cm/yr", latitude: "30–50°", productivity: "Moderate", soil: "Deep, fertile topsoil (mollisols)", keyAdaptation: "Deep roots, fire tolerance, drought resistance", example: "North American prairies — deep fertile soil makes these prime agricultural land", climateShift: "Conversion to agriculture reduces native habitat" },
  { name: "Temperate Seasonal Forest", temp: "-5–25°C", precip: "75–150 cm/yr", latitude: "40–55°", productivity: "Moderate–High", soil: "Nutrient-rich from leaf litter decomposition", keyAdaptation: "Deciduous leaves, dormancy in winter", example: "Eastern US forests — nutrient-rich leaf litter supports high soil fertility", climateShift: "Warmer winters disrupt seasonal timing" },
  { name: "Temperate Rainforest", temp: "5–20°C", precip: ">200 cm/yr", latitude: "40–60° (coastal)", productivity: "High", soil: "Acidic, rich in organic matter", keyAdaptation: "Epiphytes, mosses, conifer dominance", example: "Pacific Northwest — extremely high moisture supports old-growth conifers", climateShift: "Reduced fog/moisture from warming oceans" },
  { name: "Shrubland/Chaparral", temp: "10–30°C", precip: "25–60 cm/yr", latitude: "30–40°", productivity: "Low–Moderate", soil: "Thin, rocky", keyAdaptation: "Sclerophyllous leaves, fire-adapted seed germination", example: "California chaparral — some plants require fire for seed germination", climateShift: "Increased wildfire frequency and intensity" },
  { name: "Boreal Forest/Taiga", temp: "-40–20°C", precip: "30–85 cm/yr", latitude: "50–65°", productivity: "Low–Moderate", soil: "Acidic, slow decomposition (spodosols)", keyAdaptation: "Conical shape sheds snow, needle leaves reduce water loss", example: "Boreal forest — slow decomposition due to cold temperatures creates thick organic layer", climateShift: "Permafrost thaw releases stored carbon (positive feedback)" },
  { name: "Tundra", temp: "-40–10°C", precip: "15–25 cm/yr", latitude: ">60°", productivity: "Very low", soil: "Permafrost, thin active layer", keyAdaptation: "Low-growing, shallow roots, rapid reproduction in summer", example: "Arctic tundra — permafrost prevents decomposition and limits plant growth to shallow-rooted species", climateShift: "Warming thaws permafrost, releasing methane (potent greenhouse gas)" },
];

const AQUATIC_BIOMES = [
  { name: "Streams/Rivers", salinity: "Fresh", depth: "Shallow–Variable", flow: "High", temperature: "Variable", do: "High (turbulence)", light: "Variable", nutrients: "Variable", productivity: "Low–Moderate", example: "Rivers have high dissolved oxygen due to water movement and turbulence" },
  { name: "Lakes/Ponds", salinity: "Fresh", depth: "Variable", flow: "Low", temperature: "Stratified", do: "Variable (depth)", light: "Littoral: high; Profundal: none", nutrients: "Variable", productivity: "Moderate", example: "Lakes serve as freshwater drinking sources; thermal stratification affects oxygen distribution" },
  { name: "Wetlands (Marshes/Swamps/Bogs)", salinity: "Fresh–Brackish", depth: "Shallow", flow: "Very low", temperature: "Variable", do: "Often low", light: "High", nutrients: "High", productivity: "Very high", example: "Wetlands filter pollutants, store floodwater, and provide nursery habitat for many species" },
  { name: "Estuaries", salinity: "Brackish (mixed)", depth: "Shallow", flow: "Tidal", temperature: "Variable", do: "Variable", light: "High", nutrients: "Very high", productivity: "Very high", example: "Estuaries are among the most productive ecosystems — mixing of fresh and salt water brings high nutrients" },
  { name: "Salt Marshes", salinity: "Saline", depth: "Shallow/tidal", flow: "Tidal", temperature: "Variable", do: "Variable", light: "High", nutrients: "High", productivity: "High", example: "Salt marshes buffer coastlines from storm surge and filter runoff" },
  { name: "Mangroves", salinity: "Saline/Brackish", depth: "Shallow", flow: "Tidal", temperature: "Tropical", do: "Variable", light: "High", nutrients: "High", productivity: "High", example: "Mangrove roots stabilize shorelines, prevent erosion, and provide fish nursery habitat" },
  { name: "Coral Reefs", salinity: "Saline", depth: "Shallow (photic)", flow: "Moderate", temperature: "Warm (18–29°C)", do: "High", light: "High (required)", nutrients: "Low (oligotrophic)", productivity: "Very high (per area)", example: "Coral-zooxanthellae mutualism — algae provide food via photosynthesis, coral provides habitat" },
  { name: "Intertidal Zone", salinity: "Saline", depth: "Exposed–Submerged", flow: "Tidal", temperature: "Variable", do: "Variable", light: "High when exposed", nutrients: "Moderate", productivity: "Moderate", example: "Intertidal organisms must resist desiccation, wave action, and temperature fluctuation" },
  { name: "Open Ocean", salinity: "Saline", depth: "Deep", flow: "Currents", temperature: "Cold at depth", do: "Variable", light: "Photic zone only", nutrients: "Low (surface)", productivity: "Low per unit area but HIGH total O₂ contribution due to enormous size", example: "Open ocean has low productivity per unit area but produces ~50% of Earth's oxygen via phytoplankton" },
];

export function BiomeExplorer({
  cards,
  onCardClick,
}: {
  cards: TopicCard[];
  onCardClick: (card: TopicCard) => void;
}) {
  const [tab, setTab] = useState<"terrestrial" | "aquatic">("terrestrial");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Biome Explorer</h2>
        <p className="text-sm text-muted-foreground">
          9 terrestrial + 9 aquatic biomes with climate, adaptations, productivity, and examples
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setTab("terrestrial")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "terrestrial" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          Terrestrial ({TERRESTRIAL_BIOMES.length})
        </button>
        <button
          onClick={() => setTab("aquatic")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "aquatic" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          Aquatic ({AQUATIC_BIOMES.length})
        </button>
      </div>

      {tab === "terrestrial" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TERRESTRIAL_BIOMES.map((biome) => {
            const isOpen = expanded === biome.name;
            return (
              <div
                key={biome.name}
                className={`cursor-pointer rounded-xl border bg-card p-4 transition-all hover:border-primary/50 ${isOpen ? "sm:col-span-2 lg:col-span-3" : ""}`}
                onClick={() => setExpanded(isOpen ? null : biome.name)}
              >
                <h3 className="text-sm font-bold">{biome.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Temp:</span><span>{biome.temp}</span>
                  <span className="text-muted-foreground">Precip:</span><span>{biome.precip}</span>
                  <span className="text-muted-foreground">Latitude:</span><span>{biome.latitude}</span>
                  <span className="text-muted-foreground">Productivity:</span><span>{biome.productivity}</span>
                </div>
                {isOpen && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <div className="text-xs"><strong>Soil:</strong> {biome.soil}</div>
                    <div className="text-xs"><strong>Key Adaptation:</strong> {biome.keyAdaptation}</div>
                    <div className="rounded-md bg-primary/5 p-2 text-xs"><strong>Specific Example:</strong> {biome.example}</div>
                    <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-2 text-xs"><strong>Climate Change:</strong> {biome.climateShift}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "aquatic" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AQUATIC_BIOMES.map((biome) => {
            const isOpen = expanded === biome.name;
            return (
              <div
                key={biome.name}
                className={`cursor-pointer rounded-xl border bg-card p-4 transition-all hover:border-primary/50 ${isOpen ? "sm:col-span-2 lg:col-span-3" : ""}`}
                onClick={() => setExpanded(isOpen ? null : biome.name)}
              >
                <h3 className="text-sm font-bold">{biome.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Salinity:</span><span>{biome.salinity}</span>
                  <span className="text-muted-foreground">Depth:</span><span>{biome.depth}</span>
                  <span className="text-muted-foreground">Flow:</span><span>{biome.flow}</span>
                  <span className="text-muted-foreground">Productivity:</span><span>{biome.productivity}</span>
                </div>
                {isOpen && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <div className="text-xs"><strong>Temperature:</strong> {biome.temperature}</div>
                    <div className="text-xs"><strong>Dissolved O₂:</strong> {biome.do}</div>
                    <div className="text-xs"><strong>Light:</strong> {biome.light}</div>
                    <div className="text-xs"><strong>Nutrients:</strong> {biome.nutrients}</div>
                    <div className="rounded-md bg-primary/5 p-2 text-xs"><strong>Specific Example:</strong> {biome.example}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
