"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "หน้าแรก", icon: "🏔️" },
  { href: "/about-nan", label: "แนะนำน่าน", icon: "🌿" },
  { href: "/plan", label: "AI วางแผนทริป", icon: "✨" },
  { href: "/about-us", label: "เกี่ยวกับเรา", icon: "🤝" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253, 248, 239, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(82, 183, 136, 0.2)",
        boxShadow: "0 2px 24px rgba(45, 106, 79, 0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>🌄</span>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "var(--nan-forest)",
                  lineHeight: 1.1,
                }}
              >
                Nan365
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--nan-stone)",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                น่าน ไร้ฤดู
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
          }}
          className="hidden md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "99px",
                    textDecoration: "none",
                    fontSize: "0.9375rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#fff" : "var(--nan-bark)",
                    background: active
                      ? "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))"
                      : "transparent",
                    transition: "all 0.2s ease",
                    boxShadow: active ? "0 2px 12px rgba(45,106,79,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--nan-sprout)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--nan-forest)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--nan-bark)";
                    }
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden"
          aria-label="เปิดเมนู"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: "var(--nan-sprout)",
            border: "none",
            borderRadius: "0.75rem",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--nan-forest)",
            fontSize: "1.25rem",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(253, 248, 239, 0.97)",
            borderTop: "1px solid var(--nan-smoke)",
            padding: "1rem 1.5rem 1.5rem",
          }}
          className="md:hidden"
        >
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.875rem",
                      textDecoration: "none",
                      fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "var(--nan-bark)",
                      background: active
                        ? "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))"
                        : "var(--nan-sprout)",
                      fontSize: "1rem",
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
