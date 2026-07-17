# Nan365 — AI Trip Planner & Concierge
## Implementation Plan (Nan Beyond Seasons Challenge 2026, Track 1)

**เดดไลน์ส่งงาน:** 15 ก.ค. 2026, 09:00 (Link + Repo + วิดีโอ)
**เวลาที่เหลือ:** ~1.5 วัน
**เป้าหมาย:** Web app ที่สร้างแผนเที่ยวน่านตามเดือน/ความสนใจ โดยเน้นกระจายนักท่องเที่ยวสู่ Green Season และแหล่งท่องเที่ยวรอง/ชุมชน

---

## 1. Scope

### In scope (MVP)
- ฟอร์มรับ input: เดือนที่เดินทาง, จำนวนวัน (1–5), สไตล์ (ธรรมชาติ / วัฒนธรรม / อาหาร / Wellness), งบประมาณ (ประหยัด / กลาง / พรีเมียม)
- AI สร้างแผนเที่ยวรายวัน (structured JSON) จาก curated dataset
- แสดงผลเป็น timeline card ต่อวัน + แผนที่จุดสำคัญ
- Section "ทำไมเดือนนี้ถึงน่าไป" — highlight จุดเด่นของฤดูนั้น
- Badge "Low Season" / "ชุมชน-แหล่งท่องเที่ยวรอง" บนแต่ละรายการ
- Accessibility: ปุ่มปรับขนาดตัวอักษร

### Out of scope (ตัดทิ้งเพื่อให้ทัน)
- Login / บัญชีผู้ใช้ (ไม่ต้องมี → ไม่ต้องเตรียม test account)
- การจองจริง, ระบบชำระเงิน
- Vector database / RAG เต็มรูปแบบ (ใช้ RAG-lite: filter JSON แล้วยัดเข้า context)
- Multi-language (ทำภาษาไทยอย่างเดียว)

---

## 2. Architecture

```
[Next.js (App Router) — Vercel]
 ├─ / .................. หน้าเดียว: form + result
 ├─ /api/plan .......... API route: รับ input → filter dataset → เรียก LLM → คืน itinerary JSON
 └─ /data/nan.json ..... curated dataset (สถานที่, กิจกรรม, ฤดูกาล)
```

**Flow ของ /api/plan:**
1. รับ `{month, days, styles[], budget}`
2. Filter `nan.json`: เอาเฉพาะรายการที่ `months_best` ครอบคลุมเดือนนั้น + ตรง category
3. บังคับ quota: อย่างน้อย 35% ของรายการที่ส่งเข้า prompt ต้องเป็น `is_secondary: true`
4. เรียก OpenRouter API พร้อม system prompt ให้ตอบเป็น JSON schema ที่กำหนด
5. Validate JSON (zod) → คืน frontend

**เหตุผลที่ไม่ใช้ FastAPI + vector DB:** ข้อมูลน่านทั้งชุด < 200 รายการ ใส่ context ได้โดยตรง ลด infra ที่ต้อง deploy/debug เหลือชิ้นเดียวบน Vercel

---

## 3. Data Schema

`data/nan.json` — array ของ:

```json
{
  "id": "wat-phumin",
  "name": "วัดภูมินทร์",
  "district": "เมืองน่าน",
  "category": ["culture"],
  "months_best": [1,2,3,4,5,6,7,8,9,10,11,12],
  "season_note": "ชมได้ทั้งปี ฝนตกก็เที่ยวได้",
  "is_secondary": false,
  "is_community": false,
  "budget_level": "low",
  "lat": 18.7756, "lng": 100.7714,
  "description": "จิตรกรรมฝาผนังปู่ม่านย่าม่าน...",
  "contact": null
}
```

ฟิลด์สำคัญต่อคะแนน:
- `is_secondary` / `is_community` → ใช้บังคับ quota กระจายรายได้ (Impact 20 + ชุมชน 15)
- `season_note` → ให้ AI ขายจุดเด่นรายฤดู (ธีม "ไร้ฤดู")
- `contact` → เบอร์/เพจของวิสาหกิจชุมชน (ความเข้าใจชุมชน)

**แหล่งข้อมูล:**
1. ปฏิทินท่องเที่ยวน่านรายปี — gdcatalog.go.th/dataset/gdpublish-40-021
2. สรุปสถานการณ์ท่องเที่ยวน่าน — gdcatalog.go.th/dataset/gdpublish-dataset-40-0111
3. หน้า ททท. จังหวัดน่าน + บทความ 5 Must Do In Nan
4. TAT Data API — tatdataapi.io (ถ้าสมัคร key ทันก็ดึงสด ไม่ทันก็ snapshot ลง JSON)

เป้า: 60–100 รายการ (แบ่ง หลัก ~40% / รอง+ชุมชน ~60%) + กิจกรรม/เทศกาลรายเดือน 12 เดือน

---

## 4. LLM Integration

