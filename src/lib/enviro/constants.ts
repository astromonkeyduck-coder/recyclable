export const UNITS = [
  {
    id: "unit1",
    number: 1,
    title: "The Living World: Ecosystems",
    weight: "6–8%",
    bigIdeas: ["ERT", "ENG"],
    color: "emerald",
    topicRange: "1.1–1.11",
    topicCount: 11,
  },
  {
    id: "unit2",
    number: 2,
    title: "The Living World: Biodiversity",
    weight: "6–8%",
    bigIdeas: ["ERT", "ENG"],
    color: "green",
    topicRange: "2.1–2.8",
    topicCount: 8,
  },
  {
    id: "unit3",
    number: 3,
    title: "Populations",
    weight: "10–15%",
    bigIdeas: ["SYI", "ERT"],
    color: "blue",
    topicRange: "3.1–3.9",
    topicCount: 9,
  },
  {
    id: "unit4",
    number: 4,
    title: "Earth Systems and Resources",
    weight: "10–15%",
    bigIdeas: ["ERT", "STB"],
    color: "amber",
    topicRange: "4.1–4.9",
    topicCount: 9,
  },
  {
    id: "unit5",
    number: 5,
    title: "Land and Water Use",
    weight: "10–15%",
    bigIdeas: ["STB", "EIN"],
    color: "orange",
    topicRange: "5.1–5.17",
    topicCount: 17,
  },
  {
    id: "unit6",
    number: 6,
    title: "Energy Resources and Consumption",
    weight: "10–15%",
    bigIdeas: ["ENG", "STB"],
    color: "yellow",
    topicRange: "6.1–6.13",
    topicCount: 13,
  },
  {
    id: "unit7",
    number: 7,
    title: "Atmospheric Pollution",
    weight: "7–10%",
    bigIdeas: ["STB", "EIN"],
    color: "slate",
    topicRange: "7.1–7.8",
    topicCount: 8,
  },
  {
    id: "unit8",
    number: 8,
    title: "Aquatic and Terrestrial Pollution",
    weight: "7–10%",
    bigIdeas: ["STB", "EIN"],
    color: "red",
    topicRange: "8.1–8.12",
    topicCount: 12,
  },
  {
    id: "unit9",
    number: 9,
    title: "Global Change",
    weight: "15–20%",
    bigIdeas: ["STB", "EIN"],
    color: "purple",
    topicRange: "9.1–9.10",
    topicCount: 10,
  },
] as const;

export type UnitId = (typeof UNITS)[number]["id"];

export const BIG_IDEAS = {
  ERT: "Energy Transfer",
  ENG: "Energy and Ecosystems",
  SYI: "Systems and Interactions",
  STB: "Sustainability",
  EIN: "Environmental Impacts",
} as const;

export const SCIENCE_PRACTICES = {
  "1": "Concept Explanation",
  "2": "Visual Representations",
  "3": "Text Analysis",
  "4": "Scientific Experiments",
  "5": "Data Analysis",
  "6": "Mathematical Routines",
  "7": "Environmental Solutions",
} as const;

export const NAV_MODES = [
  { id: "everything", label: "Everything Map", icon: "Globe" },
  { id: "units", label: "By AP Unit", icon: "BookOpen" },
  { id: "cycles", label: "Cycles", icon: "RefreshCw" },
  { id: "biomes", label: "Biomes", icon: "Trees" },
  { id: "cause-effect", label: "Cause & Effect", icon: "GitBranch" },
  { id: "graphs", label: "Graphs & Data", icon: "BarChart3" },
  { id: "percent-change", label: "Percent Change Lab", icon: "Calculator" },
  { id: "pollution", label: "Pollution Pathways", icon: "CloudRain" },
  { id: "energy", label: "Energy & Math", icon: "Zap" },
  { id: "solutions", label: "Solutions & Tradeoffs", icon: "Scale" },
  { id: "frq", label: "FRQ Visual Trainer", icon: "PenLine" },
  { id: "misconceptions", label: "Misconception Lab", icon: "AlertTriangle" },
  { id: "cram", label: "Night-Before Cram", icon: "Moon" },
] as const;

export type NavMode = (typeof NAV_MODES)[number]["id"];

export const VISUAL_TYPES = [
  "hierarchy",
  "cycle",
  "cause_effect",
  "source_pathway",
  "cross_section",
  "comparison",
  "graph",
  "percent_change",
  "simulation",
  "solution_tradeoff",
] as const;

export type VisualType = (typeof VISUAL_TYPES)[number];
