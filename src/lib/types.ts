export type BudgetLevel = "low" | "mid" | "premium";

export type Attraction = {
  id: string;
  name: string;
  district: string | null;
  category: string[];
  months_best: number[];
  season_note: string | null;
  is_secondary: boolean;
  is_community: boolean;
  budget_level: BudgetLevel;
  lat: number | null;
  lng: number | null;
  description: string | null;
  contact: string | null;
};

export type PlanRequest = {
  month: number;
  days: number;
  styles: string[];
  budget: BudgetLevel;
};

export type PlanItem = {
  id: string;
  time: string;
  reason: string;
  tip: string;
};

export type PlanDay = {
  day: number;
  items: PlanItem[];
};

export type PlanResponse = {
  summary: string;
  days: PlanDay[];
  low_season_perks: string[];
};

export const STYLE_OPTIONS = [
  { value: "nature", label: "ธรรมชาติ" },
  { value: "culture", label: "วัฒนธรรม" },
  { value: "food", label: "อาหาร" },
  { value: "wellness", label: "Wellness" },
  { value: "community", label: "วิถีชุมชน" },
] as const;

export type Style = (typeof STYLE_OPTIONS)[number]["value"];

export const BUDGET_OPTIONS = [
  { value: "low", label: "ประหยัด" },
  { value: "mid", label: "กลาง" },
  { value: "premium", label: "พรีเมียม" },
] as const;

export type EnrichedPlanItem = PlanItem & { attraction: Attraction | null };
export type EnrichedPlanDay = { day: number; items: EnrichedPlanItem[] };
export type PlanApiResponse = {
  summary: string;
  days: EnrichedPlanDay[];
  low_season_perks: string[];
};
