import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

export const runtime = "nodejs";

const UpdateAttractionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  district: z.string().max(100).nullable().optional(),
  category: z.array(z.enum(["nature", "culture", "food", "wellness", "community"])).min(1).optional(),
  months_best: z.array(z.number().int().min(1).max(12)).min(1).optional(),
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

const s3 = process.env.R2_ACCOUNT_ID
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

async function deleteR2Image(imageUrl: string) {
  if (!s3 || !imageUrl) return;
  try {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1); // remove leading /
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }));
  } catch (err) {
    console.error("Failed to delete R2 image:", err);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateAttractionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  // If image_url changed, delete old image
  if (parsed.data.image_url !== undefined) {
    const { data: existing } = await admin.from("attractions").select("image_url").eq("id", id).single();
    if (existing?.image_url && existing.image_url !== parsed.data.image_url) {
      await deleteR2Image(existing.image_url);
    }
  }

  const { data, error } = await admin
    .from("attractions")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Attraction not found" }, { status: 404 });
  }

  // Audit log
  await admin.from("audit_log").insert({
    user_id: user.id,
    user_email: user.email,
    action: "update",
    entity_type: "attraction",
    entity_id: id,
    details: { name: data.name, changes: Object.keys(parsed.data) },
  });

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createServiceRoleClient();

  // Get image URL before deleting
  const { data: existing } = await admin.from("attractions").select("image_url").eq("id", id).single();

  const { error } = await admin
    .from("attractions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Delete associated image from R2
  if (existing?.image_url) {
    await deleteR2Image(existing.image_url);
  }

  // Audit log
  await admin.from("audit_log").insert({
    user_id: user.id,
    user_email: user.email,
    action: "delete",
    entity_type: "attraction",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}
