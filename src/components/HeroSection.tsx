"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, #D8F3DC 0%, #B7E4C7 20%, #74C69D 50%, #52B788 70%, #2D6A4F 100%)",
        }}
      />

      {/* Decorative Circles */}
      <div
        className="animate-mist"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,196,106,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(78,205,196,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "260px",
          opacity: 0.18,
        }}
      >
        <path
          d="M0,260 L0,180 L120,100 L240,160 L360,60 L480,140 L600,20 L720,100 L840,40 L960,120 L1080,50 L1200,130 L1320,80 L1440,150 L1440,260 Z"
          fill="#1a4030"
        />
        <path
          d="M0,260 L0,200 L180,130 L300,180 L480,90 L600,160 L800,70 L960,150 L1100,100 L1280,160 L1440,120 L1440,260 Z"
          fill="#2D6A4F"
          opacity="0.7"
        />
      </svg>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 3.5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left: Text */}
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(253, 248, 239, 0.9)",
              borderRadius: "99px",
              padding: "0.4rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--nan-forest)",
              boxShadow: "0 2px 12px rgba(45,106,79,0.15)",
            }}
          >
            <span>🌿</span>
            <span>ค้นพบน่าน ในแบบที่ไม่เคยรู้จักมาก่อน</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontFamily: "'Playfair Display', 'Noto Serif Thai', serif",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              textShadow: "0 2px 20px rgba(30,70,50,0.3)",
            }}
          >
            น่าน{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--nan-amber), var(--nan-gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ไร้ฤดู
            </span>
            <br />
            <span style={{ fontSize: "0.65em", fontWeight: 400 }}>
              วางแผนเที่ยวเมืองน่านทุกเดือน
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.075rem",
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.9,
              marginBottom: "2.5rem",
              maxWidth: "480px",
            }}
          >
            ให้ AI ช่วยพาคุณสัมผัสธรรมชาติ วิถีชีวิต และวัฒนธรรมน่านที่ซ่อนอยู่
            กาเเฟ ทะเลหมอก นาขั้นบันได ไทลื้อ และอีกมากมาย ในทุกเดือนของปี
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/plan" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ fontSize: "1.05rem", padding: "0.875rem 2.25rem" }}>
                ✨ เริ่มวางแผนทริป
              </button>
            </Link>
            <Link href="/about-nan" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  border: "2px solid rgba(255,255,255,0.5)",
                  borderRadius: "99px",
                  padding: "0.875rem 2rem",
                  fontSize: "1rem",
                  fontFamily: "'Sarabun', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                }}
              >
                รู้จักน่าน
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "12", unit: "เดือน", label: "น่านสวยทุกเดือน" },
              { value: "50+", unit: "แห่ง", label: "สถานที่ท่องเที่ยว" },
              { value: "AI", unit: "พาวเวอร์", label: "วางแผนอัจฉริยะ" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--nan-amber)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                  <span style={{ fontSize: "0.9rem", marginLeft: "0.2rem", color: "rgba(255,255,255,0.7)" }}>
                    {s.unit}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", marginTop: "0.25rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image Card */}
        <div
          className="animate-float hidden md:block"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 0.3s",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "2rem",
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 16px 64px rgba(30,70,50,0.3)",
            }}
          >
            <img
              src="/nan-hero.png"
              alt="ภูมิทัศน์จังหวัดน่าน — นาขั้นบันไดและหมอก"
              style={{
                width: "100%",
                borderRadius: "1.5rem",
                display: "block",
                objectFit: "cover",
                aspectRatio: "1/1",
              }}
            />
            {/* Caption Card */}
            <div
              style={{
                marginTop: "0.875rem",
                padding: "0.75rem 1rem",
                background: "rgba(253,248,239,0.9)",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🌾</span>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nan-bark)" }}>
                  นาขั้นบันได — บ่อเกลือ
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--nan-stone)" }}>
                  หนึ่งในมรดกชุมชนที่หายากที่สุดของไทย
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          lineHeight: 0,
        }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "80px", display: "block", fill: "var(--nan-cream)" }}>
          <path d="M0,80 C240,20 480,60 720,30 C960,0 1200,50 1440,20 L1440,80 Z" />
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