- Model: OpenRouter (`openai/gpt-oss-120b:free`) ผ่าน API route ฝั่ง server เท่านั้น
- API key เก็บใน Environment Variable บน Vercel — **ห้ามอยู่ใน repo** (กติกาบังคับ + มี .gitignore สำหรับ .env)
- System prompt กำหนด:
  - ตอบเป็น JSON ตาม schema เท่านั้น
  - ทุกวันต้องมีอย่างน้อย 1 รายการที่ `is_secondary` หรือ `is_community`
  - ทุกรายการต้องมี `reason` สั้นๆ ว่าทำไมเหมาะกับเดือน/สไตล์นี้ (โชว์การใช้ AI ให้กรรมการเห็น)
  - ห้ามแต่งสถานที่ที่ไม่อยู่ใน dataset (กัน hallucination — ตอบข้อ Responsible AI Use)

Output schema:

```json
{
  "summary": "ภาพรวมทริป + จุดเด่นของเดือนนี้",
  "days": [
    {
      "day": 1,
      "items": [
        {"id": "...", "time": "เช้า", "reason": "...", "tip": "..."}
      ]
    }
  ],
  "low_season_perks": ["ที่พักถูกกว่า ~30%", "..."]
}
```

---

## 5. UI (หน้าเดียว)

1. **Hero + Form** — dropdown เดือน, จำนวนวัน, checkbox สไตล์, งบ, ปุ่ม "วางแผน"
2. **Loading state** — ข้อความหมุนเวียนเกี่ยวกับน่าน
3. **ผลลัพธ์:**
   - การ์ดสรุป "ทำไม [เดือน] ถึงน่าไปน่าน"
   - Timeline รายวัน: card ต่อสถานที่ (ชื่อ, เวลา, reason จาก AI, badge ชุมชน/Low Season, ลิงก์ contact)
   - แผนที่ (Leaflet + OpenStreetMap — ฟรี ไม่ต้องใช้ key) ปักหมุดตามแผน
4. **ปุ่ม A/A+ ปรับขนาดตัวอักษร** (โบนัส accessibility)

---

## 6. Timeline

### วันนี้ — 13 ก.ค. (Data + Core)
- [ ] Scaffold Next.js + deploy Vercel เปล่าๆ ให้ pipeline เขียวก่อน (กัน surprise วันสุดท้าย)
- [ ] รวบรวมข้อมูลจากแหล่งข้างต้น → สร้าง `nan.json` (งานหนักสุด ~3-4 ชม.)
- [ ] เขียน `/api/plan`: filter logic + prompt + zod validation
- [ ] ทดสอบ prompt กับ 3-4 เดือนต่างฤดู (เช่น ก.พ. หน้าแล้ง / ส.ค. Green Season) จน output นิ่ง

### พรุ่งนี้ — 14 ก.ค. (UI + Submission assets)
- [ ] เช้า: UI form + timeline + แผนที่ + badges
- [ ] บ่าย: polish, responsive มือถือ, ปุ่มขนาดตัวอักษร, error/loading states
- [ ] เย็น: README (แนวคิด, tech stack, วิธีรัน, architecture diagram)
- [ ] ค่ำ: อัดวิดีโอ demo ≤ 3 นาที — โครงสคริปต์:
  1. ปัญหา: นักท่องเที่ยวกระจุกหน้าหนาว (30 วิ)
  2. Demo: วางแผนเดือน ส.ค. → โชว์ Green Season + ชุมชน (90 วิ)
  3. AI ทำงานยังไง + ประโยชน์ต่อชุมชน + แผนต่อยอด (60 วิ)

### 15 ก.ค. เช้า (Buffer)
- [ ] 06:00–08:00: ตรวจ Demo Link บน Vercel จากเครื่อง/มือถืออื่น, ตรวจ repo ไม่มี secret, ส่งฟอร์ม
- [ ] **ส่งก่อน 08:30 อย่ารอ 09:00**

---

## 7. Checklist กติกา

- [ ] Demo Link สาธารณะ ใช้งานได้ทันทีไม่ต้อง login
- [ ] GitHub repo + README อธิบายแนวคิดและ tech stack
- [ ] ไม่มี API key / secret ใน repo (ใช้ env vars + .gitignore)
- [ ] วิดีโอ ≤ 3 นาที: ปัญหา → วิธีแก้ → สาธิต AI จริง → ประโยชน์ชุมชน
- [ ] คำอธิบายผลงาน: กลุ่มเป้าหมาย, ปัญหา, วิธีใช้ AI, แผนต่อยอด
- [ ] เนื้อหาจาก Generative AI ผ่านการตรวจสอบความถูกต้องและความเหมาะสมต่อวัฒนธรรมน่านแล้ว

## 8. Risk & Fallback

| ความเสี่ยง | Fallback |
|---|---|
| เก็บข้อมูลไม่ทัน 100 รายการ | ลดเหลือ 40–50 รายการคุณภาพดี ครบ 12 เดือน ก็พอ demo ได้ |
| LLM ตอบ JSON เพี้ยน | zod validate + retry 1 ครั้ง + fallback แผนจาก rule-based filter |
| Vercel/API ล่มวันตัดสิน | อัดวิดีโอ demo ให้ครอบคลุมทุกฟีเจอร์ไว้ก่อน |
| เวลาไม่พอทำแผนที่ | ตัดแผนที่ออก เหลือ timeline อย่างเดียว (แผนที่คือ nice-to-have) |