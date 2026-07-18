import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

export const runtime = "nodejs";

const AttractionSchema = z.object({
  id: z.string().max(200),
  name: z.string().max(300),
  district: z.string().max(200).nullable(),
  category: z.array(z.string().max(100)).max(20),
  months_best: z.array(z.number().int().min(1).max(12)).max(12),
  season_note: z.string().max(2000).nullable(),
  is_secondary: z.boolean(),
  is_community: z.boolean(),
  budget_level: z.number().min(0),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  description: z.string().max(5000).nullable(),
  contact: z.string().max(500).nullable(),
});

const PlanItemSchema = z.object({
  id: z.string().max(200),
  time: z.string().max(100),
  reason: z.string().max(2000),
  tip: z.string().max(2000),
  attraction: AttractionSchema.nullable(),
});

const PlanDaySchema = z.object({
  day: z.number().int(),
  items: z.array(PlanItemSchema).max(50),
});

const SharePlanSchema = z.object({
  summary: z.string().max(5000),
  days: z.array(PlanDaySchema).max(30),
  low_season_perks: z.array(z.string().max(500)).max(20),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SharePlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("shared_plans")
    .insert({ plan: parsed.data })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
