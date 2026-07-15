import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

export async function isAdmin(userId: string): Promise<boolean> {
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .single();
  return !!data;
}
