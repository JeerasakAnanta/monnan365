import type { Metadata } from "next";
import Link from "next/link";
import { NanIcon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "มนต์น่าน 365 วัน",
  description:
    "รู้จักจังหวัดน่าน — ธรรมชาติ วัฒนธรรมไทลื้อ บ่อเกลือโบราณ วัดภูมินทร์ และเสน่ห์ที่ซ่อนอยู่ของน่าน",
};

const ATTRACTIONS = [
  {
    icon: "mountain" as IconName,
    name: "ดอยภูคา",
    category: "ธรรมชาติ",
    desc: "ยอดดอยสูง 1,980 เมตร ปกคลุมด้วยป่าดิบชื้น เป็นที่อยู่ของชมพูภูคา ดอกไม้หายากที่พบในน่านเท่านั้น ทะเลหมอกยามเช้าสวยงามที่สุดแห่งหนึ่งของภาคเหนือ",
    best: "พ.ย. – ก.พ.",
    color: "var(--nan-forest)",
    light: "var(--nan-sprout)",
  },
  {
    icon: "temple" as IconName,
    name: "วัดภูมินทร์",
    category: "วัฒนธรรม",
    desc: "วัดเอกลักษณ์สถาปัตยกรรมล้านช้างที่มีอายุกว่า 400 ปี มีภาพจิตรกรรมฝาผนัง \"กระซิบรัก\" อันลือชื่อ สัญลักษณ์ของเมืองน่าน",
    best: "ตลอดปี",
    color: "var(--nan-earth)",
    light: "var(--nan-wheat)",
  },
  {
    icon: "salt" as IconName,
    name: "บ่อเกลือสินธุ์",
    category: "วิถีชีวิต",
    desc: "บ่อเกลือโบราณที่เดียวในประเทศไทย มีอายุมากกว่า 1,000 ปี ชาวบ้านยังต้มเกลือจากน้ำเกลือใต้ดินด้วยวิธีดั้งเดิม น่าทึ่งและหาดูที่ไหนไม่ได้",
    best: "พ.ย. – เม.ย.",
    color: "var(--nan-river)",
    light: "#E0F7F5",
  },
  {
    icon: "bamboo" as IconName,
    name: "บ้านหนองบัว (ไทลื้อ)",
    category: "ชุมชน",
    desc: "หมู่บ้านชุมชนไทลื้อที่ยังคงวิถีชีวิตดั้งเดิม ทอผ้าลายโบราณ เต้นฟ้อนเล็บ และสถาปัตยกรรมบ้านไม้เก่าแก่",
    best: "ตลอดปี",
    color: "var(--nan-gold)",
    light: "var(--nan-wheat)",
  },
  {
    icon: "waves" as IconName,
    name: "แม่น้ำน่าน",
    category: "ธรรมชาติ",
    desc: "ต้นกำเนิดแม่น้ำเจ้าพระยา ล่องแพชมทิวทัศน์สองฝั่ง ปลาหลากชนิด วิถีประมงพื้นบ้าน และบรรยากาศสงบงาม",
    best: "ส.ค. – ต.ค.",
    color: "var(--nan-sky)",
    light: "#E0F7F5",
  },
  {
    icon: "rice" as IconName,
    name: "นาขั้นบันได น้ำเลา",
    category: "ธรรมชาติ",
    desc: "นาขั้นบันไดสีทองงดงามยามข้าวสุก ถ่ายภาพได้ทุกฤดู — เขียวช่วงดำนา ทองช่วงเก็บเกี่ยว ว่างเปล่าช่วงพักหน้าแล้ง",
    best: "ก.ย. – พ.ย.",
    color: "var(--nan-leaf)",
    light: "var(--nan-sprout)",
  },
];

const QUICK_FACTS: { icon: IconName; label: string; value: string }[] = [
  { icon: "ruler", label: "พื้นที่", value: "11,472 ตร.กม." },
  { icon: "thermometer", label: "อุณหภูมิเฉลี่ย", value: "24°C" },
  { icon: "leaf", label: "พื้นที่ป่า", value: "80% ของพื้นที่" },
  { icon: "mountain", label: "ยอดเขาสูงสุด", value: "2,079 ม. (ดอยผากลอง)" },
  { icon: "temple", label: "วัดโบราณ", value: "มากกว่า 200 วัด" },
  { icon: "car", label: "ระยะจากกรุงเทพ", value: "668 กม." },
];

const HISTORY_ICONS: IconName[] = ["castle", "temple", "scroll"];

