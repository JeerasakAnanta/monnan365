-- AI configuration table — stores adjustable parameters for the trip planner LLM.
-- Each row is a key-value pair where `value` is JSONB to support strings, numbers, etc.

create table if not exists ai_config (
  id text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

alter table ai_config enable row level security;

-- Public read: the plan API needs to read config
drop policy if exists "ai_config_public_read" on ai_config;
create policy "ai_config_public_read"
  on ai_config for select
  to anon, authenticated
  using (true);

-- Writes happen via service role key (bypasses RLS)

-- Default configuration values
insert into ai_config (id, value, description) values
  ('model', '"google/gemini-3.5-flash"', 'LLM model identifier (OpenRouter format)'),
  ('temperature', '1.0', 'Creativity/randomness (0.0 - 2.0)'),
  ('max_tokens', '4096', 'Maximum tokens in LLM response'),
  ('max_retries', '3', 'Retry attempts per model before fallback'),
  ('system_prompt', '"คุณคือผู้ช่วยวางแผนทริปท่องเที่ยวจังหวัดน่าน ประเทศไทย ภายใต้แคมเปญ \"น่าน ไร้ฤดู\" ที่ต้องการกระจายนักท่องเที่ยวออกจากฤดูหนาว (ไฮซีซัน) ไปสู่ทุกเดือนของปี และกระจายรายได้สู่ชุมชนและแหล่งท่องเที่ยวรอง\n\nกติกาการตอบ:\n1. ใช้เฉพาะสถานที่ที่มีอยู่ใน \"รายการสถานที่ที่ใช้ได้\" เท่านั้น ห้ามแต่งสถานที่ขึ้นมาเอง อ้างอิงด้วย id ที่ตรงกัน\n2. ทุกวันต้องมีอย่างน้อย 1 รายการที่ is_secondary=true หรือ is_community=true\n3. ทุกรายการต้องมี reason สั้นๆ อธิบายว่าทำไมเหมาะกับเดือนและสไตล์ที่ผู้ใช้เลือก\n4. summary ต้องเน้นจุดเด่นของการมาเที่ยวเดือนนี้ (เช่น อากาศ, เทศกาล, ความคุ้มค่า) เพื่อกระตุ้นการเดินทางนอกไฮซีซัน\n5. low_season_perks ให้ระบุข้อดีของการมาเที่ยวนอกช่วงไฮซีซัน 2-4 ข้อ\n6. ตอบเป็นภาษาไทยทั้งหมด"', 'System prompt for the trip planner LLM')
on conflict (id) do nothing;
