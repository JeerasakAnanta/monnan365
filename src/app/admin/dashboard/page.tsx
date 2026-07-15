"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalAttractions: number;
  secondaryCount: number;
  communityCount: number;
  totalSharedPlans: number;
  districts: { district: string; count: number }[];
  monthlyCoverage: { month: number; count: number }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "var(--nan-stone)", fontSize: "0.9rem" }}>กำลังโหลด...</div>;
  }

  if (!stats) {
    return <div style={{ color: "#DC2626", fontSize: "0.9rem" }}>ไม่สามารถโหลดข้อมูลได้</div>;
  }

  const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--nan-bark)", fontWeight: 700, marginBottom: "1.5rem" }}>
        Dashboard
      </h1>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Attractions", value: stats.totalAttractions, color: "var(--nan-forest)" },
          { label: "Secondary", value: stats.secondaryCount, color: "var(--nan-gold)" },
          { label: "Community", value: stats.communityCount, color: "var(--nan-river)" },
          { label: "Shared Plans", value: stats.totalSharedPlans, color: "var(--nan-leaf)" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              borderRadius: "1rem",
              border: "1.5px solid var(--nan-smoke)",
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--nan-stone)", fontWeight: 500, marginBottom: "0.375rem" }}>
              {card.label}
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Districts */}
      <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", color: "var(--nan-bark)", fontWeight: 600, marginBottom: "1rem" }}>
          Attractions by District
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {stats.districts.map((d) => (
            <div key={d.district} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--nan-bark)", minWidth: "120px" }}>{d.district}</span>
              <div style={{ flex: 1, height: "8px", background: "var(--nan-smoke)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(d.count / stats.totalAttractions) * 100}%`, background: "linear-gradient(90deg, var(--nan-forest), var(--nan-leaf))", borderRadius: "99px" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--nan-stone)", minWidth: "24px", textAlign: "right" }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly coverage */}
      <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem" }}>
        <h2 style={{ fontSize: "1rem", color: "var(--nan-bark)", fontWeight: 600, marginBottom: "1rem" }}>
          Monthly Coverage
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "0.375rem" }}>
          {stats.monthlyCoverage.map((m) => (
            <div key={m.month} style={{ textAlign: "center" }}>
              <div style={{
                height: "80px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "100%",
                  maxWidth: "32px",
                  height: `${Math.max(8, (m.count / stats.totalAttractions) * 100)}%`,
                  background: "linear-gradient(180deg, var(--nan-leaf), var(--nan-forest))",
                  borderRadius: "4px 4px 0 0",
                }} />
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--nan-stone)", marginTop: "0.25rem" }}>{MONTHS[m.month - 1]}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--nan-bark)", fontWeight: 600 }}>{m.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
