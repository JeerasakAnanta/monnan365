import { HeroSection } from "@/components/HeroSection";
import { NanHighlights } from "@/components/NanHighlights";
import { SeasonTimeline } from "@/components/SeasonTimeline";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NanHighlights />
      <SeasonTimeline />

      {/* CTA Section */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "linear-gradient(135deg, var(--nan-sprout) 0%, var(--nan-wheat) 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.25rem",
              lineHeight: 1,
            }}
          >
            ✨
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--nan-bark)",
              marginBottom: "1rem",
            }}
          >
            พร้อมค้นพบ น่านแล้วหรือยัง
          </h2>
          <p
            style={{
              color: "var(--nan-stone)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            ให้ AI ช่วยวางแผนทริป เที่ยวน่าน ที่เหมาะกับเดือน ตามสไตล์ของคุณ
            พร้อมแนะนำสถานที่ที่นักท่องเที่ยวทั่วไปมักไม่รู้จัก
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/plan" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ fontSize: "1.05rem", padding: "0.9rem 2.5rem" }}>
                🗺️ วางแผนทริปกับ AI
              </button>
            </Link>
            <Link href="/about-nan" style={{ textDecoration: "none" }}>
              <button className="btn-outline" style={{ fontSize: "1.05rem" }}>
                📖 รู้จักน่านก่อน
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
