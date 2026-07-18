import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { z } from "zod";

export const runtime = "nodejs";

const CreateAttractionSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200),
  district: z.string().max(100).nullable().optional(),
  category: z.array(z.enum(["nature", "culture", "food", "wellness", "community"])).min(1),
  months_best: z.array(z.number().int().min(1).max(12)).min(1),
  season_note: z.string().max(500).nullable().optional(),
  is_secondary: z.boolean().optional(),
  is_community: z.boolean().optional(),
  budget_level: z.number().min(0).optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  contact: z.string().max(500).nullable().optional(),
  image_url: z.string().url().max(1000).nullable().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("attractions")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

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

  const parsed = CreateAttractionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  // Generate UUID if no ID provided
  const id = data.id || crypto.randomUUID();

  const admin = createServiceRoleClient();
  const { data: created, error } = await admin
    .from("attractions")
    .upsert({ ...data, id }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await admin.from("audit_log").insert({
    user_id: user.id,
    user_email: user.email,
    action: "create",
    entity_type: "attraction",
    entity_id: id,
    details: { name: data.name },
  });

  return NextResponse.json(created, { status: 201 });
}
