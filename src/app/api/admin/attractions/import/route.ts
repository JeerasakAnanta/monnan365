import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { z } from "zod";

export const runtime = "nodejs";

const ImportAttractionSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  district: z.string().max(100).nullable().optional(),
  category: z.array(z.string()).optional(),
  months_best: z.array(z.number().int().min(1).max(12)).optional(),
  season_note: z.string().max(500).nullable().optional(),
  is_secondary: z.boolean().optional(),
  is_community: z.boolean().optional(),
  budget_level: z.enum(["low", "mid", "premium"]).optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  contact: z.string().max(500).nullable().optional(),
  image_url: z.string().url().max(1000).nullable().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be an array of attractions" }, { status: 400 });
  }

  if (body.length > 500) {
    return NextResponse.json({ error: "Maximum 500 attractions per import" }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  const results: { id: string; status: "created" | "updated" | "error"; error?: string }[] = [];

  for (const item of body) {
    const parsed = ImportAttractionSchema.safeParse(item);
    if (!parsed.success) {
      results.push({ id: (item as Record<string, unknown>).id as string || "unknown", status: "error", error: parsed.error.message });
      continue;
    }

    const { error } = await admin
      .from("attractions")
      .upsert(parsed.data, { onConflict: "id" });

    if (error) {
      results.push({ id: parsed.data.id, status: "error", error: error.message });
    } else {
      results.push({ id: parsed.data.id, status: "updated" });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const errors = results.filter((r) => r.status === "error");

  return NextResponse.json({
    total: body.length,
    created,
    updated,
    errors: errors.length,
    details: errors,
  });
}
