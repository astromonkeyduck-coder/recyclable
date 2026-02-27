export type Tip = {
  text: string;
  /** Optional: prefer this tip in a given month (1–12) */
  month?: number;
  /** Optional: keyword for context e.g. "holiday", "spring" */
  tag?: string;
};

export const TIPS: Tip[] = [
  { text: "Rinse containers before recycling to avoid contaminating the batch.", tag: "evergreen" },
  { text: "Pizza boxes with grease go in trash or compost—not recycling.", tag: "evergreen" },
  { text: "Batteries and electronics should never go in curbside bins—find a drop-off.", tag: "evergreen" },
  { text: "When in doubt, trash it. Contamination hurts recycling more than one wrong item in trash.", tag: "evergreen" },
  { text: "Holiday wrapping paper: if it tears like paper, recycle; if it’s shiny or metallic, trash.", month: 12, tag: "holiday" },
  { text: "Christmas lights are e-waste—recycle at a designated drop-off, not in the bin.", month: 12, tag: "holiday" },
  { text: "Spring cleaning? Old paint and chemicals need hazardous waste drop-off.", month: 3, tag: "spring" },
  { text: "Spring cleaning? Old paint and chemicals need hazardous waste drop-off.", month: 4, tag: "spring" },
  { text: "Plastic bags tangle sorting equipment—return to stores or put in trash.", tag: "evergreen" },
  { text: "Broken glass goes in the trash, not recycling. Only intact bottles and jars are recyclable.", tag: "evergreen" },
  { text: "Coffee cups are usually trash—the plastic lining makes them hard to recycle.", tag: "evergreen" },
  { text: "Check your local provider for rules; they vary by city.", tag: "evergreen" },
];

function getMonth(): number {
  if (typeof window !== "undefined") return new Date().getMonth() + 1;
  return new Date().getMonth() + 1;
}

/** Returns a tip to show, preferring seasonal matches. */
export function getTipForNow(): Tip {
  const month = getMonth();
  const seasonal = TIPS.filter((t) => t.month === month);
  const pool = seasonal.length > 0 ? seasonal : TIPS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
