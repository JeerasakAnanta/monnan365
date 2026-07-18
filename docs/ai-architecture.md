# สรุปการทำงานของ AI และสถาปัตยกรรมแอป — MonNan365

> เอกสารสรุปสั้น พร้อม diagram สำหรับอธิบาย AI trip planner ของ "มนต์น่าน 365"
> รายละเอียดเชิงลึกเพิ่มเติม (schema, component list, deploy pipeline) ดูที่ [00_architecture.mdx](./00_architecture.mdx)

## ภาพรวม

MonNan365 เป็น **RAG-lite AI Trip Planner**: ไม่ให้ LLM คิดสถานที่เอง แต่ query ข้อมูลจริงจาก Supabase มาก่อน กรอง/บังคับสัดส่วนด้วย business logic แล้วค่อยส่งชุดข้อมูลที่คัดแล้วให้ LLM เลือกและอธิบายเหตุผลเท่านั้น — ป้องกัน hallucination และรับประกันว่าทุกแผนมีแหล่งท่องเที่ยวรอง/ชุมชนอย่างน้อย 35%

## Diagram: สถาปัตยกรรมแอปทั้งระบบ

```mermaid
flowchart TB
    subgraph Client["ผู้ใช้ (Browser)"]
        UI["Next.js Pages<br/>PlanForm / TripResult / TripMap"]
        Admin["Admin Panel<br/>Dashboard / Attractions / AI Config"]
    end

    subgraph Server["Next.js Server (App Router)"]
        MW["middleware.ts<br/>auth guard สำหรับ /admin/*"]
        PlanAPI["/api/plan"]
        ShareAPI["/api/plan/share"]
        VisitorAPI["/api/visitor"]
        AdminAPI["/api/admin/*<br/>attractions · ai-config · stats · audit"]
    end

    subgraph Data["Supabase (PostgreSQL)"]
        DB[("ตาราง:<br/>attractions · shared_plans<br/>ai_config · admin_users · visits")]
        Auth["Supabase Auth"]
    end

    LLM["OpenRouter API<br/>google/gemini-3.5-flash"]
    R2[("Cloudflare R2<br/>รูปภาพสถานที่")]

    UI -->|"POST เดือน/วัน/สไตล์/งบ"| PlanAPI
    UI -->|"POST บันทึกแชร์แผน"| ShareAPI
    UI -->|"GET นับผู้เยี่ยมชม"| VisitorAPI
    Admin -->|CRUD| AdminAPI
    MW -. คุ้มครอง .-> Admin
    MW -. คุ้มครอง .-> AdminAPI

    PlanAPI -->|"query months_best"| DB
    PlanAPI -->|"structured output"| LLM
    ShareAPI --> DB
    VisitorAPI --> DB
    AdminAPI --> DB
    AdminAPI --> Auth
    AdminAPI -->|"upload/delete รูป"| R2
    Admin -->|login| Auth
```

## การทำงานของ AI (Trip Planning Flow)

จุดเริ่มต้นที่ `src/app/api/plan/route.ts`:

```mermaid
sequenceDiagram
    participant U as ผู้ใช้
    participant UI as PlanForm (Client)
    participant API as /api/plan (Server)
    participant DB as Supabase
    participant SEL as selectAttractions()
    participant LLM as OpenRouter (LLM)

    U->>UI: เลือกเดือน / จำนวนวัน / สไตล์ / งบประมาณ
    UI->>API: POST body (validate ด้วย Zod)
    API->>DB: SELECT * FROM attractions WHERE months_best @> [month]
    DB-->>API: attractions[]
    API->>SEL: filter ตามสไตล์ + บังคับ quota + shuffle
    SEL-->>API: attractions ที่คัดแล้ว (≥35% secondary/community)
    API->>DB: โหลด ai_config (cache ใน memory 60 วิ)
    DB-->>API: model, temperature, system_prompt, max_retries
    loop สูงสุด max_retries ครั้ง, backoff 1s/2s/3s
        API->>LLM: chat.completions.parse()<br/>system+user prompt, zodResponseFormat(PlanResponseSchema)
        LLM-->>API: PlanResponse JSON (ตรง schema) หรือ error
    end
    API->>API: enrich — map id ที่ AI เลือก กลับเป็นข้อมูลสถานที่เต็ม
    API-->>UI: { summary, days[], low_season_perks }
    UI-->>U: Timeline cards + แผนที่ Leaflet
```

