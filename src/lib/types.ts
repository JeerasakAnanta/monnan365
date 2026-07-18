export type BudgetLevel = number;

export const BUDGET_RANGE = { min: 500, max: 20000, step: 100, default: 3000 } as const;

export function formatBudget(value: number): string {
  return `${value.toLocaleString("th-TH")} บาท`;
}

export function budgetLabel(value: number): string {
  if (value <= 200) return "ประหยัดมาก";
  if (value <= 500) return "ประหยัด";
  if (value <= 1000) return "ปานกลาง";
  return "พรีเมียม";
}

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
  image_url: string | null;
};

export type PlanRequest = {
  month: number;
  days: number;
  styles: string[];
  budget: number;
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

export type EnrichedPlanItem = PlanItem & { attraction: Attraction | null };
export type EnrichedPlanDay = { day: number; items: EnrichedPlanItem[] };
export type PlanApiResponse = {
  summary: string;
  days: EnrichedPlanDay[];
  low_season_perks: string[];
};
