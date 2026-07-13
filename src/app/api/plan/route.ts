import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { createClient } from "@/lib/supabase/server";
import { selectAttractions } from "@/lib/selectAttractions";
import type { Attraction } from "@/lib/types";

export const runtime = "nodejs";

const PlanRequestSchema = z.object({
  month: z.number().int().min(1).max(12),
  days: z.number().int().min(1).max(5),
  styles: z.array(z.enum(["nature", "culture", "food", "wellness", "community"])).min(1),
  budget: z.enum(["low", "mid", "premium"]),
});

const PlanItemSchema = z.object({
  id: z.string().describe("Must match an id from the provided attraction list"),
  time: z.string().describe("เช้า, บ่าย, or เย็น"),
  reason: z.string().describe("สั้นๆ ว่าทำไมเหมาะกับเดือน/สไตล์นี้"),
  tip: z.string(),
});

const PlanDaySchema = z.object({
  day: z.number().int(),
  items: z.array(PlanItemSchema).min(1),
});

const PlanResponseSchema = z.object({
  summary: z.string().describe("ภาพรวมทริป + จุดเด่นของเดือนนี้"),
  days: z.array(PlanDaySchema),
  low_season_perks: z.array(z.string()),
});

const MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

function buildUserPrompt(
  month: number,
  days: number,
  styles: string[],
  budget: string,
  attractions: Attraction[]
): string {
  const attractionList = attractions.map((a) => ({
    id: a.id,
    name: a.name,
    district: a.district,
    category: a.category,
    season_note: a.season_note,
    is_secondary: a.is_secondary,
    is_community: a.is_community,
    budget_level: a.budget_level,
    description: a.description,
  }));

  return `วางแผนทริปเที่ยวจังหวัดน่าน
- เดือนที่เดินทาง: ${MONTH_NAMES[month - 1]}
- จำนวนวัน: ${days}
- สไตล์ที่สนใจ: ${styles.join(", ")}
- งบประมาณ: ${budget}

รายการสถานที่/กิจกรรมที่ใช้ได้ (ห้ามใช้สถานที่อื่นนอกเหนือจากนี้):
${JSON.stringify(attractionList, null, 2)}`;
}

const SYSTEM_PROMPT = `คุณคือผู้ช่วยวางแผนทริปท่องเที่ยวจังหวัดน่าน ประเทศไทย ภายใต้แคมเปญ "น่าน ไร้ฤดู" ที่ต้องการกระจายนักท่องเที่ยวออกจากฤดูหนาว (ไฮซีซัน) ไปสู่ทุกเดือนของปี และกระจายรายได้สู่ชุมชนและแหล่งท่องเที่ยวรอง

กติกาการตอบ:
1. ใช้เฉพาะสถานที่ที่มีอยู่ใน "รายการสถานที่ที่ใช้ได้" เท่านั้น ห้ามแต่งสถานที่ขึ้นมาเอง อ้างอิงด้วย id ที่ตรงกัน
2. ทุกวันต้องมีอย่างน้อย 1 รายการที่ is_secondary=true หรือ is_community=true
3. ทุกรายการต้องมี reason สั้นๆ อธิบายว่าทำไมเหมาะกับเดือนและสไตล์ที่ผู้ใช้เลือก
4. summary ต้องเน้นจุดเด่นของการมาเที่ยวเดือนนี้ (เช่น อากาศ, เทศกาล, ความคุ้มค่า) เพื่อกระตุ้นการเดินทางนอกไฮซีซัน
5. low_season_perks ให้ระบุข้อดีของการมาเที่ยวนอกช่วงไฮซีซัน 2-4 ข้อ
6. ตอบเป็นภาษาไทยทั้งหมด`;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedRequest = PlanRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsedRequest.error.flatten() },
      { status: 400 }
    );
  }
  const { month, days, styles, budget } = parsedRequest.data;

  const supabase = await createClient();
  const { data: attractions, error: dbError } = await supabase
    .from("attractions")
    .select("*")
    .contains("months_best", [month]);

  if (dbError) {
    return NextResponse.json({ error: "Database error", details: dbError.message }, { status: 500 });
  }
  if (!attractions || attractions.length === 0) {
    return NextResponse.json({ error: "No attractions found for this month" }, { status: 404 });
  }

  const selected = selectAttractions(attractions as Attraction[], styles, days);
  const userPrompt = buildUserPrompt(month, days, styles, budget, selected);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const models = ["google/gemini-3.5-flash"];
  const MAX_RETRIES = 3;

  let parsed: z.infer<typeof PlanResponseSchema> | null = null;
  let lastError: string | null = null;

  const startTime = Date.now();
  console.log(`[LLM] Starting | models=${models.join(" → ")}`);

  for (const model of models) {
    if (parsed) break;
    console.log(`[LLM] Trying model: ${model}`);
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const attemptStart = Date.now();
      try {
        const response = await openai.chat.completions.parse({
          model,
          max_tokens: 4096,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: zodResponseFormat(PlanResponseSchema, "plan"),
        });
        parsed = response.choices[0].message.parsed ?? null;
        if (parsed) {
          const elapsed = Date.now() - attemptStart;
          console.log(`[LLM] ✓ Success | model=${model} attempt=${attempt} ${elapsed}ms`);
          break;
        }
        lastError = "LLM returned null parsed output";
        console.warn(`[LLM] ✗ Null output | model=${model} attempt=${attempt}`);
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        const elapsed = Date.now() - attemptStart;
        console.error(`[LLM] ✗ Error | model=${model} attempt=${attempt} ${elapsed}ms | ${lastError}`);
        if (attempt < MAX_RETRIES) {
          const delay = 1000 * attempt;
          console.log(`[LLM] Retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }
    if (!parsed) {
      console.warn(`[LLM] Model ${model} exhausted, falling back...`);
    }
  }

  const totalElapsed = Date.now() - startTime;
  if (!parsed) {
    console.error(`[LLM] ✗ All models failed after ${totalElapsed}ms | lastError: ${lastError}`);
    return NextResponse.json(
      { error: "LLM request failed after retries", details: lastError },
      { status: 502 }
    );
  }

  console.log(`[LLM] Done | ${totalElapsed}ms total`);

  const attractionsById = new Map(selected.map((a) => [a.id, a]));
  const enrichedDays = parsed.days.map((day) => ({
    ...day,
    items: day.items.map((item) => ({
      ...item,
      attraction: attractionsById.get(item.id) ?? null,
    })),
  }));

  return NextResponse.json({
    summary: parsed.summary,
    days: enrichedDays,
    low_season_perks: parsed.low_season_perks,
  });
}