### รายละเอียดแต่ละขั้นตอน

1. **Validate request** — `PlanRequestSchema` (Zod) ตรวจ `month` (1-12), `days` (1-5), `styles` (nature/culture/food/wellness/community อย่างน้อย 1), `budget`
2. **Query ฐานข้อมูล** — ดึงเฉพาะ attractions ที่ `months_best` ครอบคลุมเดือนที่เลือก (`.contains("months_best", [month])`)
3. **`selectAttractions()`** (`src/lib/selectAttractions.ts`) — กรองตามสไตล์ (fallback เป็นทั้งหมดถ้า pool เล็กเกินไป) → แยก pool หลัก/รอง → สุ่มด้วย Fisher-Yates ทั้งสอง pool → บังคับสัดส่วนรอง/ชุมชนขั้นต่ำ 35% ของ target (`min(pool.length, max(days×4, 12))`) → รวมและสุ่มอีกครั้ง
4. **โหลด AI config** — พารามิเตอร์ LLM (model, temperature, max_tokens, max_retries, system prompt) มาจากตาราง `ai_config` ที่แก้ได้ผ่าน admin panel, cache ใน memory 60 วินาทีเพื่อลด DB hit
5. **เรียก LLM ผ่าน OpenRouter** — ใช้ `zodResponseFormat(PlanResponseSchema, "plan")` บังคับ schema ระดับ API พร้อม system prompt ภาษาไทยที่กำหนดกติกา anti-hallucination (ใช้เฉพาะ id ในรายการที่ส่งไป, ทุกวันต้องมีแหล่งรอง/ชุมชนอย่างน้อย 1 แห่ง) — retry สูงสุด `max_retries` ครั้งต่อ model ด้วย exponential backoff
6. **Enrich** — จับคู่ `id` ที่ AI เลือกกลับเป็นข้อมูลสถานที่เต็มจาก `selected` (ไม่ใช่ query DB ซ้ำ) แล้วส่งกลับเป็น `PlanApiResponse`

## กลไกสำคัญ (Design Decisions)

| กลไก | รายละเอียด |
|---|---|
| **35% Secondary/Community Quota** | บังคับใน `selectAttractions()` ก่อนส่งเข้า LLM ไม่ใช่แค่ prompt engineering — วัดผลได้ 100% ของ output |
| **Anti-hallucination** | LLM เลือกได้เฉพาะ `id` จาก dataset ที่ส่งไปเท่านั้น ห้ามแต่งสถานที่ |
| **Structured Output** | `zodResponseFormat` บังคับ JSON schema ระดับ API ไม่ต้อง parse/validate เอง |
| **Retry + Backoff** | สูงสุด 3 ครั้ง (ปรับได้), หน่วง 1s → 2s → 3s ต่อ attempt |
| **AI Config Cache** | 60 วินาที ต่อ server instance ลด DB round-trip ทุก request |
| **RLS แยกสิทธิ์** | Client/SSR ใช้ publishable key (อ่านอย่างเดียว), เขียนได้เฉพาะผ่าน service role key ฝั่ง server |

## Tech Stack

| Layer | เทคโนโลยี |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| UI | React 19 + Tailwind CSS 4 |
| Database | Supabase (PostgreSQL, RLS) |
| LLM | OpenRouter → `google/gemini-3.5-flash` |
| Validation | Zod + Structured Outputs |
| แผนที่ | Leaflet + OpenStreetMap |
| Storage | Cloudflare R2 (รูปสถานที่) |
| Auth | Supabase Auth (email/password) |
| Deploy | Docker multi-stage → VPS (GitHub Actions CI/CD) |
