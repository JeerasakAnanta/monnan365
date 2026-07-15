"use client";

import dynamic from "next/dynamic";
import type { PlanApiResponse } from "@/lib/types";
import type { MapPoint } from "@/components/TripMap";
import { NanIcon } from "@/components/Icon";
import { ShareButton } from "@/components/ShareButton";

const TripMap = dynamic(() => import("@/components/TripMap").then((m) => m.TripMap), {
  ssr: false,
});

export function TripResult({ result, id }: { result: PlanApiResponse; id?: string }) {
  const points: MapPoint[] = result.days
    .flatMap((day) => day.items)
    .filter((item) => item.attraction?.lat != null && item.attraction?.lng != null)
    .map((item) => ({
      id: item.id,
      name: item.attraction!.name,
      lat: item.attraction!.lat!,
      lng: item.attraction!.lng!,
      isSecondary: item.attraction!.is_secondary || item.attraction!.is_community,
    }));

  const today = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ marginTop: "2.5rem", width: "100%", maxWidth: "672px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Print Header (only visible in print) */}
      <div className="print-only print-header">
        <h1>มนต์น่าน 365 — แผนเที่ยวน่าน</h1>
        <p className="print-meta">{result.summary.slice(0, 80)}...</p>
        <p className="print-meta">พิมพ์เมื่อ: {today}</p>
        <p className="print-meta">monnan.jeerasakananta.dev</p>
      </div>

      {/* Actions */}
      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", gap: "0.625rem" }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            borderRadius: "99px",
            border: "1.5px solid var(--nan-smoke)",
            background: "#fff",
            padding: "0.45rem 1.1rem",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--nan-forest)",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-leaf)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-smoke)"; }}
        >
          <NanIcon name="printer" size={14} /> พิมพ์ / บันทึกเป็น PDF
        </button>
        <ShareButton result={result} existingId={id} />
      </div>

      {/* Summary Card */}
      <section
        style={{
          borderRadius: "1.25rem",
          border: "1.5px solid rgba(82,183,136,0.3)",
          background: "linear-gradient(135deg, var(--nan-sprout), var(--nan-wheat))",
          padding: "1.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
          <NanIcon name="leaf" size={12} />
          <h2 style={{ fontSize: "1.175rem", color: "var(--nan-bark)" }}>
            ทำไมเดือนนี้ถึงน่าไปน่าน
          </h2>
        </div>
        <p style={{ lineHeight: 1.9, color: "var(--nan-bark)", fontSize: "0.9375rem" }}>
          {result.summary}
        </p>
        {result.low_season_perks.length > 0 && (
          <ul style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", listStyle: "none" }}>
            {result.low_season_perks.map((perk, i) => (
              <li
                key={i}
                style={{
                  borderRadius: "99px",
                  background: "rgba(45,106,79,0.12)",
                  padding: "0.35rem 1rem",
                  fontSize: "0.8rem",
                  color: "var(--nan-forest)",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <NanIcon name="check" size={12} /> {perk}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Map */}
      {points.length > 0 && (
        <section
          className="no-print"
          style={{
            overflow: "hidden",
            borderRadius: "1.25rem",
            border: "1.5px solid var(--nan-smoke)",
            boxShadow: "0 2px 20px rgba(45,106,79,0.08)",
          }}
        >
          <TripMap points={points} />
        </section>
      )}

      {/* Day-by-day */}
      {result.days.map((day) => (
        <section key={day.day} className="avoid-break">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {day.day}
            </div>
            <h3
              style={{
                fontSize: "1.05rem",
                color: "var(--nan-bark)",
              }}
            >
              วันที่ {day.day}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {day.items.map((item) => (
              <article
                key={item.id}
                style={{
                  borderRadius: "1rem",
                  border: "1.5px solid var(--nan-smoke)",
                  background: "#fff",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 2px 12px rgba(45,106,79,0.05)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(45,106,79,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(45,106,79,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "var(--nan-sprout)",
                        color: "var(--nan-forest)",
                        borderRadius: "99px",
                        padding: "0.15rem 0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        marginBottom: "0.375rem",
                      }}
                    >
                      <NanIcon name="clock" size={12} /> {item.time}
                    </span>
                    <h4 style={{ fontSize: "1.05rem", color: "var(--nan-bark)" }}>
                      {item.attraction?.name ?? item.id}
                    </h4>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "0.375rem", flexShrink: 0 }}>
                    {item.attraction?.is_secondary && (
                      <span
                        style={{
                          borderRadius: "99px",
                          background: "var(--nan-wheat)",
                          padding: "0.2rem 0.625rem",
                          fontSize: "0.72rem",
                          color: "var(--nan-earth)",
                          fontWeight: 500,
                        }}
                      >
                        แหล่งท่องเที่ยวรอง
                      </span>
                    )}
                    {item.attraction?.is_community && (
                      <span
                        style={{
                          borderRadius: "99px",
                          background: "#E0F2FE",
                          padding: "0.2rem 0.625rem",
                          fontSize: "0.72rem",
                          color: "#0369A1",
                          fontWeight: 500,
                        }}
                      >
                        ชุมชน
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", lineHeight: 1.85, color: "var(--nan-stone)" }}>
                  {item.reason}
                </p>

                {item.tip && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.625rem 0.875rem",
                      background: "var(--nan-wheat)",
                      borderRadius: "0.625rem",
                      fontSize: "0.85rem",
                      color: "var(--nan-earth)",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <NanIcon name="lightbulb" size={12} />
                    <span>{item.tip}</span>
                  </div>
                )}

                {item.attraction?.contact && (
                  <p style={{ marginTop: "0.625rem", fontSize: "0.83rem", color: "var(--nan-stone)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <NanIcon name="phone" size={12} /> {item.attraction.contact}
                  </p>
                )}

                {item.attraction?.lat != null && item.attraction?.lng != null && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.attraction.lat},${item.attraction.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "0.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      borderRadius: "99px",
                      border: "1.5px solid var(--nan-smoke)",
                      background: "#fff",
                      padding: "0.35rem 0.875rem",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--nan-forest)",
                      textDecoration: "none",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--nan-leaf)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--nan-smoke)"; }}
                  >
                    <NanIcon name="map-pin" size={12} /> เปิดใน Google Maps
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Print Footer (only visible in print) */}
      <div className="print-only print-footer">
        <p>MonNan365 — มนต์น่าน 365 วัน | monnan.jeerasakananta.dev</p>
        <p>แผนเที่ยวสร้างโดย AI จากฐานข้อมูลแหล่งท่องเที่ยวจังหวัดน่าน</p>
      </div>
    </div>
  );
}
