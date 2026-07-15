import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();

  const [attractions, sharedPlans] = await Promise.all([
    admin.from("attractions").select("district, is_secondary, is_community, months_best"),
    admin.from("shared_plans").select("id", { count: "exact", head: true }),
  ]);

  if (attractions.error) {
    return NextResponse.json({ error: "Failed to fetch attractions", details: attractions.error.message }, { status: 500 });
  }

  const rows = attractions.data ?? [];

  // District counts
  const districtMap = new Map<string, number>();
  for (const a of rows) {
    const d = a.district || "ไม่ระบุ";
    districtMap.set(d, (districtMap.get(d) || 0) + 1);
  }
  const districts = [...districtMap.entries()]
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly coverage
  const monthlyCoverage = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const count = rows.filter((a) => (a.months_best ?? []).includes(month)).length;
    return { month, count };
  });

  const response = NextResponse.json({
    totalAttractions: rows.length,
    secondaryCount: rows.filter((a) => a.is_secondary).length,
    communityCount: rows.filter((a) => a.is_community).length,
    totalSharedPlans: sharedPlans.count ?? 0,
    districts,
    monthlyCoverage,
  });

  response.headers.set("Cache-Control", "private, max-age=60");
  return response;
}
