import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { z } from "zod";

export const runtime = "nodejs";

const AiConfigSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  const { data, error } = await admin.from("ai_config").select("*").order("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
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

  const parsed = AiConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  const updates = Object.entries(parsed.data).map(([id, value]) =>
    admin
      .from("ai_config")
      .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    return NextResponse.json({ error: "Some updates failed", details: errors.map((e) => e.error!.message) }, { status: 500 });
  }

  // Audit log
  await admin.from("audit_log").insert({
    user_id: user.id,
    user_email: user.email,
    action: "config_change",
    entity_type: "ai_config",
    details: { keys: Object.keys(parsed.data) },
  });

  return NextResponse.json({ success: true });
}
