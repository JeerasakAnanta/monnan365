"use client";

const SEASONS = [
  {
    month: "ม.ค. – ก.พ.",
    season: "ฤดูหนาว",
    emoji: "❄️",
    color: "var(--nan-sky)",
    lightColor: "#E0F7F5",
    highlights: ["ทะเลหมอกสวยงาม", "อากาศเย็น 8-18°C", "เทศกาลต้อนรับปีใหม่"],
  },
  {
    month: "มี.ค. – พ.ค.",
    season: "ฤดูร้อน",
    emoji: "☀️",
    color: "var(--nan-gold)",
    lightColor: "var(--nan-wheat)",
    highlights: ["ดอกไม้ป่าบาน", "เดินป่าสบาย", "นกอพยพหายาก"],
  },
  {
    month: "มิ.ย. – ส.ค.",
    season: "ต้นฝน",
    emoji: "🌧️",
    color: "var(--nan-river)",
    lightColor: "#E0F7F5",
    highlights: ["นาดำสีเขียวสด", "น้ำตกเต็มฝั่ง", "ธรรมชาติสดชื่น"],
  },
  {
    month: "ก.ย. – ต.ค.",
    season: "ปลายฝน",
    emoji: "🌿",
    color: "var(--nan-leaf)",
    lightColor: "var(--nan-sprout)",
    highlights: ["นาสีทอง", "หมอกหนาพิเศษ", "ถ่ายภาพสวย"],
  },
  {
    month: "พ.ย. – ธ.ค.",
    season: "ต้นหนาว",
    emoji: "🍂",
    color: "var(--nan-clay)",
    lightColor: "#F9EDE3",
    highlights: ["เทศกาลลอยกระทง", "ดอยภูคาสวยงาม", "เริ่มมีหมอก"],
  },
];

export function SeasonTimeline() {
  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(180deg, var(--nan-cream) 0%, var(--nan-linen) 100%)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "var(--nan-wheat)",
              color: "var(--nan-earth)",
              borderRadius: "99px",
              padding: "0.35rem 1.1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            📅 ฤดูกาลน่าน
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--nan-bark)",
              marginBottom: "0.75rem",
            }}
          >
            น่านสวยงามตลอด 12 เดือน
          </h2>
          <div className="section-divider" style={{ margin: "0 auto 1.25rem" }} />
          <p style={{ color: "var(--nan-stone)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.8 }}>
            ไม่ว่าจะเดินทางมาเดือนไหน น่านมีสิ่งพิเศษรอคุณอยู่เสมอ
          </p>
        </div>

        {/* Timeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {SEASONS.map((s) => (
            <div
              key={s.month}
              style={{
                background: "#fff",
                borderRadius: "1.25rem",
                padding: "1.5rem",
                border: `2px solid ${s.lightColor}`,
                boxShadow: "0 2px 20px rgba(45,106,79,0.06)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(45,106,79,0.12)";
                (e.currentTarget as HTMLDivElement).style.borderColor = s.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 20px rgba(45,106,79,0.06)";
                (e.currentTarget as HTMLDivElement).style.borderColor = s.lightColor;
              }}
            >
              {/* Icon + Season */}
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: s.lightColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "0.875rem",
                }}
              >
                {s.emoji}
              </div>

              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: s.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                {s.month}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--nan-bark)", fontWeight: 700, marginBottom: "0.875rem" }}>
                {s.season}
              </div>

              {/* Highlights */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {s.highlights.map((h) => (
                  <li key={h} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--nan-stone)" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, flexShrink: 0, display: "inline-block" }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
