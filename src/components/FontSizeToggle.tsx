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

  return (
    <div className="flex items-center gap-1" aria-label="ปรับขนาดตัวอักษร">
      <button
        type="button"
        aria-label="ลดขนาดตัวอักษร"
        disabled={index <= 0}
        onClick={() => onChange(SCALES[Math.max(index - 1, 0)])}
        className="rounded-full border border-black/15 px-2.5 py-1 text-xs font-medium disabled:opacity-30 dark:border-white/20"
      >
        A-
      </button>
      <button
        type="button"
        aria-label="ขนาดตัวอักษรปกติ"
        onClick={() => onChange(1)}
        className="rounded-full border border-black/15 px-2.5 py-1 text-sm font-medium dark:border-white/20"
      >
        A
      </button>
      <button
        type="button"
        aria-label="เพิ่มขนาดตัวอักษร"
        disabled={index >= SCALES.length - 1}
        onClick={() => onChange(SCALES[Math.min(index + 1, SCALES.length - 1)])}
        className="rounded-full border border-black/15 px-2.5 py-1 text-base font-medium disabled:opacity-30 dark:border-white/20"
      >
        A+
      </button>
    </div>
  );
}
