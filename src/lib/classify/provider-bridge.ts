import type { Provider, Material } from "@/lib/providers/types";
import type { ClassificationResult, EngineCategory } from "./types";

/**
 * Map concept IDs to general provider material IDs for rich display (instructions, notes).
 * When a provider has a material with this ID, we return it instead of a synthetic material.
 */
const CONCEPT_TO_MATERIAL_ID: Record<string, string> = {
  paper_sheet: "mixed-paper",
  receipt_thermal: "receipts",
  newspaper: "newspaper",
  magazine: "magazines",
  cardboard: "cardboard",
  cereal_box: "cereal-box",
  frozen_food_box: "frozen-food-box",
  wax_paper: "wax-paper",
  parchment_paper: "wax-paper",
  envelope_plain: "envelopes",
  envelope_window: "envelopes",
  sticky_notes: "sticky-notes",
  greeting_card_plain: "greeting-cards",
  greeting_card_glitter: "greeting-cards",
  pizza_box_clean: "pizza-box",
  pizza_box_greasy: "pizza-box",
  paper_bag: "paper-bag",
  cardboard_tubes: "cardboard-tubes",
  plastic_bottle: "plastic-bottles",
  plastic_container: "plastic-containers",
  plastic_bags: "plastic-bags",
  candy_wrapper: "candy-wrapper",
  chip_bag: "chip-bag",
  granola_bar_wrapper: "granola-bar-wrapper",
  snack_pouch: "snack-pouch",
  plastic_clamshell: "plastic-clamshell",
  plastic_utensils: "plastic-utensils",
  straw: "straws",
  plastic_hanger: "hangers",
  plastic_cups: "plastic-cups",
  cleaning_bottle: "cleaning-bottles",
  takeout_container_plastic: "takeout-container-plastic",
  prescription_bottle: "prescription-bottles",
  ziploc_bags: "ziploc-bags",
  cling_wrap: "cling-wrap",
  toothbrush: "toothbrush",
  toothpaste_tube: "toothpaste-tube",
  deodorant_container: "deodorant",
  razor: "razor",
  cosmetics: "cosmetics",
  coffee_pod: "coffee-pods",
  milk_carton: "milk-carton",
  tupperware: "tupperware",
  styrofoam: "styrofoam",
  styrofoam_takeout: "styrofoam-takeout",
  diapers: "diapers",
  aluminum_cans: "aluminum-cans",
  steel_cans: "steel-cans",
  aluminum_foil: "aluminum-foil",
  aluminum_tray: "aluminum-takeout",
  aerosol_cans: "aerosol-cans",
  keys: "keys",
  bottle_caps_metal: "bottle-caps",
  glass_bottle: "glass-bottles",
  glass_jar: "glass-bottles",
  drinking_glass: "glass-drinking",
  pyrex: "glass-drinking",
  mirror: "mirrors",
  broken_glass: "mirrors",
  candle_jar: "candles",
  clothing_wearable: "clothing",
  clothing_worn_out: "clothing-damaged-trash",
  shoes_wearable: "shoes",
  shoes_worn_out: "shoes-worn-out-trash",
  backpack_bag: "backpack-bags",
  electronics_general: "electronics",
  smartphone: "smartphone",
  laptop: "laptop",
  chargers_cables: "chargers-cables",
  headphones: "headphones",
  light_bulb_cfl: "light-bulbs",
  ink_cartridge: "ink-cartridges",
  batteries: "batteries",
  paint: "paint",
  motor_oil: "motor-oil",
  needles_sharps: "sharps",
  propane_tank: "propane-tanks",
  fluorescent_tube: "fluorescent-tubes",
  medications: "medications",
  ceramic_mug: "ceramics",
  broken_ceramic: "ceramics",
  cds_dvds: "cds-dvds",
  pens_markers: "pens-markers",
  tape: "tape",
  rubber_band: "rubber-bands",
  umbrella: "umbrellas",
  candle: "candles",
  pet_waste: "pet-waste",
  cooking_oil: "cooking-oil",
  wine_cork: "wine-corks",
  wine_cork_synthetic: "wine-corks",
  school_supplies: "school-supplies",
  shipping_box: "cardboard",
};

const DEFAULT_INSTRUCTIONS: Record<EngineCategory, string[]> = {
  recycle: [
    "Empty and rinse if it held food or liquid",
    "Place in your recycling bin",
    "Check local rules for specifics",
  ],
  compost: [
    "Place in compost bin if your area has curbside or drop-off composting",
    "Otherwise place in trash",
  ],
  trash: [
    "Place in your regular trash bin",
    "Do not put in recycling — it can contaminate the stream",
  ],
  dropoff: [
    "Do not put in curbside recycling or trash",
    "Take to an appropriate drop-off location (e.g. e-waste, drug take-back, donation)",
  ],
  hazardous: [
    "Do not put in regular trash or recycling",
    "Take to a hazardous waste collection site or approved drop-off",
  ],
};

/**
 * Get a provider Material that corresponds to this concept, if the provider has one.
 */
export function getProviderMaterialForConcept(
  provider: Provider,
  conceptId: string
): Material | null {
  const materialId = CONCEPT_TO_MATERIAL_ID[conceptId];
  if (!materialId) return null;
  const material = provider.materials.find((m) => m.id === materialId);
  return material ?? null;
}

/**
 * Build a synthetic Material from a classification result for display when
 * no provider material mapping exists.
 */
export function syntheticMaterialFromResult(
  result: ClassificationResult,
  query: string
): Material {
  const name = (result.conceptName ?? query) || "Item";
  const category = result.category;
  const instructions =
    DEFAULT_INSTRUCTIONS[category] ?? DEFAULT_INSTRUCTIONS.trash;
  return {
    id: `concept-${result.conceptId ?? "unknown"}`,
    name,
    aliases: [],
    category,
    instructions,
    notes: result.why,
    commonMistakes: result.warnings ?? [],
    tags: [],
    examples: [],
  };
}

/**
 * Resolve a classification result to a Material for API response: use provider
 * material if mapped, otherwise synthetic.
 */
export function materialFromClassification(
  provider: Provider,
  result: ClassificationResult,
  query: string
): Material {
  if (result.conceptId) {
    const providerMaterial = getProviderMaterialForConcept(
      provider,
      result.conceptId
    );
    if (providerMaterial) return providerMaterial;
  }
  return syntheticMaterialFromResult(result, query);
}
