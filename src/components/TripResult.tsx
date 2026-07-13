"use client";

import dynamic from "next/dynamic";
import type { PlanApiResponse } from "@/lib/types";
import type { MapPoint } from "@/components/TripMap";

const TripMap = dynamic(() => import("@/components/TripMap").then((m) => m.TripMap), {
  ssr: false,
});

export function TripResult({ result }: { result: PlanApiResponse }) {
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

  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col gap-6">
      <section className="rounded-2xl border border-emerald-600/20 bg-emerald-50 p-6 dark:bg-emerald-950/30">
        <h2 className="text-lg font-semibold">ทำไมเดือนนี้ถึงน่าไปน่าน</h2>
        <p className="mt-2 leading-relaxed">{result.summary}</p>
        {result.low_season_perks.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {result.low_season_perks.map((perk, i) => (
              <li
                key={i}
                className="rounded-full bg-emerald-600/10 px-3 py-1 text-sm text-emerald-800 dark:text-emerald-300"
              >
                ✓ {perk}
              </li>
            ))}
          </ul>
        )}
      </section>

      {points.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          <TripMap points={points} />
        </section>
      )}

      {result.days.map((day) => (
        <section key={day.day} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">วันที่ {day.day}</h3>
          <div className="flex flex-col gap-3">
            {day.items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {item.time}
                    </span>
                    <h4 className="font-semibold">{item.attraction?.name ?? item.id}</h4>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {item.attraction?.is_secondary && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        แหล่งท่องเที่ยวรอง
                      </span>
                    )}
                    {item.attraction?.is_community && (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                        ชุมชน
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{item.reason}</p>
                {item.tip && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    💡 {item.tip}
                  </p>
                )}
                {item.attraction?.contact && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    ติดต่อ: {item.attraction.contact}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
