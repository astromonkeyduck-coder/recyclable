export type Tip = {
  text: string;
  /** Optional: prefer this tip in a given month (1-12) */
  month?: number;
  /** Optional: keyword for context e.g. "holiday", "spring" */
  tag?: string;
};

export const TIPS: Tip[] = [
  // ── Evergreen tips ──
  { text: "Rinse containers before recycling to avoid contaminating the batch.", tag: "evergreen" },
  { text: "Pizza boxes with grease go in trash or compost, not recycling.", tag: "evergreen" },
  { text: "Batteries and electronics should never go in curbside bins. Find a drop-off.", tag: "evergreen" },
  { text: "When in doubt, trash it. Contamination hurts recycling more than one wrong item in trash.", tag: "evergreen" },
  { text: "Plastic bags tangle sorting equipment. Return them to stores or put them in trash.", tag: "evergreen" },
  { text: "Broken glass goes in the trash, not recycling. Only intact bottles and jars are recyclable.", tag: "evergreen" },
  { text: "Coffee cups are usually trash. The plastic lining makes them hard to recycle.", tag: "evergreen" },
  { text: "Check your local provider for rules. They vary by city.", tag: "evergreen" },
  { text: "Flatten cardboard boxes before recycling. It saves space and helps sorters.", tag: "evergreen" },
  { text: "Shredded paper is too small for sorting machines. Bag it or compost it.", tag: "evergreen" },
  { text: "Styrofoam is almost never recyclable curbside. Check for drop-off programs.", tag: "evergreen" },
  { text: "Clothing and textiles should be donated or taken to a textile recycling bin, not trashed.", tag: "evergreen" },
  { text: "Prescription medications should never go down the drain. Use pharmacy take-back programs.", tag: "evergreen" },
  { text: "Aerosol cans can be recycled when completely empty. Never puncture them.", tag: "evergreen" },
  { text: "Food-soiled paper (napkins, paper towels) goes in compost, not recycling.", tag: "evergreen" },
  { text: "Most take-out containers marked #5 PP are recyclable. Check with your city.", tag: "evergreen" },
  { text: "Remove caps from bottles before recycling — caps and bottles are often different plastics.", tag: "evergreen" },
  { text: "Staples and paper clips on paper are fine — recycling machines remove them automatically.", tag: "evergreen" },
  { text: "Leave labels on cans and bottles. They burn off during the recycling process.", tag: "evergreen" },
  { text: "Mirrors and window glass have different melting points than bottles — don't mix them.", tag: "evergreen" },
  { text: "Old cooking oil shouldn't go down the drain. Many cities accept it for biodiesel conversion.", tag: "evergreen" },
  { text: "Compostable plastics (PLA) need industrial composting. They won't break down in a backyard bin.", tag: "evergreen" },
  { text: "Keep a small container by the kitchen sink for food scraps — it makes composting effortless.", tag: "evergreen" },
  { text: "Bubble wrap isn't recyclable curbside. Drop it off with plastic bag recycling at stores.", tag: "evergreen" },
  { text: "Donate old towels and blankets to animal shelters instead of throwing them away.", tag: "evergreen" },
  { text: "Wet or food-soiled cardboard should go in compost, not recycling.", tag: "evergreen" },

  // ── Fun facts: Aluminum ──
  { text: "Recycling one aluminum can saves enough energy to power a TV for 3 hours.", tag: "fact" },
  { text: "An aluminum can goes from recycling bin back to store shelf in as few as 60 days.", tag: "fact" },
  { text: "Aluminum is infinitely recyclable — it never loses quality, no matter how many times it's recycled.", tag: "fact" },
  { text: "The U.S. throws away enough aluminum every 3 months to rebuild its entire commercial air fleet.", tag: "fact" },
  { text: "Recycling aluminum uses 95% less energy than making it from raw bauxite ore.", tag: "fact" },

  // ── Fun facts: Plastic ──
  { text: "A plastic bottle can take up to 450 years to decompose in a landfill.", tag: "fact" },
  { text: "Only about 5-6% of plastic waste in the U.S. actually gets recycled.", tag: "fact" },
  { text: "The average American uses about 100 pounds of plastic per year.", tag: "fact" },
  { text: "8 million metric tons of plastic end up in the ocean every year — that's a garbage truck every minute.", tag: "fact" },
  { text: "Recycling one ton of plastic saves about 7.4 cubic yards of landfill space.", tag: "fact" },
  { text: "Most plastics can only be \"downcycled\" into lower-grade products, not the same item again.", tag: "fact" },
  { text: "Microplastics have been found in rain, snow, human blood, and even the deepest ocean trenches.", tag: "fact" },
  { text: "A single recycled plastic bottle saves enough energy to power a 60W light bulb for 6 hours.", tag: "fact" },

  // ── Fun facts: Paper & Cardboard ──
  { text: "Paper can be recycled 5 to 7 times before the fibers become too short to use.", tag: "fact" },
  { text: "One ton of recycled cardboard saves 9 cubic yards of landfill space.", tag: "fact" },
  { text: "A single tree produces roughly 8,333 paper grocery bags.", tag: "fact" },
  { text: "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 463 gallons of oil.", tag: "fact" },
  { text: "Newspaper decomposes in about 6 weeks. Paper towels take 2-4 weeks. Both are compostable.", tag: "fact" },
  { text: "If everyone in the U.S. recycled just 1/10 of their newspapers, 25 million trees would be saved per year.", tag: "fact" },
  { text: "Junk mail in the U.S. produces as much CO₂ as 9 million cars and destroys 100 million trees per year.", tag: "fact" },

  // ── Fun facts: Glass ──
  { text: "Glass is 100% recyclable and can be recycled endlessly without losing quality or purity.", tag: "fact" },
  { text: "The energy saved from recycling one glass bottle can power a computer for 25 minutes.", tag: "fact" },
  { text: "A glass bottle takes roughly 1 million years to decompose in a landfill.", tag: "fact" },
  { text: "Recycling glass reduces air pollution by 20% and water pollution by 50% compared to making new glass.", tag: "fact" },

  // ── Fun facts: Food & Compost ──
  { text: "Food waste is the single largest category of material in U.S. landfills.", tag: "fact" },
  { text: "When food rots in a landfill it produces methane — a greenhouse gas 80x more potent than CO₂ over 20 years.", tag: "fact" },
  { text: "Composting one ton of food waste prevents about 0.75 tons of CO₂-equivalent emissions.", tag: "fact" },
  { text: "About 30-40% of the U.S. food supply is wasted — roughly 133 billion pounds per year.", tag: "fact" },
  { text: "Banana peels decompose in about 2 years in a landfill, but just 2-5 weeks in a compost pile.", tag: "fact" },
  { text: "Eggshells are great for compost — they add calcium and help balance soil pH.", tag: "fact" },
  { text: "Coffee grounds are excellent compost material. They're rich in nitrogen and attract earthworms.", tag: "fact" },

  // ── Fun facts: E-waste & Hazardous ──
  { text: "E-waste is only 2% of landfill volume but accounts for 70% of the toxic waste in landfills.", tag: "fact" },
  { text: "One smartphone contains over 60 different elements, many of which are rare earth metals.", tag: "fact" },
  { text: "A single quart of motor oil can contaminate up to 2 million gallons of fresh water.", tag: "fact" },
  { text: "Globally, only about 20% of e-waste is formally recycled. The rest is dumped or informally processed.", tag: "fact" },
  { text: "Old CRT monitors contain 4-8 pounds of lead. Always take them to hazardous waste drop-off.", tag: "fact" },
  { text: "Lithium-ion batteries can cause fires in garbage trucks. Never put them in the trash or recycling.", tag: "fact" },

  // ── Fun facts: Textiles & Other ──
  { text: "The average American throws away about 80 pounds of clothing per year.", tag: "fact" },
  { text: "95% of textiles thrown away could be recycled or reused, but most end up in landfills.", tag: "fact" },
  { text: "A disposable diaper takes about 500 years to decompose.", tag: "fact" },
  { text: "Styrofoam never fully decomposes — it just breaks into smaller and smaller pieces indefinitely.", tag: "fact" },
  { text: "Cork is one of the most sustainable materials — cork oak trees regrow their bark every 9 years.", tag: "fact" },
  { text: "Cigarette butts are the most littered item in the world — over 4.5 trillion discarded per year.", tag: "fact" },

  // ── Fun facts: Global ──
  { text: "Sweden recycles or energy-recovers 99% of household waste. They even import trash from other countries.", tag: "fact" },
  { text: "Japan recycles about 84% of its aluminum cans — one of the highest rates in the world.", tag: "fact" },
  { text: "Germany's deposit-refund system pays you for returning plastic bottles. Their return rate is 98%.", tag: "fact" },
  { text: "South Korea requires pay-per-volume trash bags, which cut household waste by 40%.", tag: "fact" },
  { text: "San Francisco diverts about 80% of its waste from landfills — one of the best rates in the U.S.", tag: "fact" },
  { text: "Taiwan went from recycling 5% of waste in 1998 to over 55% today — one of the fastest turnarounds ever.", tag: "fact" },
  { text: "In India, \"kabadiwallas\" (informal recyclers) recover more material than most formal systems worldwide.", tag: "fact" },

  // ── Fun facts: General / Mind-blowing ──
  { text: "The average person generates over 4.4 pounds of trash per day — about 1,600 pounds a year.", tag: "fact" },
  { text: "About 80% of what Americans throw away is recyclable, but only about 30% actually gets recycled.", tag: "fact" },
  { text: "Recycling creates 6x more jobs than landfilling the same amount of waste.", tag: "fact" },
  { text: "The Great Pacific Garbage Patch is roughly twice the size of Texas and still growing.", tag: "fact" },
  { text: "The recycling symbol (♻) was designed by a 23-year-old college student named Gary Anderson in 1970.", tag: "fact" },
  { text: "Of all the plastic ever produced, only 9% has been recycled. 79% sits in landfills or the environment.", tag: "fact" },
  { text: "A steel can is recycled into a new can in as few as 6 weeks.", tag: "fact" },
  { text: "Recycling steel saves 74% of the energy needed to make it from raw materials.", tag: "fact" },
  { text: "Americans use 100 billion plastic bags per year, which require 12 million barrels of oil to manufacture.", tag: "fact" },
  { text: "If you lined up all the aluminum cans recycled in 2023, they'd wrap around the Earth over 200 times.", tag: "fact" },
  { text: "Every ton of recycled paper keeps about 60 pounds of pollutants out of the atmosphere.", tag: "fact" },
  { text: "The first Earth Day in 1970 led directly to the creation of the EPA and the Clean Air Act.", tag: "fact" },
  { text: "Landfills are the third-largest source of methane emissions in the U.S.", tag: "fact" },
  { text: "It takes 500 years for a single aluminum can to break down in a landfill — but seconds to crush and recycle.", tag: "fact" },
  { text: "The world produces over 2 billion tons of municipal solid waste per year. That's expected to hit 3.4 billion by 2050.", tag: "fact" },
  { text: "Recycling one ton of glass saves the equivalent of 10 gallons of oil.", tag: "fact" },
  { text: "The energy saved by recycling one aluminum can could run your phone for over 20 hours.", tag: "fact" },

  // ── January ──
  { text: "New Year's resolution idea: start composting. It can reduce your landfill waste by up to 30%.", month: 1, tag: "newyear" },
  { text: "Recycle your holiday cardboard packaging — January is one of the biggest months for cardboard recycling.", month: 1, tag: "newyear" },
  { text: "Real Christmas trees can be composted or chipped. Check your city's tree pickup schedule.", month: 1, tag: "holiday" },

  // ── February ──
  { text: "Valentine's chocolates? Recycle the cardboard box, but foil wrappers usually go in the trash.", month: 2, tag: "valentine" },
  { text: "Heart-shaped balloons aren't recyclable and are deadly to marine animals. Skip the balloon release.", month: 2, tag: "valentine" },
  { text: "Shipping season: flatten those cardboard boxes! They're one of the easiest items to recycle.", month: 2, tag: "winter" },

  // ── March ──
  { text: "Spring cleaning? Old paint and chemicals need hazardous waste drop-off.", month: 3, tag: "spring" },
  { text: "Decluttering? Donate usable items before trashing. One person's junk is another's treasure.", month: 3, tag: "spring" },
  { text: "Expired cleaning products are hazardous waste. Don't pour them down the drain.", month: 3, tag: "spring" },

  // ── April (Earth Day) ──
  { text: "Happy Earth Day month! Challenge yourself to produce zero landfill waste for one day.", month: 4, tag: "earthday" },
  { text: "Earth Day was first celebrated on April 22, 1970 — 20 million Americans participated.", month: 4, tag: "earthday" },
  { text: "Plant a tree this month. One tree absorbs about 48 pounds of CO₂ per year.", month: 4, tag: "earthday" },
  { text: "Decluttering? Donate working electronics instead of tossing them.", month: 4, tag: "spring" },

  // ── May ──
  { text: "Moving out for summer? Donate furniture instead of curbing it. Many charities pick up for free.", month: 5, tag: "summer" },
  { text: "Yard waste from spring growth is perfect for composting. Grass clippings are nitrogen-rich \"greens.\"", month: 5, tag: "spring" },
  { text: "Garden season! Compost yard trimmings instead of bagging them for landfill.", month: 5, tag: "spring" },

  // ── June ──
  { text: "Summer BBQ? Aluminum foil is recyclable if you ball it up fist-sized or larger.", month: 6, tag: "summer" },
  { text: "Sunscreen bottles are recyclable — just make sure they're empty and rinsed.", month: 6, tag: "summer" },
  { text: "Pool chemicals are hazardous waste. Never pour them down drains.", month: 6, tag: "summer" },

  // ── July ──
  { text: "After the 4th of July, firework debris is trash. Never put used fireworks in recycling.", month: 7, tag: "summer" },
  { text: "Solo cups are #6 plastic (polystyrene) — almost never accepted in curbside recycling.", month: 7, tag: "summer" },
  { text: "Heading to the beach? Bring a reusable water bottle. Plastic water bottles are the #2 most common beach litter.", month: 7, tag: "summer" },

  // ── August ──
  { text: "Back-to-school? Old binders, markers, and dried-out pens are usually trash. Crayons can be donated.", month: 8, tag: "backtoschool" },
  { text: "Back-to-school tip: buy notebooks made from recycled paper to close the recycling loop.", month: 8, tag: "backtoschool" },
  { text: "BBQ season: disposable propane tanks need special drop-off. Don't put them in trash.", month: 8, tag: "summer" },

  // ── September ──
  { text: "Fall yard waste like leaves and twigs makes excellent \"brown\" compost material.", month: 9, tag: "fall" },
  { text: "Back-to-routine month! Set up a recycling station at home with labeled bins.", month: 9, tag: "fall" },
  { text: "Back to school? Paper from old notebooks recycles, but plastic binders don't.", month: 9, tag: "fall" },

  // ── October ──
  { text: "Halloween costumes: donate or swap instead of buying new. Most costume materials aren't recyclable.", month: 10, tag: "halloween" },
  { text: "Carved pumpkins are compostable! Don't trash them — compost or check for city collection.", month: 10, tag: "halloween" },
  { text: "Fun-size candy wrappers are almost always trash. The multi-layer film can't be recycled.", month: 10, tag: "halloween" },
  { text: "Fallen leaves make excellent compost. Skip the plastic bags and use paper yard waste bags.", month: 10, tag: "fall" },

  // ── November ──
  { text: "After Thanksgiving, turkey bones and food scraps are compostable. Aluminum pans are recyclable.", month: 11, tag: "thanksgiving" },
  { text: "Black Friday tip: shipping boxes are highly recyclable. Flatten and recycle every one.", month: 11, tag: "thanksgiving" },
  { text: "Americans produce 25% more waste between Thanksgiving and New Year's than any other time.", month: 11, tag: "thanksgiving" },
  { text: "Pumpkins are compostable! Remove candles and paint first.", month: 11, tag: "fall" },

  // ── December ──
  { text: "Holiday wrapping paper: if it tears like paper, recycle; if it's shiny or metallic, trash.", month: 12, tag: "holiday" },
  { text: "Christmas lights are e-waste. Recycle them at a designated drop-off, not in the bin.", month: 12, tag: "holiday" },
  { text: "Real Christmas trees are compostable — many cities offer free curbside collection in January.", month: 12, tag: "holiday" },
  { text: "Gift bags can be reused many times. Keep a stash instead of buying new ones.", month: 12, tag: "holiday" },
  { text: "Holiday ribbon and bows are trash. Remove them from packages before recycling the paper.", month: 12, tag: "holiday" },
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
