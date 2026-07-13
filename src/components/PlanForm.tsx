"use client";

import { useState } from "react";
import { STYLE_OPTIONS, BUDGET_OPTIONS, type Style, type BudgetLevel } from "@/lib/types";

const MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export type PlanFormValues = {
  month: number;
  days: number;
  styles: Style[];
  budget: BudgetLevel;
};

const selectStyle: React.CSSProperties = {
  borderRadius: "0.625rem",
  border: "1.5px solid var(--nan-smoke)",
  background: "var(--nan-cream)",
  padding: "0.625rem 1rem",
  fontSize: "0.9375rem",
  color: "var(--nan-ink)",
  width: "100%",
  fontFamily: "'Sarabun', sans-serif",
  outline: "none",
  transition: "border-color 0.2s",
  cursor: "pointer",
  appearance: "auto",
};

export function PlanForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: PlanFormValues) => void;
  isLoading: boolean;
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [days, setDays] = useState(3);
  const [styles, setStyles] = useState<Style[]>(["culture"]);
  const [budget, setBudget] = useState<BudgetLevel>("mid");

  function toggleStyle(value: Style) {
    setStyles((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  return (
    <form
      style={{ padding: "1.75rem 2rem 2rem" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (styles.length === 0) return;
        onSubmit({ month, days, styles, budget });
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Month */}
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nan-bark)" }}>
            📅 เดือนที่เดินทาง
          </span>
          <select
            style={selectStyle}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--nan-leaf)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--nan-smoke)"; }}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </label>

        {/* Days */}
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nan-bark)" }}>
            🗓️ จำนวนวัน
          </span>
          <select
            style={selectStyle}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--nan-leaf)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--nan-smoke)"; }}
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>{d} วัน</option>
            ))}
          </select>
        </label>

        {/* Budget */}
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nan-bark)" }}>
            💰 งบประมาณ
          </span>
          <select
            style={selectStyle}
            value={budget}
            onChange={(e) => setBudget(e.target.value as BudgetLevel)}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--nan-leaf)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--nan-smoke)"; }}
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Styles */}
      <fieldset style={{ border: "none", marginTop: "1.75rem" }}>
        <legend style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nan-bark)", marginBottom: "0.75rem" }}>
          🎯 สไตล์ที่สนใจ (เลือกได้หลายข้อ)
        </legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {STYLE_OPTIONS.map((opt) => {
            const active = styles.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggleStyle(opt.value)}
                style={{
                  borderRadius: "99px",
                  border: active ? "2px solid var(--nan-forest)" : "1.5px solid var(--nan-smoke)",
                  padding: "0.4rem 1.1rem",
                  fontSize: "0.875rem",
                  fontFamily: "'Sarabun', sans-serif",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: active
                    ? "linear-gradient(135deg, var(--nan-forest), var(--nan-leaf))"
                    : "var(--nan-cream)",
                  color: active ? "#fff" : "var(--nan-stone)",
                  boxShadow: active ? "0 2px 12px rgba(45,106,79,0.25)" : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {styles.length === 0 && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#DC2626" }}>
            กรุณาเลือกอย่างน้อย 1 สไตล์
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={isLoading || styles.length === 0}
        className="btn-primary"
        style={{ marginTop: "2rem", width: "100%", fontSize: "1rem", padding: "0.875rem" }}
      >
        {isLoading ? "🔄 กำลังวางแผน..." : "🗺️ วางแผนทริปเลย"}
      </button>
    </form>
  );
}
