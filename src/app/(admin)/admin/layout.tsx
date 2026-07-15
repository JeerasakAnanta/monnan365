"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NanIcon } from "@/components/Icon";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: "layout-dashboard" as const },
  { href: "/admin/attractions", label: "สถานที่ท่องเที่ยว", icon: "map-pin" as const },
  { href: "/admin/ai-config", label: "ตั้งค่า AI", icon: "settings" as const },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--nan-cream)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#fff",
          borderRight: "1px solid var(--nan-smoke)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
        className="admin-sidebar"
      >
        <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid var(--nan-smoke)" }}>
          <Link href="/admin/dashboard" style={{ textDecoration: "none" }}>
            <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--nan-forest)" }}>
              MonNan365
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--nan-stone)", marginTop: "0.125rem" }}>
              แผงผู้ดูแล
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {ADMIN_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "var(--nan-bark)",
                  background: active
                    ? "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))"
                    : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <NanIcon name={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid var(--nan-smoke)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "transparent",
              fontSize: "0.9rem",
              color: "var(--nan-bark)",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nan-sprout)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <NanIcon name="log-out" size={16} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "56px",
          background: "#fff",
          borderBottom: "1px solid var(--nan-smoke)",
          zIndex: 50,
          alignItems: "center",
          padding: "0 1rem",
          justifyContent: "space-between",
        }}
        className="admin-mobile-header"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
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
          }}
        >
          <NanIcon name={sidebarOpen ? "x" : "menu"} size={14} />
        </button>
        <span style={{ fontWeight: 700, color: "var(--nan-forest)" }}>ผู้ดูแล</span>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--nan-stone)",
            padding: "0.5rem",
          }}
        >
          <NanIcon name="log-out" size={16} />
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 35,
          }}
          className="admin-overlay"
        />
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          padding: "2rem",
          maxWidth: "960px",
        }}
        className="admin-main"
      >
        {children}
      </main>

      <style>{`
        .admin-sidebar { display: flex !important; }
        .admin-mobile-header { display: none !important; }
        .admin-overlay { display: none !important; }
        .admin-main { margin-left: 240px !important; }

        @media (max-width: 767px) {
          .admin-sidebar {
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.25s ease;
          }
          .admin-mobile-header { display: flex !important; }
          .admin-overlay { display: block !important; }
          .admin-main {
            margin-left: 0 !important;
            padding: 1.25rem !important;
            padding-top: calc(56px + 1.25rem) !important;
          }
        }
      `}</style>
    </div>
  );
}
