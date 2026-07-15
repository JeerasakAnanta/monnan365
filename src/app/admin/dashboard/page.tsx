"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NanIcon } from "@/components/Icon";

type Stats = {
  totalAttractions: number;
  secondaryCount: number;
  communityCount: number;
  totalSharedPlans: number;
  districts: { district: string; count: number }[];
  monthlyCoverage: { month: number; count: number }[];
};

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "1rem",
      border: "1.5px solid var(--nan-smoke)",
      padding: "1.25rem",
      height: "110px",
    }}>
      <div style={{ width: "80px", height: "12px", borderRadius: "6px", background: "var(--nan-smoke)", marginBottom: "0.75rem", animation: "shimmer 1.5s infinite" }} />
      <div style={{ width: "48px", height: "32px", borderRadius: "8px", background: "var(--nan-smoke)", animation: "shimmer 1.5s infinite" }} />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "1rem",
      border: "1.5px solid var(--nan-smoke)",
      padding: "1.25rem",
      height: "200px",
    }}>
      <div style={{ width: "120px", height: "14px", borderRadius: "6px", background: "var(--nan-smoke)", marginBottom: "1rem", animation: "shimmer 1.5s infinite" }} />
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", height: "120px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: `${30 + Math.random() * 60}%`, borderRadius: "4px", background: "var(--nan-smoke)", animation: "shimmer 1.5s infinite" }} />
        ))}
      </div>
    </div>
  );
}

const STAT_CARDS = [
  { key: "totalAttractions", label: "Total Attractions", icon: "map-pin" as const, color: "var(--nan-forest)", bg: "var(--nan-sprout)" },
  { key: "secondaryCount", label: "Secondary", icon: "mountain" as const, color: "var(--nan-gold)", bg: "var(--nan-wheat)" },
  { key: "communityCount", label: "Community", icon: "handshake" as const, color: "var(--nan-river)", bg: "#E0F2FE" },
  { key: "totalSharedPlans", label: "Shared Plans", icon: "share" as const, color: "var(--nan-leaf)", bg: "var(--nan-sprout)" },
] as const;

const QUICK_ACTIONS = [
  { href: "/admin/attractions", label: "Manage Attractions", desc: "Add, edit, delete attractions", icon: "map-pin" as const, color: "var(--nan-forest)" },
  { href: "/admin/ai-config", label: "AI Configuration", desc: "Model, temperature, prompt", icon: "settings" as const, color: "var(--nan-gold)" },
  { href: "/", label: "View Live Site", desc: "Open the public app", icon: "sparkles" as const, color: "var(--nan-river)" },
];

