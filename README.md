# MonNan365 — มนต์น่าน 365 วัน

> **AI Trip Planner & Concierge เที่ยวน่านได้ทุกฤดู**
> ผลงานส่งเข้าแข่งขัน Nan Beyond Seasons Challenge 2026 (Track 1: AI Trip Planner & Concierge)

🔗 **Live Demo:** <https://monnan.jeerasakananta.dev/>
📋 **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## ปัญหา (Problem)

การท่องเที่ยวจังหวัดน่านกระจุกตัวอยู่ในช่วงฤดูหนาวเพียงไม่กี่เดือน ทำให้

- รายได้ของผู้ประกอบการและชุมชนขาดช่วงในฤดูอื่น
- แหล่งท่องเที่ยวรองและวิสาหกิจชุมชนไม่เป็นที่รู้จัก แม้มีคุณค่าตลอด 12 เดือน
- นักท่องเที่ยวไม่รู้ว่า "นอกฤดูหนาว น่านมีอะไร" — ทั้งที่ทุกเดือนมีเทศกาล วัฒนธรรม อาหาร และธรรมชาติเฉพาะฤดู

## โซลูชัน (Solution)

**MonNan365** คือ AI Trip Planner ที่วางแผนเที่ยวน่านตาม **เดือนที่ผู้ใช้จะเดินทางจริง** — ไม่ใช่แนะนำแต่ที่ยอดนิยมหน้าหนาว

ผู้ใช้เลือก: เดือนเดินทาง / จำนวนวัน / สไตล์ (ธรรมชาติ, วัฒนธรรม, อาหาร, Wellness) / งบประมาณ
ระบบจะสร้างแผนเที่ยวรายวัน โดย:

1. **ขายจุดเด่นของฤดูนั้น** — เช่น Green Season มีนาข้าวเขียว หมอกหน้าฝน ที่พักถูกกว่า คนน้อยกว่า
2. **บังคับกระจายสู่ชุมชน** — ทุกแผนมีแหล่งท่องเที่ยวรอง/วิสาหกิจชุมชนอย่างน้อย ~35% พร้อมช่องทางติดต่อจริง
3. **AI อธิบายเหตุผล** — ทุกจุดหมายมีคำอธิบายว่าทำไมเหมาะกับเดือนและสไตล์ของผู้ใช้

### ความสอดคล้องกับเป้าหมายของโจทย์

| เป้าหมายโจทย์ | สิ่งที่ MonNan365 ทำ |
|---|---|
| กระจายนักท่องเที่ยวออกจากฤดูหนาว | Planner เชิงรุกที่ชูจุดเด่นของ Low/Green Season |
| กระจายรายได้สู่ชุมชนรอง | Quota แหล่งท่องเที่ยวรอง +ป_ ข้อมูลติดต่อวิสาหกิจชุมชน |
| เพิ่มเวลาพำนักและกิจกรรม | แผนรายวันหลายวัน ผสมกิจกรรมหลากประเภท |
| ยกระดับดิจิทัลท้องถิ่น | โครงสร้างข้อมูลเปิด (JSON) ที่ชุมชนต่อยอดเพิ่มรายการเองได้ |

---

## Tech Stack

| ส่วน | เทคโนโลยี | เหตุผล |
|---|---|---|
| Frontend + Backend | Next.js 16 (App Router, TypeScript, Tailwind CSS 4) | โค้ดชุดเดียว deploy ง่าย |
| AI | OpenRouter (`openai/gpt-oss-120b:free`) | สร้างแผนเที่ยวแบบ Structured Output (JSON) พร้อมเหตุผลภาษาไทย |
| ฐานข้อมูล | Supabase (Postgres) | เก็บ dataset สถานที่/กิจกรรมของน่านเป็นตาราง `attractions` query ตามเดือน/สไตล์ก่อนส่งเข้า LLM — แม่นยำ ไม่ hallucinate |
| Validation | Zod + OpenAI Structured Outputs (`response_format`) | บังคับ schema ของ output จาก LLM ตั้งแต่ระดับ API |
| แผนที่ | Leaflet + OpenStreetMap (react-leaflet) | ฟรี ไม่ต้องใช้ API key |
| Hosting | Docker (multi-stage, Next.js standalone) บน self-hosted VPS | คุมค่าใช้จ่ายและโครงสร้างเองได้เต็มที่ |
| CI/CD | GitLab CI (`.gitlab-ci.yml`) | lint/typecheck/build → build+push Docker image → deploy ผ่าน SSH ไปยัง VPS |

