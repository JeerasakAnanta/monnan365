"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PitchDeck.module.css";

const {
  deck,
  slide,
  ["slide-cover"]: slideCover,
  active,
  tagline,
  meta,
  ["demo-link"]: demoLink,
  ["highlight-box"]: highlightBox,
  ["card-grid"]: cardGrid,
  card,
  gold,
  sky,
  badge,
  ["badge-green"]: badgeGreen,
  ["badge-gold"]: badgeGold,
  ["badge-sky"]: badgeSky,
  steps,
  ["flow-diagram"]: flowDiagram,
  ["flow-node"]: flowNode,
  ["flow-io"]: flowIo,
  ["flow-output"]: flowOutput,
  ["flow-process"]: flowProcess,
  ["flow-process-title"]: flowProcessTitle,
  ["flow-substeps"]: flowSubsteps,
  ["flow-substep-note"]: flowSubstepNote,
  ["flow-arrow"]: flowArrow,
  ["metric-row"]: metricRow,
  metric,
  num,
  label,
  timeline,
  ["timeline-item"]: timelineItem,
  time,
  desc,
  ["nav-bar"]: navBar,
  counter,
  ["speaker-note"]: speakerNoteClass,
  visible,
  ["pitch-root"]: pitchRoot,
} = styles;

function cx(...names: Array<string | false | undefined | null>) {
  return names.filter(Boolean).join(" ");
}

const SLIDE_COUNT = 11;

const SPEAKER_NOTES = [
  "เปิดด้วย tagline ให้ชัดใน 10 วินาทีแรก — มีเวลาจำกัดมาก ขึ้นลำดับที่ 2 จาก 7 ทีม",
  "เชื่อมกับ mission ของ hackathon ทันที: 'กระจายมูลค่าการท่องเที่ยวน่านให้ครอบคลุมตลอด 12 เดือน'",
  "อย่าสับสนกลุ่มผู้เข้าร่วม hackathon กับ end-user ของโปรดักต์ — สองกลุ่มนี้คนละกลุ่ม",
  "ใช้ตัวอย่างจาก dataset จริง (วัดภูมินทร์, ดอยภูคา) เพื่อให้กรรมการเห็นว่าข้อมูลจริงไม่ใช่สมมติ",
  "เน้นว่า quota 35% ไม่ใช่แค่ prompt engineering — บังคับใน business logic ก่อนส่งเข้า LLM",
  "ได้เวลามากกว่าสไลด์อื่น ~2 นาที — ให้กรรมการเห็น badge ชุมชน/แหล่งท่องเที่ยวรองชัดๆ",
  "Quota 35% บังคับใน logic ก่อนส่งเข้า LLM — ตอบโจทย์ 'การใช้ AI' และ 'ความเข้าใจชุมชน' พร้อมกัน",
  "ยอมรับตรงๆ ว่ายังไม่มี usage data — แต่โชว์กลไกที่ 'การันตี' ผลลัพธ์ได้แม้ยังไม่มีผู้ใช้จริง",
  "Production app จริง ไม่ใช่ mockup — ต่อยอดเกิน MVP ไปแล้วหลายฟีเจอร์",
  "ให้ due date/priority จริงก่อนใช้บนสไลด์ — ปัจจุบันยังเป็นร่างจาก README",
];

