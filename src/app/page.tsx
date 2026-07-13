"use client";

import { useEffect, useState } from "react";
import { PlanForm, type PlanFormValues } from "@/components/PlanForm";
import { FontSizeToggle } from "@/components/FontSizeToggle";
import { TripResult } from "@/components/TripResult";
import type { PlanApiResponse } from "@/lib/types";

const LOADING_MESSAGES = [
  "กำลังสำรวจวัดภูมินทร์และเมืองเก่าน่าน...",
  "กำลังฟังเสียงต้มเกลือโบราณที่บ่อเกลือ...",
  "กำลังตามหาทะเลหมอกที่ดอยภูคา...",
  "กำลังชวนชุมชนไทลื้อมาทอเรื่องราวให้ฟัง...",
  "กำลังจัดเรียงเส้นทางให้เหมาะกับเดือนนี้...",
];

export default function Home() {
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
      if (!res.ok) {
        throw new Error(data.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
      setResult(data as PlanApiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:py-16">
      <header className="flex w-full max-w-2xl items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            น่าน ไร้ฤดู
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">Nan365 — วางแผนทริปน่านทุกเดือน</h1>
        </div>
        <FontSizeToggle scale={fontScale} onChange={setFontScale} />
      </header>

      <p className="mt-3 w-full max-w-2xl text-zinc-600 dark:text-zinc-400">
        บอกเดือนที่อยากไปและสไตล์ที่ชอบ ให้ AI ช่วยวางแผนทริปที่พาไปสัมผัสน่านนอกไฮซีซัน
        พร้อมพาไปรู้จักชุมชนและแหล่งท่องเที่ยวรอง
      </p>

      <div className="mt-8 w-full max-w-2xl">
        <PlanForm onSubmit={handleSubmit} isLoading={loading} />
      </div>

      {loading && (
        <div className="mt-10 flex w-full max-w-2xl flex-col items-center gap-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 w-full max-w-2xl rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {result && !loading && <TripResult result={result} />}
    </div>
  );
}
