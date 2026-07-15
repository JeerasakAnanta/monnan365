"use client";

import { useEffect, useState } from "react";
import { PlanForm, type PlanFormValues } from "@/components/PlanForm";
import { FontSizeToggle } from "@/components/FontSizeToggle";
import { TripResult } from "@/components/TripResult";
import { NanIcon } from "@/components/Icon";
import type { PlanApiResponse } from "@/lib/types";

const PLAN_STORAGE_KEY = "nan_plan_result_v1";

type StoredPlan = {
  values: PlanFormValues;
  result: PlanApiResponse;
  savedAt: number;
};

function readStoredPlan(): StoredPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.result || !Array.isArray(parsed.result.days)) return null;
    return parsed as StoredPlan;
  } catch {
    return null;
  }
}

function writeStoredPlan(data: StoredPlan) {
  try {
    sessionStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded / private browsing — persistence is best-effort, fail silently
  }
}

const LOADING_MESSAGES = [
  "กำลังสำรวจวัดภูมินทร์และเมืองเก่าน่าน...",
  "กำลังฟังเสียงต้มเกลือโบราณที่บ่อเกลือ...",
  "กำลังตามหาทะเลหมอกที่ดอยภูคา...",
  "กำลังชวนชุมชนไทลื้อมาทอเรื่องราวให้ฟัง...",
  "กำลังจัดเรียงเส้นทางให้เหมาะกับเดือนนี้...",
];

export default function PlanPage() {
  const [fontScale, setFontScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlanApiResponse | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * fontScale}px`;
  }, [fontScale]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    // Must read sessionStorage post-mount (not in a lazy useState initializer) so the
    // first client render matches the server-rendered null, avoiding a hydration mismatch.
    const stored = readStoredPlan();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from an external store (sessionStorage) on mount, not a render-triggered cascade
    if (stored) setResult(stored.result);
  }, []);

  async function handleSubmit(values: PlanFormValues) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setResult(data as PlanApiResponse);
      writeStoredPlan({ values, result: data as PlanApiResponse, savedAt: Date.now() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Page Hero */}
      <section
        className="no-print"
        style={{
          background: "linear-gradient(135deg, var(--nan-sky) 0%, var(--nan-leaf) 50%, var(--nan-forest) 100%)",
          padding: "4rem 1.5rem 6rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 70% 40%, rgba(233,196,106,0.25) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: "99px",
              padding: "0.4rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.08em",
              marginBottom: "1.25rem",
            }}
          >
            <NanIcon name="sparkles" size={12} /> AI Trip Planner
          </div>
          <h1
            style={{
              fontSize: "clamp(1.875rem, 4.5vw, 3rem)",
              color: "#fff",
              marginBottom: "1rem",
              textShadow: "0 2px 16px rgba(30,70,50,0.3)",
            }}
          >
            วางแผนทริปน่าน
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, var(--nan-amber), #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ด้วย AI อัจฉริยะ
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1rem", lineHeight: 1.9, maxWidth: "520px", margin: "0 auto" }}>
            บอกเดือนที่อยากไปและสไตล์ที่ชอบ ให้ AI ช่วยวางแผนทริปที่พาไปสัมผัสน่านนอกไฮซีซัน
            พร้อมพาไปรู้จักชุมชนและแหล่งท่องเที่ยวรอง
          </p>
        </div>
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "80px", display: "block", fill: "var(--nan-cream)" }}>
            <path d="M0,80 C240,20 480,60 720,30 C960,0 1200,50 1440,20 L1440,80 Z" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          padding: "2rem 1.5rem 5rem",
          background: "var(--nan-cream)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Font size toggle */}
        <div
          className="no-print"
          style={{
            width: "100%",
            maxWidth: "672px",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <FontSizeToggle scale={fontScale} onChange={setFontScale} />
        </div>

        {/* Form */}
        <div className="no-print" style={{ width: "100%", maxWidth: "672px" }}>
          <PlanFormNanTheme onSubmit={handleSubmit} isLoading={loading} />
        </div>

        {/* Loading */}
        {loading && (
          <div
            className="no-print"
            style={{
              marginTop: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "3px solid var(--nan-sprout)",
                borderTopColor: "var(--nan-forest)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "var(--nan-stone)", fontSize: "0.9rem" }}>
              {LOADING_MESSAGES[loadingMessageIndex]}
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="no-print"
            style={{
              marginTop: "2rem",
              width: "100%",
              maxWidth: "672px",
              borderRadius: "1rem",
              border: "1px solid #FCA5A5",
              background: "#FEF2F2",
              padding: "1.25rem 1.5rem",
              color: "#B91C1C",
              fontSize: "0.9375rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <NanIcon name="alert-triangle" size={12} /> {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && <TripResult result={result} />}
      </section>
    </>
  );
}

/* ─── Nan-themed wrapper around PlanForm ─── */
function PlanFormNanTheme({
  onSubmit,
  isLoading,
}: {
  onSubmit: (v: PlanFormValues) => void;
  isLoading: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "1.5rem",
        border: "1px solid rgba(82,183,136,0.25)",
        boxShadow: "0 4px 40px rgba(45,106,79,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--nan-sprout), var(--nan-wheat))",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(82,183,136,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <NanIcon name="map" size={14} />
        <div>
          <div style={{ fontWeight: 700, color: "var(--nan-bark)", fontSize: "1.125rem" }}>
            วางแผนทริปของคุณ
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--nan-stone)" }}>กรอกข้อมูลเพื่อให้ AI สร้างแผนทริปเฉพาะสำหรับคุณ</div>
        </div>
      </div>
      <div style={{ padding: "0" }}>
        <PlanForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