export function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [noteVisible, setNoteVisible] = useState(false);
  const touchStartX = useRef(0);

  const goTo = useCallback((n: number) => {
    setCurrent(Math.max(0, Math.min(n, SLIDE_COUNT - 1)));
  }, []);
  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDE_COUNT - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "s" || e.key === "S") {
        setNoteVisible((v) => !v);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDE_COUNT - 1);
      }
    }
    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev, goTo]);

  const slideClass = (index: number, extra?: string) => cx(slide, extra, index === current && active);

  return (
    <div className={pitchRoot}>
      <div className={deck}>
        {/* ============================== SLIDE 1: COVER ============================== */}
        <div className={slideClass(0, slideCover)}>
          <h1>มนต์น่าน 365</h1>
          <div className={tagline}>AI Trip Planner &amp; Concierge เที่ยวน่านได้ทุกฤดู</div>
          <div className={meta}>
            Nan Beyond Seasons Challenge 2026 — Track 1: AI Trip Planner &amp; Concierge
            <br />
            ทีม: Jeerasak — Design, Development &amp; Data Curation
          </div>
          <a className={demoLink} href="https://monnan.jeerasakananta.dev/" target="_blank" rel="noreferrer">
            🔗 Live Demo
          </a>
        </div>

        {/* ============================== SLIDE 2: PROBLEM ============================== */}
        <div className={slideClass(1)}>
          <h2>ปัญหา (Problem)</h2>
          <div className={highlightBox}>การท่องเที่ยวจังหวัดน่านกระจุกตัวอยู่ในช่วงฤดูหนาวเพียงไม่กี่เดือน</div>
          <div className={cardGrid}>
            <div className={card}>
              <h4>💰 รายได้ขาดช่วง</h4>
              <p>ผู้ประกอบการและชุมชนขาดรายได้ในฤดูอื่น — 8-9 เดือนต่อปีไม่มีนักท่องเที่ยวหลัก</p>
            </div>
            <div className={cx(card, gold)}>
              <h4>🏘️ ชุมชนรองไม่เป็นที่รู้จัก</h4>
              <p>แหล่งท่องเที่ยวรองและวิสาหกิจชุมชนมีคุณค่าตลอด 12 เดือน แต่ไม่มีใครรู้จัก</p>
            </div>
            <div className={cx(card, sky)}>
              <h4>❓ นักท่องเที่ยวไม่รู้</h4>
              <p>เห็นแต่คอนเทนต์ &quot;น่านหน้าหนาว&quot; ซ้ำๆ ไม่รู้ว่านอกฤดูหนาว น่านมีอะไร</p>
            </div>
          </div>
          <p style={{ marginTop: "1em", color: "var(--nan-muted)", fontSize: "0.9rem" }}>
            ทั้งที่ทุกเดือนมีเทศกาล วัฒนธรรม อาหาร และธรรมชาติเฉพาะฤดู
          </p>
        </div>

        {/* ============================== SLIDE 3: PERSONA ============================== */}
        <div className={slideClass(2)}>
          <h2>User / Persona</h2>
          <div className={cardGrid}>
            <div className={card}>
              <h4>🧑‍💼 ผู้ใช้หลัก: นักท่องเที่ยวไทย</h4>
              <ul>
                <li>วางแผนเดินทางไปน่าน แต่ไม่รู้ว่านอกฤดูหนาวมีอะไร</li>
                <li>เห็นแต่คอนเทนต์ &quot;น่านหน้าหนาว&quot; ซ้ำๆ</li>
                <li>ไม่รู้จักแหล่งท่องเที่ยวรอง</li>
                <li>ไม่มั่นใจว่าเดือนอื่นคุ้มค่าเดินทางไหม</li>
              </ul>
            </div>
            <div className={cx(card, gold)}>
              <h4>🏡 ผู้ได้ประโยชน์รอง: ชุมชนท้องถิ่น</h4>
              <ul>
                <li>ผู้ประกอบการท้องถิ่น</li>
                <li>วิสาหกิจชุมชน</li>
                <li>โฮมสเตย์</li>
                <li>ต้องการช่องทางให้นักท่องเที่ยวมองเห็นตลอดทั้งปี</li>
              </ul>
            </div>
          </div>
          <div className={highlightBox} style={{ marginTop: "1em" }}>
            <strong>Pain point หลัก:</strong> ไม่มีเครื่องมือที่ช่วย &quot;ขาย&quot;
            จุดเด่นของทุกฤดูให้นักท่องเที่ยวเห็นว่าน่านน่าเที่ยวได้ทั้งปี
          </div>
        </div>

        {/* ============================== SLIDE 4: INSIGHT ============================== */}
        <div className={slideClass(3)}>
          <h2>Insight</h2>
          <p style={{ marginBottom: "0.8em" }}>ทำไมปัญหานี้สำคัญต่อ 12 เดือนของน่าน — เชื่อมกับเป้าหมายหลักของโจทย์:</p>
          <table>
            <tbody>
              <tr>
                <th>เป้าหมายโจทย์ (น่าน ไร้ฤดู)</th>
                <th>Insight</th>
              </tr>
              <tr>
                <td>
                  <strong>กระจายมูลค่าสู่ท้องถิ่น</strong>
                </td>
                <td>รายได้กระจุกตัวฤดูหนาว = ชุมชนรองไม่ได้ประโยชน์เลยตลอด 8-9 เดือน</td>
              </tr>
              <tr>
                <td>
                  <strong>การลงมือทำด้วยเทคโนโลยี</strong>
                </td>
                <td>ต้องใช้ AI/Design Thinking แก้ปัญหานี้แบบวัดผลได้ ไม่ใช่แค่แคมเปญประชาสัมพันธ์</td>
              </tr>
              <tr>
                <td>
                  <strong>สร้างความน่าสนใจตลอด 12 เดือน</strong>
                </td>
                <td>น่านมีของดีทุกเดือนอยู่แล้ว แค่ไม่มีใครสื่อสารให้นักท่องเที่ยวเห็น</td>
              </tr>
              <tr>
                <td>
                  <strong>พัฒนาด้วย Design Thinking</strong>
                </td>
                <td>ต้นแบบต้องใช้งานได้จริงในชุมชนท้องถิ่น ไม่ใช่แค่ demo สวย</td>
              </tr>
            </tbody>
          </table>
          <div className={cardGrid} style={{ marginTop: "1em" }}>
            <div className={card}>
              <h4>ตัวอย่าง: วัดภูมินทร์</h4>
              <p>
                <code>season_note: &quot;ชมได้ทั้งปี ฝนตกก็เที่ยวได้&quot;</code>
                <br />
                → underused นอกฤดูหนาว ทั้งที่เที่ยวได้ทุกฤดู
              </p>
            </div>
            <div className={cx(card, gold)}>
              <h4>ตัวอย่าง: ดอยภูคา</h4>
              <p>
                <code>season_note: &quot;ดอกนางพญาเสือโคร่งบาน ม.ค.&quot;</code>
                <br />
                → high-season draw ที่ดึงคนไปกระจุกแค่เดือนเดียว
              </p>
            </div>
          </div>
        </div>

        {/* ============================== SLIDE 5: SOLUTION ============================== */}
        <div className={slideClass(4)}>
          <h2>Solution</h2>
          <div className={highlightBox} style={{ fontStyle: "normal", fontSize: "1.1em" }}>
            <strong>MonNan365</strong> คือ AI Trip Planner ที่วางแผนเที่ยวน่านตามเดือนที่ผู้ใช้จะเดินทางจริง —
            ไม่ใช่แนะนำแต่ที่ยอดนิยมหน้าหนาว
          </div>
          <p style={{ margin: "0.8em 0" }}>
            <strong>ผู้ใช้เลือก:</strong> เดือนเดินทาง · จำนวนวัน (1–5) · สไตล์ (ธรรมชาติ, วัฒนธรรม, อาหาร, Wellness) ·
            งบประมาณ
          </p>
          <h3>กลไก 3 ข้อที่ทำให้ต่างจาก trip planner ทั่วไป</h3>
          <div className={cardGrid}>
            <div className={card}>
              <h4>🌿 ขายจุดเด่นของฤดูนั้น</h4>
              <p>Green Season มีนาข้าวเขียว หมอกหน้าฝน ที่พักถูกกว่า คนน้อยกว่า</p>
            </div>
            <div className={cx(card, gold)}>
              <h4>🏘️ บังคับกระจายสู่ชุมชน</h4>
              <p>
                ทุกแผนมีแหล่งท่องเที่ยวรอง/วิสาหกิจชุมชนอย่างน้อย <strong>~35%</strong> พร้อมช่องทางติดต่อจริง
              </p>
            </div>
            <div className={cx(card, sky)}>
              <h4>🤖 AI อธิบายเหตุผล</h4>
              <p>ทุกจุดหมายมีคำอธิบายว่าทำไมเหมาะกับเดือนและสไตล์ของผู้ใช้</p>
            </div>
          </div>
          <table style={{ marginTop: "1em" }}>
            <tbody>
              <tr>
                <th>เป้าหมายโจทย์</th>
                <th>สิ่งที่ MonNan365 ทำ</th>
              </tr>
              <tr>
                <td>กระจายนักท่องเที่ยวออกจากฤดูหนาว</td>
                <td>Planner เชิงรุกที่ชูจุดเด่นของ Low/Green Season</td>
              </tr>
              <tr>
                <td>กระจายรายได้สู่ชุมชนรอง</td>
                <td>Quota แหล่งท่องเที่ยวรอง + ข้อมูลติดต่อวิสาหกิจชุมชน</td>
              </tr>
              <tr>
                <td>เพิ่มเวลาพำนักและกิจกรรม</td>
                <td>แผนรายวันหลายวัน ผสมกิจกรรมหลากประเภท</td>
              </tr>
              <tr>
                <td>ยกระดับดิจิทัลท้องถิ่น</td>
                <td>โครงสร้างข้อมูลเปิด (JSON) ที่ชุมชนต่อยอดเพิ่มรายการเองได้</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============================== SLIDE 6: DEMO FLOW ============================== */}
        <div className={slideClass(5)}>
          <h2>Demo Flow</h2>
          <div className={cardGrid}>
            <div className={card} style={{ gridColumn: "1 / -1" }}>
              <h4>Flow 1 — สร้างแผนเที่ยวเดือน Green Season</h4>
              <ol className={steps}>
                <li>
                  <strong>เลือกพารามิเตอร์:</strong> เดือน: สิงหาคม / จำนวนวัน: 2-3 / สไตล์: ธรรมชาติ+วัฒนธรรม / งบ:
                  กลาง
                </li>
                <li>
                  <strong>กดวางแผน</strong> → เห็นสรุป &quot;ทำไมเดือนนี้ถึงน่าไปน่าน&quot; +{" "}
                  <code>low_season_perks</code>
                </li>
                <li>
                  <strong>Timeline card รายวัน</strong> — badge <span className={cx(badge, badgeGreen)}>Low Season</span>{" "}
                  <span className={cx(badge, badgeGold)}>ชุมชน-แหล่งท่องเที่ยวรอง</span>{" "}
                  บนแต่ละจุดหมาย พร้อมเหตุผลที่ AI อธิบาย
                </li>
                <li>
                  <strong>เปิดแผนที่ Leaflet</strong> ดูตำแหน่งจริงของทุกจุดหมาย
                </li>
              </ol>
            </div>
          </div>
          <div className={cx(card, gold)} style={{ marginTop: "0.8em" }}>
            <h4>Flow 2 (ถ้าเวลาเหลือ) — Share / Print</h4>
            <p>กด Share → ได้ลิงก์แชร์แผนทริป (บันทึกลง Supabase) หรือ Print → PDF export พร้อม branding</p>
          </div>
          <div style={{ marginTop: "1em" }}>
            <span className={cx(badge, badgeGreen)}>Low Season</span>{" "}
            <span className={cx(badge, badgeGold)}>ชุมชน-แหล่งท่องเที่ยวรอง</span>{" "}
            <span className={cx(badge, badgeSky)}>AI Reason</span>
            <span style={{ fontSize: "0.85rem", color: "var(--nan-muted)", marginLeft: "8px" }}>
              ← ตัวอย่าง badge ที่แสดงบน UI จริง
            </span>
          </div>
        </div>

        {/* ============================== SLIDE 7: AI / DATA ============================== */}
        <div className={slideClass(6)}>
          <h2>AI / Data — RAG-lite Architecture</h2>
          <p style={{ marginBottom: "0.5em" }}>LLM ไม่เคยแต่งสถานที่เอง — เลือกและอธิบายได้เฉพาะจาก dataset ที่ตรวจสอบแล้วเท่านั้น</p>
          <div className={flowDiagram}>
            <div className={cx(flowNode, flowIo)}>User Input (เดือน, จำนวนวัน, สไตล์, งบ)</div>
            <div className={flowArrow} aria-hidden="true" />
            <div className={cx(flowNode, flowProcess)}>
              <div className={flowProcessTitle}>
                /api/plan <span>(Next.js API Route)</span>
              </div>
              <ol className={flowSubsteps}>
                <li>
                  <strong>Supabase query</strong> — attractions ที่ months_best ครอบคลุมเดือนที่เลือก
                </li>
                <li>
                  <strong>selectAttractions()</strong> — กรองตามสไตล์ + บังคับ quota ชุมชน ≥35% + สุ่ม (Fisher-Yates)
                </li>
                <li>
                  <strong>เรียก OpenRouter API</strong> พร้อม zodResponseFormat (structured output)
                  <span className={flowSubstepNote}>
                    System prompt (ไทย, anti-hallucination): ใช้เฉพาะสถานที่ใน dataset อ้างอิงด้วย id ตรงตัว,
                    ทุกวันต้องมีแหล่งท่องเที่ยวรอง/ชุมชน ≥1 แห่ง
                  </span>
                </li>
                <li>
                  <strong>Enrich</strong> — map ID ที่ AI เลือกกลับเป็นข้อมูลสถานที่เต็ม
                </li>
              </ol>
            </div>
            <div className={flowArrow} aria-hidden="true" />
            <div className={cx(flowNode, flowIo, flowOutput)}>Timeline cards + แผนที่ Leaflet</div>
          </div>
          <div className={cardGrid} style={{ marginTop: "1em" }}>
            <div className={card}>
              <h4>โมเดล AI</h4>
              <p>
                <strong>google/gemini-3.5-flash</strong> ผ่าน OpenRouter
              </p>
            </div>
            <div className={cx(card, gold)}>
              <h4>Validation</h4>
              <p>Zod + Structured Outputs — บังคับ schema ระดับ API</p>
            </div>
            <div className={cx(card, sky)}>
              <h4>Retry</h4>
              <p>สูงสุด 3 ครั้ง, exponential backoff (1s, 2s, 3s)</p>
            </div>
          </div>
          <div className={metricRow} style={{ marginTop: "1em" }}>
            <div className={metric}>
              <div className={num}>40</div>
              <div className={label}>รายการคัดสรร</div>
            </div>
            <div className={metric}>
              <div className={num}>10</div>
              <div className={label}>อำเภอ</div>
            </div>
            <div className={metric}>
              <div className={num}>12</div>
              <div className={label}>เดือนครอบคลุม</div>
            </div>
            <div className={metric}>
              <div className={num}>31</div>
              <div className={label}>แหล่งท่องเที่ยวรอง</div>
            </div>
            <div className={metric}>
              <div className={num}>21</div>
              <div className={label}>วิสาหกิจชุมชน</div>
            </div>
          </div>
          <p style={{ marginTop: "0.8em", fontSize: "0.9rem", color: "var(--nan-muted)" }}>
            <strong>Selection algorithm</strong> (<code>selectAttractions.ts</code>): แบ่ง pool หลัก/รอง →
            บังคับสัดส่วนขั้นต่ำ 35% จาก pool รอง/ชุมชน → สุ่มแบบ Fisher-Yates → ผสานผลลัพธ์
          </p>
        </div>

        {/* ============================== SLIDE 8: IMPACT ============================== */}
        <div className={slideClass(7)}>
          <h2>Impact &amp; Metrics</h2>
          <div className={highlightBox} style={{ fontStyle: "normal" }}>
            ผลิตภัณฑ์เพิ่งเปิดใช้งานสำหรับ hackathon นี้ — ยังไม่มีตัวเลขการใช้งานจริง (usage data) ณ ตอนนี้ สไลด์นี้เน้น{" "}
            <strong>กลไกที่ออกแบบไว้เพื่อการันตีผลลัพธ์</strong>
          </div>
          <h3>กลไกที่วัดผลได้จริงในตัวโปรดักต์</h3>
          <div className={cardGrid}>
            <div className={card}>
              <h4>📊 35% Quota ถูกบังคับใน Logic</h4>
              <p>ทุกแผนที่สร้างขึ้นมีแหล่งท่องเที่ยวรอง/ชุมชน ≥35% — วัดได้ 100% ของ output</p>
            </div>
            <div className={cx(card, gold)}>
              <h4>🏷️ Badge Traceable</h4>
              <p>แต่ละ badge &quot;Low Season&quot; / &quot;ชุมชน-แหล่งท่องเที่ยวรอง&quot; บน UI คือหลักฐานเชิง traceable</p>
            </div>
          </div>
          <h3>เทียบกับตัวชี้วัดจากผู้จัดงาน</h3>
          <table>
            <tbody>
              <tr>
                <th>ตัวชี้วัดจากโจทย์</th>
                <th>สถานะของ MonNan365</th>
              </tr>
              <tr>
                <td>ปริมาณทริปช่วง Low Season</td>
                <td>กลไก quota รองรับแล้ว แต่ยังไม่มีข้อมูลการใช้งานจริง</td>
              </tr>
              <tr>
                <td>กระจายเงินสู่ชุมชนรอง</td>
                <td>มี contact จริงของวิสาหกิจชุมชนแนบทุกแผน — ยังไม่มี conversion จริง</td>
              </tr>
              <tr>
                <td>เพิ่มเวลาพำนัก &amp; กิจกรรม</td>
                <td>รองรับแผนได้สูงสุด 5 วัน หลายกิจกรรมต่อวัน</td>
              </tr>
              <tr>
                <td>ยกระดับดิจิทัลท้องถิ่น</td>
                <td>โครงสร้างข้อมูลเปิด (JSON) ให้ชุมชนต่อยอดเองได้</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============================== SLIDE 9: FEASIBILITY ============================== */}
        <div className={slideClass(8)}>
          <h2>Feasibility</h2>
          <div className={cardGrid}>
            <div className={card}>
              <h4>✅ สิ่งที่ทำสำเร็จแล้ว</h4>
              <ul>
                <li>Production app ใช้งานได้จริง — ไม่ใช่แค่ prototype/mockup</li>
                <li>ต่อยอดเกิน MVP: ระบบ share + print แผนทริป, PDF export, Google Maps link, NanIcon, Admin panel</li>
                <li>Deploy pipeline อัตโนมัติเต็มรูปแบบ (CI/CD ผ่าน GitHub Actions)</li>
              </ul>
            </div>
            <div className={cx(card, gold)}>
              <h4>🚀 สิ่งที่ต้องใช้เพิ่มเพื่อไปต่อ</h4>
              <ul>
                <li>
                  <strong>Partner:</strong> ททท. น่าน / สำนักงานการท่องเที่ยวจังหวัด — ขยาย dataset เกิน 40 รายการ
                </li>
                <li>
                  <strong>Budget:</strong> ค่า LLM API ต่อเดือนที่ scale ขึ้น, ค่า hosting เพิ่มเติม
                </li>
                <li>
                  <strong>Operation:</strong> ทีมดูแล/อัปเดตข้อมูล attractions ต่อเนื่อง (admin panel รองรับแล้ว)
                </li>
              </ul>
            </div>
          </div>
          <div className={metricRow} style={{ marginTop: "1em" }}>
            <div className={metric}>
              <div className={num}>40+</div>
              <div className={label}>Dataset ปัจจุบัน</div>
            </div>
            <div className={metric}>
              <div className={num}>10</div>
              <div className={label}>อำเภอครอบคลุม</div>
            </div>
            <div className={metric}>
              <div className={num}>15</div>
              <div className={label}>Components</div>
            </div>
            <div className={metric}>
              <div className={num}>6</div>
              <div className={label}>SQL Migrations</div>
            </div>
          </div>
        </div>

        {/* ============================== SLIDE 10: NEXT STEP ============================== */}
        <div className={slideClass(9)}>
          <h2>Next Step — แผนต่อยอด 30-90 วัน</h2>
          <div className={timeline}>
            <div className={timelineItem}>
              <div className={time}>0–30 วัน</div>
              <div className={desc}>
                เปิดฟอร์มให้ชุมชน/ผู้ประกอบการเพิ่มรายการของตนเอง
                <br />
                (ขยาย dataset โดยไม่ต้องรอ partner ทางการ)
              </div>
            </div>
            <div className={timelineItem}>
              <div className={time}>30–60 วัน</div>
              <div className={desc}>เชื่อม TAT Data API + พยากรณ์อากาศ real-time เข้ากับ planner</div>
            </div>
            <div className={timelineItem}>
              <div className={time}>60–90 วัน</div>
              <div className={desc}>เปิดระบบ feedback จากนักท่องเที่ยว + เริ่มรองรับภาษาอังกฤษ</div>
            </div>
          </div>
          <div className={cardGrid} style={{ marginTop: "1.5em" }}>
            <div className={cx(card, sky)}>
              <h4>📋 แผนต่อยอดทั้งหมด (จาก README)</h4>
              <ul>
                <li>เชื่อม TAT Data API แบบ real-time และข้อมูลพยากรณ์อากาศ</li>
                <li>ให้ชุมชน/ผู้ประกอบการเพิ่มรายการของตนเองผ่านฟอร์ม (community-sourced data)</li>
                <li>ระบบ feedback จากนักท่องเที่ยวเพื่อปรับปรุงคำแนะนำ</li>
                <li>รองรับภาษาอังกฤษและจีนสำหรับนักท่องเที่ยวต่างชาติ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============================== APPENDIX: FACT SHEET ============================== */}
        <div className={slideClass(10)} style={{ paddingTop: "3vh" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Fact Sheet — ภาคผนวก</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1rem" }}>Tech Stack</h3>
              <table style={{ fontSize: "0.8rem" }}>
                <tbody>
                  <tr>
                    <th>Layer</th>
                    <th>เทคโนโลยี</th>
                  </tr>
                  <tr>
                    <td>Framework</td>
                    <td>Next.js 16 (App Router)</td>
                  </tr>
                  <tr>
                    <td>UI</td>
                    <td>React 19 + Tailwind CSS 4</td>
                  </tr>
                  <tr>
                    <td>Database</td>
                    <td>Supabase (PostgreSQL)</td>
                  </tr>
                  <tr>
                    <td>LLM</td>
                    <td>google/gemini-3.5-flash (OpenRouter)</td>
                  </tr>
                  <tr>
                    <td>Validation</td>
                    <td>Zod + Structured Outputs</td>
                  </tr>
                  <tr>
                    <td>Maps</td>
                    <td>Leaflet + OpenStreetMap</td>
                  </tr>
                  <tr>
                    <td>Storage</td>
                    <td>Cloudflare R2</td>
                  </tr>
                  <tr>
                    <td>Deploy</td>
                    <td>Docker → VPS (GitHub Actions CI/CD)</td>
                  </tr>
                </tbody>
              </table>
              <h3 style={{ fontSize: "1rem", marginTop: "1em" }}>Q&amp;A Prep</h3>
              <ul style={{ fontSize: "0.8rem" }}>
                <li>
                  <strong>Responsible AI:</strong> ใช้เฉพาะ dataset ที่ตรวจสอบแล้ว กัน hallucination
                </li>
                <li>
                  <strong>ไม่มี login</strong> สำหรับผู้ใช้ทั่วไป
                </li>
                <li>
                  <strong>Accessibility:</strong> ปุ่มปรับขนาดตัวอักษร, รองรับมือถือ
                </li>
                <li>
                  <strong>MVP scope:</strong> ไม่มีจอง/ชำระเงิน, Thai-only
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className={navBar}>
        <button type="button" onClick={prev}>
          ← ก่อนหน้า
        </button>
        <span className={counter}>
          {current + 1} / {SLIDE_COUNT}
        </span>
        <button type="button" onClick={next}>
          ถัดไป →
        </button>
      </div>

      {/* SPEAKER NOTE */}
      <div className={cx(speakerNoteClass, noteVisible && visible)}>
        {SPEAKER_NOTES[current] ? (
          <>
            <strong>Speaker Note:</strong> {SPEAKER_NOTES[current]}
          </>
        ) : null}
      </div>
    </div>
  );
}
