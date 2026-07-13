import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา  มนต์น่าน",
  description: "มนต์น่าน พัฒนาโดยทีม RMUTL Nan เพื่อส่งเสริมการท่องเที่ยวจังหวัดน่านตลอด 12 เดือน",
};

const TEAM_VALUES = [
  {
    emoji: "🌿",
    title: "รักษ์น่าน",
    desc: "ส่งเสริมการท่องเที่ยวอย่างรับผิดชอบ กระจายนักท่องเที่ยวสู่ชุมชนรอง",
    color: "var(--nan-forest)",
    light: "var(--nan-sprout)",
  },
  {
    emoji: "✨",
    title: "เทคโนโลยี AI",
    desc: "ใช้ AI อัจฉริยะวางแผนทริปเฉพาะบุคคล เหมาะกับทุกเดือนและทุกสไตล์",
    color: "var(--nan-river)",
    light: "#E0F7F5",
  },
  {
    emoji: "🤝",
    title: "ชุมชนมาก่อน",
    desc: "แนะนำสถานที่ท่องเที่ยวชุมชนและแหล่งท่องเที่ยวรองที่นักท่องเที่ยวมักไม่รู้จัก",
    color: "var(--nan-gold)",
    light: "var(--nan-wheat)",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--nan-amber) 0%, var(--nan-gold) 30%, var(--nan-clay) 70%, var(--nan-earth) 100%)",
          padding: "5rem 1.5rem 7rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 60%, rgba(45,106,79,0.25) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "650px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              borderRadius: "99px",
              padding: "0.4rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.08em",
              marginBottom: "1.25rem",
            }}
          >
            🤝 เกี่ยวกับเรา
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: "#fff",
              marginBottom: "1.25rem",
              textShadow: "0 2px 16px rgba(100,50,10,0.3)",
            }}
          >
            มนต์น่าน
            <br />
            <span style={{ fontSize: "0.6em", fontWeight: 400 }}>พัฒนาเพื่อน่าน</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            โครงการวิจัยและพัฒนาจาก RMUTL น่าน เพื่อส่งเสริมการท่องเที่ยวจังหวัดน่านอย่างยั่งยืน
            โดยใช้เทคโนโลยี AI ช่วยกระจายนักท่องเที่ยวตลอด 12 เดือน
          </p>
        </div>
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "80px", display: "block", fill: "var(--nan-cream)" }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--nan-cream)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
            className="about-grid"
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: "var(--nan-sprout)",
                  color: "var(--nan-forest)",
                  borderRadius: "99px",
                  padding: "0.35rem 1.1rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                🎯 พันธกิจของเรา
              </span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "var(--nan-bark)",
                  lineHeight: 1.3,
                  marginBottom: "1.25rem",
                }}
              >
                กระจายนักท่องเที่ยว
                <br />
                สู่น่านตลอด 12 เดือน
              </h2>
              <div className="section-divider" />
              <p style={{ color: "var(--nan-stone)", lineHeight: 1.9, fontSize: "0.9375rem", marginBottom: "1.25rem" }}>
                น่านมีนักท่องเที่ยวกระจุกตัวอยู่ในไฮซีซัน (พฤศจิกายน – มกราคม) เพียงไม่กี่เดือน
                ทั้งที่น่านสวยงามทุกเดือน จึงถูกสร้างขึ้นเพื่อแนะนำนักท่องเที่ยวให้รู้จักน่านในมิติที่หลากหลายกว่าที่เคยรู้จัก
              </p>
              <p style={{ color: "var(--nan-stone)", lineHeight: 1.9, fontSize: "0.9375rem" }}>
                โดยเฉพาะการส่งเสริมชุมชนท้องถิ่น แหล่งท่องเที่ยวรอง และวิถีชีวิตดั้งเดิมที่ยังคงสมบูรณ์
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { stat: "12", label: "เดือนที่น่านน่าเที่ยว", color: "var(--nan-forest)" },
                { stat: "50+", label: "สถานที่ในฐานข้อมูล", color: "var(--nan-river)" },
                { stat: "AI", label: "วางแผนทริปเฉพาะบุคคล", color: "var(--nan-gold)" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass-card"
                  style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: s.color,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {s.stat}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "var(--nan-stone)", lineHeight: 1.5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (max-width: 640px) {
              .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
            }
          `}</style>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          padding: "4rem 1.5rem 5rem",
          background: "linear-gradient(180deg, var(--nan-cream) 0%, var(--nan-linen) 100%)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "var(--nan-bark)",
              }}
            >
              คุณค่าที่เราเชื่อมั่น
            </h2>
            <div className="section-divider" style={{ margin: "0.75rem auto 0" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {TEAM_VALUES.map((v) => (
              <div
                key={v.title}
                className="glass-card"
                style={{ padding: "2rem", textAlign: "center" }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: v.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  {v.emoji}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    color: "var(--nan-bark)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ color: "var(--nan-stone)", lineHeight: 1.8, fontSize: "0.9rem" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "var(--nan-cream)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              color: "var(--nan-bark)",
              marginBottom: "1rem",
            }}
          >
            เริ่มต้นทริปน่านของคุณวันนี้
          </h2>
          <p style={{ color: "var(--nan-stone)", lineHeight: 1.8, marginBottom: "2rem", fontSize: "1rem" }}>
            ให้มนต์น่านช่วยคุณค้นพบน่านในมุมที่ไม่เคยเห็นมาก่อน
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/plan" style={{ textDecoration: "none" }}>
              <button className="btn-primary">✨ วางแผนทริปเลย</button>
            </Link>
            <Link href="/about-nan" style={{ textDecoration: "none" }}>
              <button className="btn-outline">🌿 รู้จักน่าน</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
