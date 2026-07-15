"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NanIcon } from "@/components/Icon";

const NAV_ITEMS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about-nan", label: "แนะนำน่าน" },
  { href: "/plan", label: "AI วางแผนทริป" },
  { href: "/about-us", label: "เกี่ยวกับเรา" },
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
          padding: "0 1rem",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          width: "100%",
        }}
        className="navbar-container"
      >
        {/* Logo - Hidden on mobile */}
        <Link href="/" style={{ textDecoration: "none", display: "none" }} className="navbar-logo-desktop">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <NanIcon name="sunrise" size={14} />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "var(--nan-forest)",
                  lineHeight: 1.1,
                }}
              >
                มนต์น่าน
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
            display: "none",
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
          }}
          className="hidden md:flex desktop-menu"
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
            width: "44px",
            height: "44px",
            minWidth: "44px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--nan-forest)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--nan-leaf)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--nan-sprout)";
          }}
        >
          {menuOpen ? <NanIcon name="x" size={12} /> : <NanIcon name="menu" size={12} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(253, 248, 239, 0.97)",
            borderTop: "1px solid var(--nan-smoke)",
            padding: "0.75rem 1rem 1rem",
            animation: "slideDown 0.2s ease",
          }}
          className="md:hidden mobile-menu"
        >
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
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
                      gap: "0.5rem",
                      padding: "0.65rem 0.875rem",
                      borderRadius: "0.75rem",
                      textDecoration: "none",
                      fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "var(--nan-bark)",
                      background: active
                        ? "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))"
                        : "var(--nan-sprout)",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile First - Hide everything except hamburger */
        .navbar-logo-desktop {
          display: none !important;
        }
        .desktop-menu {
          display: none !important;
        }

        /* Desktop - Show logo and menu */
        @media (min-width: 768px) {
          .navbar-container {
            justify-content: space-between !important;
          }
          .navbar-logo-desktop {
            display: flex !important;
          }
          .desktop-menu {
            display: flex !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .navbar-container {
            padding: 0 0.75rem !important;
            min-height: 56px !important;
            justify-content: flex-start !important;
          }
          .navbar-logo-desktop {
            display: none !important;
          }
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu {
            animation: slideDown 0.2s ease;
          }
        }
      `}</style>
    </nav>
  );
}
