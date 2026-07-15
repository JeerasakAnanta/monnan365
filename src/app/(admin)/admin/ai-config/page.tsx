"use client";

import { useEffect, useState, useCallback } from "react";

type ConfigItem = {
  id: string;
  value: unknown;
  description: string | null;
  updated_at: string;
};

export default function AdminAIConfigPage() {
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/ai-config");
    if (res.ok) {
      setConfig(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function updateValue(id: string, raw: string) {
    setConfig((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: raw } : c))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const payload: Record<string, unknown> = {};
    for (const c of config) {
      // Parse JSON values
      try {
        payload[c.id] = JSON.parse(String(c.value));
      } catch {
        payload[c.id] = String(c.value);
      }
    }

    const res = await fetch("/api/admin/ai-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage("บันทึกสำเร็จ");
      load();
    } else {
      setMessage("เกิดข้อผิดพลาด");
    }
    setSaving(false);
  }

  if (loading) return <div style={{ color: "var(--nan-stone)" }}>กำลังโหลด...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--nan-bark)", fontWeight: 700, marginBottom: "1.5rem" }}>
        AI Configuration
      </h1>

      <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.5rem", maxWidth: "700px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {config.map((item) => (
            <div key={item.id}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>
                {item.id}
              </label>
              {item.description && (
                <p style={{ fontSize: "0.7rem", color: "var(--nan-stone)", marginBottom: "0.375rem" }}>
                  {item.description}
                </p>
              )}
              {item.id === "system_prompt" ? (
                <textarea
                  value={String(item.value)}
                  onChange={(e) => updateValue(item.id, e.target.value)}
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    borderRadius: "0.5rem",
                    border: "1.5px solid var(--nan-smoke)",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              ) : (
                <input
                  type={item.id === "model" ? "text" : "number"}
                  value={String(item.value)}
                  onChange={(e) => updateValue(item.id, e.target.value)}
                  step={item.id === "temperature" ? "0.1" : "1"}
                  min={item.id === "temperature" ? "0" : undefined}
                  max={item.id === "temperature" ? "2" : undefined}
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    borderRadius: "0.5rem",
                    border: "1.5px solid var(--nan-smoke)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              )}
              <p style={{ fontSize: "0.65rem", color: "var(--nan-stone)", marginTop: "0.25rem" }}>
                Current: <code style={{ background: "var(--nan-sprout)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>
                  {typeof item.value === "string" && item.value.startsWith('"') ? JSON.parse(String(item.value)) : String(item.value)}
                </code>
              </p>
            </div>
          ))}

          {message && (
            <div style={{
              fontSize: "0.8rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              color: message.includes("Error") ? "#DC2626" : "var(--nan-forest)",
              background: message.includes("Error") ? "#FEF2F2" : "var(--nan-sprout)",
            }}>
              {message}
            </div>
          )}

          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ alignSelf: "flex-start" }}>
            {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          </button>
        </div>
      </div>
    </div>
  );
}