### สถาปัตยกรรม

```
ผู้ใช้ → Next.js UI (form + timeline + แผนที่)
          │
          ▼
     /api/plan (server-side, Next.js API route)
          │ 1. query ตาราง attractions ใน Supabase ตามเดือนที่เลือก
          │ 2. คัดกรอง/สุ่มตามสไตล์ + บังคับ quota แหล่งท่องเที่ยวรอง/ชุมชน ≥ 35%
           │ 3. เรียก OpenRouter API พร้อม response_format (Zod schema)
          │    → รับประกัน JSON ตรง schema ตั้งแต่ระดับ API
          ▼
     Itinerary JSON → Timeline cards + แผนที่ (Leaflet)
```

**Deploy pipeline (GitLab CI):**

```
push to main → install → lint + typecheck + build (test)
             → docker build (multi-stage, Next.js standalone output) → push to GitLab Container Registry
             → deploy (manual, SSH) → VPS: docker compose pull && docker compose up -d
```

### แหล่งข้อมูล

- ปฏิทินการท่องเที่ยวประจำปีจังหวัดน่าน — [gdcatalog.go.th](https://gdcatalog.go.th/dataset/gdpublish-40-021)
- สรุปสถานการณ์การท่องเที่ยวจังหวัดน่าน — [gdcatalog.go.th](https://gdcatalog.go.th/dataset/gdpublish-dataset-40-0111)
- การท่องเที่ยวแห่งประเทศไทย (ททท.) จังหวัดน่าน
- ข้อมูลชุดเริ่มต้น (`data/nan-seed.json`, 40 รายการ) เรียบเรียงจากแหล่งข้างต้นและความรู้ทั่วไปเกี่ยวกับน่าน
  **ทีมงานควรตรวจสอบความถูกต้องและเพิ่มเติมข้อมูลจากแหล่งทางการก่อนใช้งานจริง** ตามข้อกำหนด Responsible AI Use ของโจทย์

---

## การติดตั้งและรัน (Local Development)

```bash
# 1. Clone
git clone <repo-url>
cd rmutl_nan

# 2. ติดตั้ง dependencies
npm install

# 3. ตั้งค่า environment variables
cp .env.example .env
# แก้ไข .env ใส่ค่า NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
# SUPABASE_SERVICE_ROLE_KEY (ใช้เฉพาะตอน seed), OPENROUTER_API_KEY

# 4. สร้างตารางใน Supabase (รันครั้งเดียว)
# นำ SQL ใน supabase/migrations/0001_attractions.sql ไปรันใน Supabase SQL editor

# 5. Seed ข้อมูลสถานที่ท่องเที่ยวเข้า Supabase
SUPABASE_SERVICE_ROLE_KEY=... npm run seed

# 6. รัน dev server
npm run dev
# เปิด http://localhost:3000
```

### Environment Variables

| ตัวแปร | ใช้ที่ไหน | คำอธิบาย |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | URL โปรเจกต์ Supabase (public) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client + server | Publishable/anon key อ่านข้อมูล attractions แบบ public read-only (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | `scripts/seed.mjs`, `/api/plan/share` (server) | ใช้ seed/upsert ข้อมูลเข้าตาราง และบันทึกลิงก์แชร์แผนทริป bypass RLS — **ห้าม expose ฝั่ง client** |
| `OPENROUTER_API_KEY` | `/api/plan` (server) | เรียก OpenRouter API (GPT-OSS-120B) สร้างแผนเที่ยว |
| `IMAGE_NAME` | docker-compose (deploy เท่านั้น) | ชื่อ image จาก GitLab Container Registry ที่จะรันบน VPS |

> 🔒 **Security:** repo นี้ไม่มี API key หรือข้อมูลลับใดๆ — ใช้ environment variables และ `.gitignore` ครอบ `.env*` ตามข้อกำหนดของการแข่งขัน

---

## Deploy ขึ้น VPS (Docker + GitLab CI)

1. Push โค้ดขึ้น GitLab แล้วตั้งค่า CI/CD Variables (Settings > CI/CD > Variables) ให้ครบ:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (สำหรับ build)
   - `VPS_HOST`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY` (masked+protected), `VPS_APP_DIR`
2. บน VPS: สร้างโฟลเดอร์ตาม `VPS_APP_DIR`, copy `docker-compose.yml` ไปวาง และสร้างไฟล์ `.env` (ค่าเดียวกับด้านบน บวก `IMAGE_NAME=registry.gitlab.com/<group>/<project>:latest`)
3. Push ไปที่ branch `main` → pipeline จะ lint/typecheck/build → build+push Docker image → job `deploy_vps` เป็น manual trigger (กด Run ใน GitLab UI เพื่อ deploy จริง)
4. แอปจะรันที่พอร์ต `3003` บน VPS (`docker-compose.yml` map `3003:3000`)

ทดสอบ build image ในเครื่องได้ด้วย:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
  -t nan365-app:local .
docker compose up -d
```

---

## โครงสร้างโปรเจกต์

```
rmutl_nan/
├── src/
│   ├── app/
│   │   ├── page.tsx          # หน้าหลัก: form + แสดงแผนเที่ยว
│   │   └── api/plan/route.ts # API: query Supabase → LLM (structured output) → enrich
│   ├── components/           # PlanForm, TripResult, TripMap, FontSizeToggle
│   └── lib/
│       ├── types.ts             # Attraction / PlanRequest / PlanResponse types
│       ├── selectAttractions.ts # logic คัดกรอง + บังคับ quota แหล่งท่องเที่ยวรอง
│       └── supabase/client.ts   # Supabase client (publishable key)
├── data/
│   └── nan-seed.json         # ข้อมูลตั้งต้นสถานที่/กิจกรรมของน่าน (seed เข้า Supabase)
├── scripts/
│   └── seed.mjs              # upsert nan-seed.json เข้าตาราง attractions
├── supabase/migrations/
│   └── 0001_attractions.sql  # schema ตาราง attractions + RLS policy
├── CHANGELOG.md              # project changelog (Keep a Changelog)
├── Dockerfile                # multi-stage build, Next.js standalone output
├── docker-compose.yml        # รัน container บน VPS (port 3003:3000)
├── .gitlab-ci.yml            # install → lint/typecheck/build → docker build+push → deploy
└── README.md
```

---

## Responsible AI

- AI สร้างแผนจาก dataset ที่ตรวจสอบแล้วเท่านั้น — ระบบสั่งห้ามแนะนำสถานที่นอกฐานข้อมูล เพื่อป้องกันข้อมูลผิดพลาด
- เนื้อหาที่ AI สร้างผ่านการทดสอบความถูกต้องและความเหมาะสมต่อวัฒนธรรมท้องถิ่นน่าน
- ออกแบบให้เข้าถึงง่าย (Accessibility): ปรับขนาดตัวอักษรได้ รองรับการใช้งานบนมือถือ

## แผนต่อยอด (Future Work)

- เชื่อม TAT Data API แบบ real-time และข้อมูลพยากรณ์อากาศ
- ให้ชุมชน/ผู้ประกอบการเพิ่มรายการของตนเองผ่านฟอร์ม (community-sourced data)
- ระบบ feedback จากนักท่องเที่ยวเพื่อปรับปรุงคำแนะนำ
- รองรับภาษาอังกฤษและจีนสำหรับนักท่องเที่ยวต่างชาติ

## ทีม

- Jeerasak — Design, Development & Data Curation

## License

MIT
