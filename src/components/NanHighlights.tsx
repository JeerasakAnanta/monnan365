import { NanIcon, type IconName } from "@/components/Icon";

const HIGHLIGHTS = [
  {
    icon: "mountain" as IconName,
    title: "ธรรมชาติอันอุดม",
    subtitle: "ดอย · ป่า · หมอก",
    desc: "ดอยภูคา ทะเลหมอกยามเช้า น้ำตกฝั่งขวา นาขั้นบันไดสีทอง น่านเป็นจังหวัด ที่มีพื้นที่ป่ามากที่สุดในภาคเหนือ",
    tags: ["ดอยภูคา", "ทะเลหมอก", "น้ำตก"],
    color: "var(--nan-forest)",
    lightColor: "var(--nan-sprout)",
    accent: "var(--nan-leaf)",
  },
  {
    icon: "temple" as IconName,
    title: "วัฒนธรรมล้ำค่า",
    subtitle: "ไทลื้อ · ลัวะ · วัดโบราณ",
    desc: "วัดภูมินทร์ ประดับภาพจิตรกรรมฝาผนัง อันงดงาม ชุมชนไทลื้อบ้านหนองบัว ผ้าทอลายโบราณ ที่ยังสืบทอดจนวันนี้",
    tags: ["วัดภูมินทร์", "ไทลื้อ", "ผ้าทอ"],
    color: "var(--nan-earth)",
    lightColor: "var(--nan-wheat)",
    accent: "var(--nan-gold)",
  },
  {
    icon: "salt" as IconName,
    title: "วิถีชีวิตดั้งเดิม",
    subtitle: "บ่อเกลือ · ชุมชน · เกษตร",
    desc: "บ่อเกลือสินธุ์ โบราณอายุนับพันปี นาเกลือ ที่หาชมไม่ได้จากที่ไหนในไทย วิถีเกษตรกรรมและชุมชน ที่ยังคงสมบูรณ์",
    tags: ["บ่อเกลือ", "ชุมชน", "เกษตร"],
    color: "var(--nan-river)",
    lightColor: "#E0F7F5",
    accent: "var(--nan-sky)",
  },
];

export function NanHighlights() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "var(--nan-cream)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            <NanIcon name="leaf" size={12} /> ทำไมต้องมาเที่ยวน่าน
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--nan-bark)",
              marginBottom: "0.75rem",
            }}
          >
            สัมผัสน่านในทุกมิติ
          </h2>
          <div className="section-divider" style={{ margin: "0 auto 1.25rem" }} />
          <p
            style={{
              color: "var(--nan-stone)",
              fontSize: "1.05rem",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            จังหวัดที่ยังคง รักษาความดั้งเดิมไว้ได้มากที่สุดแห่งหนึ่ง ของประเทศไทย
          </p>
        </div>

        {/* Cards */}
        <div
          className="highlights-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className="glass-card"
              style={{
                padding: "2rem",
                animationDelay: `${i * 0.15}s`,
                borderTop: `4px solid ${h.accent}`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "1rem",
                  background: h.lightColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: `0 4px 16px ${h.accent}30`,
                }}
              >
                <NanIcon name={h.icon} size={14} />
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: h.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.375rem",
                }}
              >
                {h.subtitle}
              </div>
              <h3
                style={{
                  fontSize: "1.375rem",
                  color: "var(--nan-bark)",
                  marginBottom: "0.875rem",
                }}
              >
                {h.title}
              </h3>

              <p style={{ color: "var(--nan-stone)", lineHeight: 1.85, fontSize: "0.9375rem" }}>
                {h.desc}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
                {h.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: h.lightColor,
                      color: h.color,
                      borderRadius: "99px",
                      padding: "0.3rem 0.875rem",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .highlights-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
