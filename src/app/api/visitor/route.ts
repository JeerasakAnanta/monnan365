import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import crypto from "crypto";

export const runtime = "nodejs";

const IP_SALT = process.env.IP_HASH_SALT ?? "monnan365-salt-2024";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedCount: number | null = null;
let cacheTimestamp = 0;

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex");
}

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
    const ipHash = hashIp(ip);
    const path = new URL(request.url).searchParams.get("path") ?? "/";

    const admin = createServiceRoleClient();

    // Insert this visit
    await admin.from("visits").insert({ ip_hash: ipHash, path });

    // Return cached count if fresh
    if (cachedCount !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json({ total: cachedCount });
    }

    // Query distinct unique visitors in last 30 days
    const { count, error } = await admin
      .from("visits")
      .select("ip_hash", { count: "exact", head: true })
      .gte("visited_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Visitor count query error:", error);
      return NextResponse.json({ total: cachedCount ?? 0 });
    }

    const total = count ?? 0;

    // Update cache
    cachedCount = total;
    cacheTimestamp = Date.now();

    return NextResponse.json({ total });
  } catch (err) {
    console.error("Visitor API error:", err);
    return NextResponse.json({ total: cachedCount ?? 0 });
  }
}
