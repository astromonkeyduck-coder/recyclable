export type DisposalCategory =
  | "recycle"
  | "trash"
  | "compost"
  | "dropoff"
  | "hazardous"
  | "unknown"
  | "donate"
  | "yard-waste"
  | "deposit";

export type Material = {
  id: string;
  name: string;
  aliases: string[];
  category: DisposalCategory;
  instructions: string[];
  notes: string[];
  commonMistakes: string[];
  tags?: string[];
  examples?: string[];
};

export type RulesSummary = {
  accepted: {
    recycle: string[];
    compost?: string[];
    trash?: string[];
  };
  notAccepted: {
    recycle: string[];
    compost?: string[];
  };
  tips: string[];
};

export type DropoffLocation = {
  name: string;
  address?: string;
  phone?: string;
  url?: string;
  accepts: string[];
  hours?: string;
  notes?: string;
};

export type ProviderCoverage = {
  country: string;
  region?: string;
  city?: string;
  zips?: string[];
  aliases?: string[];
};

export type ProviderSource = {
  name: string;
  url?: string;
  generatedAt: string;
  notes?: string;
  license?: string;
};

export type Provider = {
  id: string;
  displayName: string;
  coverage: ProviderCoverage;
  source: ProviderSource;
  materials: Material[];
  rulesSummary: RulesSummary;
  locations?: DropoffLocation[];
};

export type MatchResult = {
  best: Material | null;
  matches: Array<{ material: Material; score: number }>;
  confidence: number;
  rationale: string[];
};