export default function AboutNanPage() {
  return (
    <>
      {/* Page Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--nan-forest) 0%, var(--nan-leaf) 60%, var(--nan-sky) 100%)",
          padding: "5rem 1.5rem 7rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(233,196,106,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(78,205,196,0.2) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: "99px",
              padding: "0.4rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.08em",
              marginBottom: "1.5rem",
            }}
          >
            <NanIcon name="leaf" size={12} /> แนะนำจังหวัดน่าน
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#fff",
              marginBottom: "1.25rem",
              textShadow: "0 2px 16px rgba(30,70,50,0.3)",
            }}
          >
            รู้จักน่าน
            <br></br>
            {" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--nan-amber), #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              เมืองที่ ธรรมชาติยังสมบูรณ์
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: "1.075rem",
              lineHeight: 1.9,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            จังหวัดทางภาคเหนือตอนบน ที่ยังคงความดั้งเดิม ไว้ได้มากที่สุด
            <br></br>
            ป่าไม้ 80% วัฒนธรรมไทลื้อ บ่อเกลือพันปี และวัดโบราณอีกนับร้อย
          </p>
        </div>

        {/* Bottom Wave */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "80px", display: "block", fill: "var(--nan-cream)" }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Quick Facts */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--nan-cream)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "var(--nan-bark)",
              }}
            >
              ข้อมูลทั่วไป
            </h2>
            <div className="section-divider" style={{ margin: "0.75rem auto 0" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {QUICK_FACTS.map((f) => (
              <div
                key={f.label}
                className="glass-card"
                style={{ padding: "1.5rem", textAlign: "center" }}
              >
                <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}><NanIcon name={f.icon} size={14} /></div>
                <div style={{ fontSize: "0.75rem", color: "var(--nan-stone)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                  {f.label}
                </div>
                <div style={{ fontSize: "1.1rem", color: "var(--nan-bark)", fontWeight: 700 }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "linear-gradient(180deg, var(--nan-cream) 0%, var(--nan-linen) 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="history-grid"
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--nan-wheat)",
                color: "var(--nan-earth)",
                borderRadius: "99px",
                padding: "0.35rem 1rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                marginBottom: "1rem",
              }}
            >
              <NanIcon name="scroll" size={12} /> ประวัติ
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "var(--nan-bark)",
                lineHeight: 1.3,
              }}
            >
              อาณาจักรน่านกว่า 700 ปี
            </h2>
            <div className="section-divider" />
          </div>
          <div>
            {[
              {
                period: "พ.ศ. 1825",
                event: "ก่อตั้งเมืองน่าน",
                desc: "พ่อขุนผาเมือง (เจ้าขุนฤๅชัย) สร้างเมืองน่านขึ้นบนที่ราบลุ่มแม่น้ำน่านตอนบน เป็นจุดเริ่มต้นของอาณาจักรที่ยืนยาวกว่า 700 ปี",
              },
              {
                period: "พ.ศ. 1994",
                event: "รับพระพุทธศาสนาลังกาวงศ์",
                desc: "วัดสำคัญหลายแห่งถูกสร้างขึ้นในยุคนี้ รวมถึงวัดภูมินทร์ที่กลายเป็นสัญลักษณ์ของน่าน",
              },
              {
                period: "พ.ศ. 2445",
                event: "รวมเข้าราชอาณาจักรสยาม",
                desc: "ในสมัย ร.5 น่านถูกผนวกเข้าเป็นส่วนหนึ่งของสยาม แต่ยังคงรักษาเอกลักษณ์วัฒนธรรมท้องถิ่นได้อย่างสมบูรณ์",
              },
            ].map((item, i) => (
              <div
                key={item.period}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  marginBottom: "2rem",
                  paddingBottom: i < 2 ? "2rem" : 0,
                  borderBottom: i < 2 ? "1px solid var(--nan-smoke)" : "none",
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <NanIcon name={HISTORY_ICONS[i]} size={12} color="#fff" />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--nan-leaf)", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {item.period}
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--nan-bark)", marginBottom: "0.375rem", fontSize: "1rem" }}>
                    {item.event}
                  </div>
                  <p style={{ color: "var(--nan-stone)", fontSize: "0.9rem", lineHeight: 1.8 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .history-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          }
        `}</style>
      </section>

      {/* Attractions Grid */}
      <section style={{ padding: "4rem 1.5rem 5rem", background: "var(--nan-cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--nan-sprout)",
                color: "var(--nan-forest)",
                borderRadius: "99px",
                padding: "0.35rem 1.1rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              <NanIcon name="map" size={12} /> สถานที่ไฮไลต์
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                color: "var(--nan-bark)",
              }}
            >
              สถานที่ท่องเที่ยว ไม่ควรพลาดเมื่อมาน่าน
            </h2>
            <div className="section-divider" style={{ margin: "0.75rem auto 0" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {ATTRACTIONS.map((a) => (
              <div
                key={a.name}
                className="glass-card"
                style={{ padding: "1.75rem", borderLeft: `4px solid ${a.color}` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "0.875rem",
                      background: a.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <NanIcon name={a.icon} size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: a.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {a.category}
                    </div>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--nan-bark)", marginTop: "0.1rem" }}>
                      {a.name}
                    </h3>
                  </div>
                </div>
                <p style={{ color: "var(--nan-stone)", lineHeight: 1.85, fontSize: "0.9rem" }}>
                  {a.desc}
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: a.light,
                    color: a.color,
                    borderRadius: "99px",
                    padding: "0.3rem 0.875rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  <NanIcon name="calendar" size={12} /> ช่วงเวลาดีที่สุด: {a.best}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to AI Planner */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "linear-gradient(135deg, var(--nan-forest) 0%, var(--nan-river) 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            ให้ AI ช่วยวางแผนทริปน่านให้คุณ
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2rem" }}>
            บอกเดือนและสไตล์ที่ชอบ AI จะแนะนำสถานที่และกิจกรรมที่เหมาะกับคุณที่สุด
          </p>
          <Link
            href="/plan"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--nan-amber)",
              color: "var(--nan-bark)",
              boxShadow: "0 4px 20px rgba(233,196,106,0.4)",
              fontSize: "1.05rem",
              padding: "0.9rem 2.5rem",
              borderRadius: "99px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <NanIcon name="sparkles" size={12} /> เริ่มวางแผนทริปเลย
          </Link>
        </div>
      </section>
    </>
  );
}
