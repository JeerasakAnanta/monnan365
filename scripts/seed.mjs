import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.\n" +
      "Get the service role key from Supabase Dashboard > Project Settings > API,\n" +
      "then run: SUPABASE_SERVICE_ROLE_KEY=... npm run seed"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "nan-seed.json");
const attractions = JSON.parse(await readFile(dataPath, "utf-8"));

const { error, count } = await supabase
  .from("attractions")
  .upsert(attractions, { onConflict: "id", count: "exact" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${attractions.length} attractions (upserted, count=${count ?? "n/a"}).`);
