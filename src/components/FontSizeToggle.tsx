"use client";

const SCALES = [1, 1.125, 1.25] as const;

export function FontSizeToggle({
  scale,
  onChange,
}: {
  scale: number;
  onChange: (scale: number) => void;
}) {
  const index = SCALES.indexOf(scale as (typeof SCALES)[number]);

  const btnBase: React.CSSProperties = {
    borderRadius: "99px",
    border: "1.5px solid var(--nan-smoke)",
    background: "var(--nan-cream)",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontFamily: "'Sarabun', sans-serif",
    fontWeight: 500,
    color: "var(--nan-stone)",
    transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }} aria-label="ปรับขนาดตัวอักษร">
      <span style={{ fontSize: "0.75rem", color: "var(--nan-stone)", marginRight: "0.25rem" }}>ก</span>
      <button
        type="button"
        aria-label="ลดขนาดตัวอักษร"
        disabled={index <= 0}
        onClick={() => onChange(SCALES[Math.max(index - 1, 0)])}
        style={{ ...btnBase, fontSize: "0.75rem", opacity: index <= 0 ? 0.35 : 1 }}
        onMouseEnter={(e) => { if (index > 0) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-leaf)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-smoke)"; }}
      >
        A-
      </button>
      <button
        type="button"
        aria-label="ขนาดตัวอักษรปกติ"
        onClick={() => onChange(1)}
        style={{ ...btnBase, fontSize: "0.875rem" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-leaf)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-smoke)"; }}
      >
        A
      </button>
      <button
        type="button"
        aria-label="เพิ่มขนาดตัวอักษร"
        disabled={index >= SCALES.length - 1}
        onClick={() => onChange(SCALES[Math.min(index + 1, SCALES.length - 1)])}
        style={{ ...btnBase, fontSize: "1rem", opacity: index >= SCALES.length - 1 ? 0.35 : 1 }}
        onMouseEnter={(e) => { if (index < SCALES.length - 1) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-leaf)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-smoke)"; }}
      >
        A+
      </button>
    </div>
  );
}
