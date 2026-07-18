"use client";

import { NanIcon } from "@/components/Icon";
import type { Attraction } from "@/lib/types";
import { formatBudget } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  nature: "ธรรมชาติ",
  culture: "วัฒนธรรม",
  food: "อาหาร",
  wellness: "Wellness",
  community: "วิถีชุมชน",
};

const MONTHS_TH = [
  "", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatMonths(months: number[]): string {
  if (months.length === 12) return "ทุกเดือน";
  if (months.length === 0) return "-";
  return months.map((m) => MONTHS_TH[m]).join(", ");
}

type Props = {
  attraction: Attraction;
  time?: string;
  onClose: () => void;
};

export function AttractionModal({ attraction, time, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Hero Image — always shown */}
        <div style={{ position: "relative", height: "220px", overflow: "hidden", borderRadius: "1.25rem 1.25rem 0 0" }}>
          <img
            src={attraction.image_url || "/nan-hero.png"}
            alt={attraction.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            }}
          />
          <button
            onClick={onClose}
            aria-label="ปิด"
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "0.5rem",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            <NanIcon name="x" size={14} />
          </button>
          <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem", right: "1.25rem", zIndex: 1 }}>
            <h2 style={{ fontSize: "1.25rem", color: "#fff", fontWeight: 700, margin: 0, lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              {attraction.name}
            </h2>
            {attraction.district && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", marginTop: "0.25rem" }}>
                <NanIcon name="map-pin" size={12} /> {attraction.district}
              </span>
            )}
          </div>
        </div>

        {/* Category badges bar */}
        <div
          style={{
            padding: "0.75rem 1.5rem",
            borderBottom: "1px solid var(--nan-smoke)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {attraction.category.map((cat) => (
            <span
              key={cat}
              style={{
                borderRadius: "99px",
                background: "var(--nan-sprout)",
                color: "var(--nan-forest)",
                padding: "0.15rem 0.625rem",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {CATEGORY_LABEL[cat] ?? cat}
            </span>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Time badge (from trip plan) */}
          {time && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "var(--nan-sprout)",
                color: "var(--nan-forest)",
                borderRadius: "99px",
                padding: "0.3rem 0.875rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                alignSelf: "flex-start",
              }}
            >
              <NanIcon name="clock" size={12} /> {time}
            </div>
          )}

          {/* Description */}
          {attraction.description && (
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--nan-ink)", margin: 0 }}>
              {attraction.description}
            </p>
          )}

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {/* Best months */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--nan-bark)" }}>
              <NanIcon name="calendar" size={14} />
              <span style={{ fontWeight: 500 }}>เดือนที่เหมาะสม:</span>
              <span style={{ color: "var(--nan-stone)" }}>{formatMonths(attraction.months_best)}</span>
            </div>

            {/* Season note */}
            {attraction.season_note && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.875rem", color: "var(--nan-bark)" }}>
                <NanIcon name="sun" size={14} style={{ marginTop: "0.15rem", flexShrink: 0 }} />
                <span style={{ color: "var(--nan-stone)", lineHeight: 1.7 }}>{attraction.season_note}</span>
              </div>
            )}

            {/* Budget */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--nan-bark)" }}>
              <NanIcon name="circle-dollar-sign" size={14} />
              <span style={{ fontWeight: 500 }}>งบประมาณ:</span>
              <span style={{ color: "var(--nan-stone)" }}>{formatBudget(attraction.budget_level)}</span>
            </div>

            {/* Contact */}
            {attraction.contact && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--nan-bark)" }}>
                <NanIcon name="phone" size={14} />
                <span style={{ color: "var(--nan-stone)" }}>{attraction.contact}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {attraction.is_secondary && (
              <span
                style={{
                  borderRadius: "99px",
                  background: "var(--nan-wheat)",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.8rem",
                  color: "var(--nan-earth)",
                  fontWeight: 500,
                }}
              >
                แหล่งท่องเที่ยวรอง
              </span>
            )}
            {attraction.is_community && (
              <span
                style={{
                  borderRadius: "99px",
                  background: "#E0F2FE",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.8rem",
                  color: "#0369A1",
                  fontWeight: 500,
                }}
              >
                ชุมชน
              </span>
            )}
          </div>

          {/* Google Maps button */}
          {attraction.lat != null && attraction.lng != null && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${attraction.lat},${attraction.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                borderRadius: "99px",
                background: "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))",
                color: "#fff",
                padding: "0.65rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.2s",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              <NanIcon name="map-pin" size={14} /> เปิดใน Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
