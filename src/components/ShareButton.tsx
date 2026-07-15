"use client";

import { useState } from "react";
import type { PlanApiResponse } from "@/lib/types";
import { NanIcon } from "@/components/Icon";

type Status = "idle" | "saving" | "copied" | "shared" | "error";

const LABELS: Record<Status, string> = {
  idle: "แชร์แผนทริป",
  saving: "กำลังบันทึก...",
  copied: "คัดลอกลิงก์แล้ว",
  shared: "แชร์แล้ว",
  error: "เกิดข้อผิดพลาด ลองใหม่",
};

export function ShareButton({
  result,
  existingId,
}: {
  result: PlanApiResponse;
  existingId?: string;
}) {
  const [id, setId] = useState<string | null>(existingId ?? null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("saving");
    try {
      let shareId = id;
      if (!shareId) {
        const res = await fetch("/api/plan/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });
        if (!res.ok) throw new Error("Save failed");
        const data = await res.json();
        shareId = data.id as string;
        setId(shareId);
      }

      const url = `${window.location.origin}/plan/${shareId}`;

      if (navigator.share) {
        await navigator.share({ title: "แผนทริปน่าน", url });
        setStatus("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      }
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "saving"}
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
        cursor: status === "saving" ? "default" : "pointer",
        opacity: status === "saving" ? 0.6 : 1,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (status !== "saving") (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-leaf)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nan-smoke)";
      }}
    >
      <NanIcon name="share" size={14} />
      {LABELS[status]}
    </button>
  );
}
