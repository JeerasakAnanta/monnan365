"use client";

import { useEffect, useState, useCallback } from "react";
import { NanIcon } from "@/components/Icon";

type Attraction = {
  id: string;
  name: string;
  district: string | null;
  category: string[];
  months_best: number[];
  season_note: string | null;
  is_secondary: boolean;
  is_community: boolean;
  budget_level: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  contact: string | null;
  image_url: string | null;
};

const CATEGORIES = ["nature", "culture", "food", "wellness", "community"];
const BUDGET_LEVELS = ["low", "mid", "premium"];
const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

const EMPTY: Attraction = {
  id: "", name: "", district: "", category: [], months_best: [],
  season_note: "", is_secondary: false, is_community: false,
  budget_level: "low", lat: null, lng: null, description: "", contact: "",
  image_url: "",
};

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Attraction | null>(null);
  const [form, setForm] = useState<Attraction>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/attractions");
    if (res.ok) {
      setAttractions(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = attractions.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.district ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function startEdit(a: Attraction) {
    setEditing(a);
    setForm({ ...a });
    setMessage("");
  }

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, id: `custom-${Date.now()}` });
    setMessage("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/attractions/${editing.id}` : "/api/admin/attractions";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("บันทึกสำเร็จ");
      setEditing(null);
      setForm(EMPTY);
      load();
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบรายการนี้?")) return;
    const res = await fetch(`/api/admin/attractions/${id}`, { method: "DELETE" });
    if (res.ok) {
      load();
      if (editing?.id === id) { setEditing(null); setForm(EMPTY); }
    }
  }

  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      category: f.category.includes(cat)
        ? f.category.filter((c) => c !== cat)
        : [...f.category, cat],
    }));
  }

  function toggleMonth(m: number) {
    setForm((f) => ({
      ...f,
      months_best: f.months_best.includes(m)
        ? f.months_best.filter((n) => n !== m)
        : [...f.months_best, m].sort((a, b) => a - b),
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/attractions/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm((f) => ({ ...f, image_url: url }));
      } else {
        const err = await res.json();
        setMessage(`Upload error: ${err.error}`);
      }
    } catch {
      setMessage("Upload failed");
    }
    setUploading(false);
  }

  if (loading) return <div style={{ color: "var(--nan-stone)" }}>กำลังโหลด...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h1 style={{ fontSize: "1.5rem", color: "var(--nan-bark)", fontWeight: 700 }}>
          Attractions ({filtered.length})
        </h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา..."
            style={{
              padding: "0.5rem 0.875rem",
              borderRadius: "0.75rem",
              border: "1.5px solid var(--nan-smoke)",
              fontSize: "0.85rem",
              outline: "none",
              width: "200px",
            }}
          />
          <button onClick={startNew} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            + New
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--nan-smoke)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--nan-bark)" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--nan-bark)" }}>District</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--nan-bark)" }}>Type</th>
                <th style={{ padding: "0.5rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  style={{
                    borderBottom: "1px solid var(--nan-smoke)",
                    cursor: "pointer",
                    background: editing?.id === a.id ? "var(--nan-sprout)" : "transparent",
                  }}
                  onClick={() => startEdit(a)}
                >
                  <td style={{ padding: "0.5rem", color: "var(--nan-bark)" }}>{a.name}</td>
                  <td style={{ padding: "0.5rem", color: "var(--nan-stone)" }}>{a.district}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      {a.is_secondary && <span style={{ fontSize: "0.65rem", background: "var(--nan-wheat)", padding: "0.1rem 0.4rem", borderRadius: "99px", color: "var(--nan-earth)" }}>รอง</span>}
                      {a.is_community && <span style={{ fontSize: "0.65rem", background: "#E0F2FE", padding: "0.1rem 0.4rem", borderRadius: "99px", color: "#0369A1" }}>ชุมชน</span>}
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: "0.25rem" }}
                    >
                      <NanIcon name="trash-2" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form */}
        {form.id && (
          <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem", maxHeight: "70vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1rem", color: "var(--nan-bark)", fontWeight: 600, marginBottom: "1rem" }}>
              {editing ? "Edit" : "New"} Attraction
            </h2>

            {/* Image Upload */}
            <div style={{ marginBottom: "1rem" }}>
              {form.image_url ? (
                <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "0.5rem" }}>
                  <img
                    src={form.image_url}
                    alt={form.name}
                    style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                  />
                  <button
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    style={{
                      position: "absolute", top: "0.5rem", right: "0.5rem",
                      background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "0.375rem",
                      width: "28px", height: "28px", display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer", color: "#fff",
                    }}
                  >
                    <NanIcon name="x" size={12} />
                  </button>
                </div>
              ) : (
                <label
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", height: "120px", borderRadius: "0.75rem",
                    border: "2px dashed var(--nan-smoke)", cursor: "pointer",
                    fontSize: "0.8rem", color: "var(--nan-stone)", gap: "0.5rem",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--nan-leaf)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--nan-smoke)"; }}
                >
                  <NanIcon name="image" size={20} />
                  {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่ออัปโหลดรูปภาพ"}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "ID", key: "id", type: "text", disabled: !!editing },
                { label: "Name", key: "name", type: "text" },
                { label: "District", key: "district", type: "text" },
                { label: "Description", key: "description", type: "textarea" },
                { label: "Season Note", key: "season_note", type: "textarea" },
                { label: "Contact", key: "contact", type: "text" },
                { label: "Latitude", key: "lat", type: "number" },
                { label: "Longitude", key: "lng", type: "number" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={(form as Record<string, unknown>)[field.key] as string ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      disabled={field.disabled}
                      rows={2}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1.5px solid var(--nan-smoke)", fontSize: "0.8rem", outline: "none", resize: "vertical" }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={(form as Record<string, unknown>)[field.key] as string ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      disabled={field.disabled}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1.5px solid var(--nan-smoke)", fontSize: "0.8rem", outline: "none" }}
                    />
                  )}
                </div>
              ))}

              {/* Budget */}
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>Budget</label>
                <select
                  value={form.budget_level}
                  onChange={(e) => setForm((f) => ({ ...f, budget_level: e.target.value }))}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1.5px solid var(--nan-smoke)", fontSize: "0.8rem" }}
                >
                  {BUDGET_LEVELS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--nan-bark)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_secondary} onChange={(e) => setForm((f) => ({ ...f, is_secondary: e.target.checked }))} />
                  Secondary
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--nan-bark)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_community} onChange={(e) => setForm((f) => ({ ...f, is_community: e.target.checked }))} />
                  Community
                </label>
              </div>

              {/* Categories */}
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>Categories</label>
                <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      style={{
                        padding: "0.25rem 0.625rem",
                        borderRadius: "99px",
                        border: `1.5px solid ${form.category.includes(c) ? "var(--nan-forest)" : "var(--nan-smoke)"}`,
                        background: form.category.includes(c) ? "var(--nan-forest)" : "#fff",
                        color: form.category.includes(c) ? "#fff" : "var(--nan-bark)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Months */}
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>Best Months</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.25rem" }}>
                  {MONTHS.map((m, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleMonth(i + 1)}
                      style={{
                        padding: "0.25rem",
                        borderRadius: "0.375rem",
                        border: `1.5px solid ${form.months_best.includes(i + 1) ? "var(--nan-forest)" : "var(--nan-smoke)"}`,
                        background: form.months_best.includes(i + 1) ? "var(--nan-sprout)" : "#fff",
                        color: form.months_best.includes(i + 1) ? "var(--nan-forest)" : "var(--nan-stone)",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {message && (
                <div style={{
                  fontSize: "0.8rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  color: message.startsWith("Error") ? "#DC2626" : "var(--nan-forest)",
                  background: message.startsWith("Error") ? "#FEF2F2" : "var(--nan-sprout)",
                }}>
                  {message}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setEditing(null); setForm(EMPTY); setMessage(""); }} className="btn-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
