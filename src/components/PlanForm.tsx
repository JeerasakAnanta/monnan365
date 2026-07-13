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
      className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (styles.length === 0) return;
        onSubmit({ month, days, styles, budget });
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">เดือนที่เดินทาง</span>
          <select
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">จำนวนวัน</span>
          <select
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {d} วัน
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">งบประมาณ</span>
          <select
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 dark:border-white/15"
            value={budget}
            onChange={(e) => setBudget(e.target.value as BudgetLevel)}
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">สไตล์ที่สนใจ (เลือกได้หลายข้อ)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((opt) => {
            const active = styles.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggleStyle(opt.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-black/15 dark:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {styles.length === 0 && (
          <p className="mt-2 text-sm text-red-600">กรุณาเลือกอย่างน้อย 1 สไตล์</p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={isLoading || styles.length === 0}
        className="mt-8 w-full rounded-full bg-emerald-600 py-3 font-medium text-white transition-opacity disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {isLoading ? "กำลังวางแผน..." : "วางแผนทริป"}
      </button>
    </form>
  );
}