const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAdminEmail(data.user.email);
    });
  }, []);

  function loadStats() {
    setLoading(true);
    setError(false);
    fetch("/api/admin/stats")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }

  useEffect(() => { loadStats(); }, []);

  const maxDistrict = stats ? Math.max(...stats.districts.map((d) => d.count)) : 1;

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", color: "var(--nan-bark)", fontWeight: 700, marginBottom: "0.25rem" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--nan-stone)" }}>
              {adminEmail ? `Signed in as ${adminEmail}` : "Admin Dashboard"}
            </p>
          </div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "99px",
              border: "1.5px solid var(--nan-smoke)",
              background: "#fff",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--nan-forest)",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            <NanIcon name="sparkles" size={14} /> Visit Site
          </Link>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <SkeletonChart />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{
          background: "#FEF2F2",
          borderRadius: "1rem",
          border: "1.5px solid #FECACA",
          padding: "2rem",
          textAlign: "center",
        }}>
          <NanIcon name="alert-triangle" size={32} color="#DC2626" />
          <p style={{ fontSize: "0.9rem", color: "#DC2626", marginTop: "0.75rem", marginBottom: "1rem" }}>
            ไม่สามารถโหลดข้อมูลได้
          </p>
          <button onClick={loadStats} className="btn-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
            ลองใหม่
          </button>
        </div>
      )}

      {/* Stats content */}
      {!loading && !error && stats && (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {STAT_CARDS.map((card) => {
              const value = stats[card.key as keyof Stats] as number;
              const pct = stats.totalAttractions > 0 && card.key !== "totalSharedPlans"
                ? Math.round((value / stats.totalAttractions) * 100)
                : null;
              return (
                <div
                  key={card.key}
                  style={{
                    background: "#fff",
                    borderRadius: "1rem",
                    border: "1.5px solid var(--nan-smoke)",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,106,79,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <NanIcon name={card.icon} size={20} color={card.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--nan-stone)", fontWeight: 500 }}>
                      {card.label}
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--nan-bark)", lineHeight: 1.2 }}>
                      {value}
                    </div>
                    {pct !== null && (
                      <div style={{ fontSize: "0.7rem", color: "var(--nan-stone)", marginTop: "0.125rem" }}>
                        {pct}% of total
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "1rem",
                  border: "1.5px solid var(--nan-smoke)",
                  background: "#fff",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,106,79,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--nan-smoke)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${action.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <NanIcon name={action.icon} size={18} color={action.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--nan-bark)" }}>{action.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--nan-stone)" }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Districts */}
            <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "0.95rem", color: "var(--nan-bark)", fontWeight: 600, marginBottom: "1rem" }}>
                Attractions by District
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {stats.districts.map((d, i) => {
                  const pct = (d.count / maxDistrict) * 100;
                  const isHovered = hoveredDistrict === d.district;
                  return (
                    <div
                      key={d.district}
                      style={{ display: "flex", alignItems: "center", gap: "0.625rem", opacity: hoveredDistrict && !isHovered ? 0.5 : 1, transition: "opacity 0.15s" }}
                      onMouseEnter={() => setHoveredDistrict(d.district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      <span style={{ fontSize: "0.7rem", color: "var(--nan-stone)", minWidth: "20px", textAlign: "right" }}>
                        {i + 1}.
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--nan-bark)", minWidth: "100px", fontWeight: isHovered ? 600 : 400 }}>
                        {d.district}
                      </span>
                      <div style={{ flex: 1, height: "8px", background: "var(--nan-smoke)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: isHovered
                            ? "var(--nan-forest)"
                            : "linear-gradient(90deg, var(--nan-forest), var(--nan-leaf))",
                          borderRadius: "99px",
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--nan-bark)", fontWeight: 600, minWidth: "20px", textAlign: "right" }}>
                        {d.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly coverage */}
            <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "0.95rem", color: "var(--nan-bark)", fontWeight: 600, marginBottom: "1rem" }}>
                Monthly Coverage
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "0.25rem", alignItems: "flex-end" }}>
                {stats.monthlyCoverage.map((m) => {
                  const heightPct = stats.totalAttractions > 0 ? (m.count / stats.totalAttractions) * 100 : 0;
                  const isHovered = hoveredMonth === m.month;
                  const intensity = m.count / stats.totalAttractions;
                  const barColor = intensity > 0.7
                    ? "var(--nan-forest)"
                    : intensity > 0.4
                      ? "var(--nan-leaf)"
                      : "var(--nan-mist)";
                  return (
                    <div
                      key={m.month}
                      style={{ textAlign: "center", cursor: "default" }}
                      onMouseEnter={() => setHoveredMonth(m.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      <div style={{
                        height: "100px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        position: "relative",
                      }}>
                        <div style={{
                          width: "100%",
                          maxWidth: "28px",
                          height: `${Math.max(8, heightPct)}%`,
                          background: isHovered ? "var(--nan-forest)" : barColor,
                          borderRadius: "4px 4px 0 0",
                          transition: "all 0.2s",
                          transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                          transformOrigin: "bottom",
                        }} />
                        {isHovered && (
                          <div style={{
                            position: "absolute",
                            top: "-4px",
                            background: "var(--nan-ink)",
                            color: "#fff",
                            fontSize: "0.65rem",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "4px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}>
                            {m.count} places
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.6rem", color: "var(--nan-stone)", marginTop: "0.375rem" }}>
                        {MONTHS[m.month - 1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
