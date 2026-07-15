"use client";

import Link from "next/link";
import { APP_VERSION } from "@/lib/constants";
import { NanIcon, type IconName } from "@/components/Icon";

const HIGHLIGHT_ITEMS: { icon: IconName; text: string }[] = [
  { icon: "mountain", text: "ดอยภูคา" },
  { icon: "temple", text: "วัดภูมินทร์" },
  { icon: "salt", text: "บ่อเกลือโบราณ" },
  { icon: "bamboo", text: "ชุมชนไทลื้อ" },
  { icon: "waves", text: "แม่น้ำน่าน" },
  { icon: "rice", text: "นาขั้นบันได" },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, var(--nan-forest) 0%, #1a4030 100%)",
        color: "#D8F3DC",
        marginTop: "auto",
      }}
    >
      {/* Wave Divider */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "60px", display: "block", fill: "var(--nan-cream)" }}
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem 2.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <NanIcon name="sunrise" size={14} />
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#fff",
                  }}
                >
                  มนต์น่าน
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--nan-mist)", letterSpacing: "0.1em" }}>
                  น่าน ไร้ฤดู
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--nan-mist)", maxWidth: "240px" }}>
              ค้นพบน่านในทุกมิติ — ธรรมชาติ วัฒนธรรม วิถีชีวิต ให้ AI ช่วยวางแผนทริปที่ใช่สำหรับคุณ
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                color: "var(--nan-amber)",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              เมนูหลัก
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/", label: "หน้าแรก" },
                { href: "/about-nan", label: "แนะนำจังหวัดน่าน" },
                { href: "/plan", label: "AI วางแผนทริป" },
                { href: "/about-us", label: "เกี่ยวกับเรา" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: "var(--nan-mist)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--nan-amber)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--nan-mist)"; }}
                  >
                    <span style={{ color: "var(--nan-leaf)", fontSize: "0.6rem" }}>◆</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <div>
            <h4
              style={{
                color: "var(--nan-amber)",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              ไฮไลต์น่าน
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {HIGHLIGHT_ITEMS.map((item) => (
                <li
                  key={item.text}
                  style={{ color: "var(--nan-mist)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <NanIcon name={item.icon} size={12} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "var(--nan-amber)",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              ติดต่อ
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "var(--nan-mist)" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <NanIcon name="map-pin" size={12} />
                <span>มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา น่าน</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <NanIcon name="mail" size={12} />
                <span>jeerasakananta@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(149, 213, 178, 0.2)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(149,213,178,0.7)" }}>
            © {new Date().getFullYear()} มนต์น่าน RMUTL Nan · {APP_VERSION}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(149,213,178,0.5)" }}>พัฒนาโดย</span>
            <span style={{ fontSize: "0.75rem", color: "var(--nan-amber)" }}>Jeerasak Ananta SS4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
