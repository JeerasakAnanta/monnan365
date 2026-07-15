"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

const ITEMS_PER_PAGE = 12;

const EMPTY: Attraction = {
  id: "", name: "", district: "", category: [], months_best: [],
  season_note: "", is_secondary: false, is_community: false,
  budget_level: "low", lat: null, lng: null, description: "", contact: "",
  image_url: "",
};

function validateForm(form: Attraction): string | null {
  if (!form.name.trim()) return "กรุณากรอกชื่อสถานที่";
  if (!form.id.trim()) return "กรุณากรอก ID";
  if (form.lat !== null && (form.lat < -90 || form.lat > 90)) return "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90";
  if (form.lng !== null && (form.lng < -180 || form.lng > 180)) return "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180";
  if (form.category.length === 0) return "กรุณาเลือกอย่างน้อย 1 Category";
  if (form.months_best.length === 0) return "กรุณาเลือกอย่างน้อย 1 เดือน";
  return null;
}

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Attraction | null>(null);
  const [form, setForm] = useState<Attraction>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const snapshotRef = useRef<string>("");

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);

  // Unsaved changes guard
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Warn on route change via beforeunload (covers browser navigation)
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function trackDirty(prev: Attraction, next: Attraction) {
    const changed = JSON.stringify(prev) !== JSON.stringify(next);
    setIsDirty(changed);
  }

  function startEdit(a: Attraction) {
    if (isDirty && !window.confirm("มีข้อมูลที่ยังไม่ได้บันทึก ต้องการเปลี่ยนรายการหรือไม่?")) return;
    setEditing(a);
    setForm({ ...a });
    snapshotRef.current = JSON.stringify(a);
    setIsDirty(false);
    setMessage("");
  }

  function startNew() {
    if (isDirty && !window.confirm("มีข้อมูลที่ยังไม่ได้บันทึก ต้องการสร้างใหม่หรือไม่?")) return;
    setEditing(null);
    const empty = { ...EMPTY };
    setForm(empty);
    snapshotRef.current = JSON.stringify(empty);
    setIsDirty(false);
    setMessage("");
  }

  function updateForm(patch: Partial<Attraction>) {
    setForm((f) => {
      const next = { ...f, ...patch };
      trackDirty({ ...EMPTY, ...JSON.parse(snapshotRef.current) }, next);
      return next;
    });
  }

  async function handleSave() {
    const validationError = validateForm(form);
    if (validationError) {
      setMessage(`Error: ${validationError}`);
      return;
    }

    setSaving(true);
    setMessage("");

    let body: Record<string, unknown>;
    let url: string;
    let method: string;

    if (editing) {
      // Update existing
      method = "PUT";
      url = `/api/admin/attractions/${editing.id}`;
      body = { ...form };
      if (editing.id !== form.id) {
        // ID changed: delete old + create new
        await fetch(`/api/admin/attractions/${editing.id}`, { method: "DELETE" });
        method = "POST";
        url = "/api/admin/attractions";
      }
    } else {
      // Create new — let server generate ID if empty
      method = "POST";
      url = "/api/admin/attractions";
      body = { ...form };
      if (!body.id || String(body.id).trim() === "") {
        delete body.id; // server will generate UUID
      }
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage("บันทึกสำเร็จ");
      setEditing(null);
      setForm(EMPTY);
      setIsDirty(false);
      snapshotRef.current = "";
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
      if (editing?.id === id) { setEditing(null); setForm(EMPTY); setIsDirty(false); }
    }
  }

  function toggleCategory(cat: string) {
    updateForm({ category: form.category.includes(cat) ? form.category.filter((c) => c !== cat) : [...form.category, cat] });
  }

  function toggleMonth(m: number) {
    updateForm({ months_best: form.months_best.includes(m) ? form.months_best.filter((n) => n !== m) : [...form.months_best, m].sort((a, b) => a - b) });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Error: ไฟล์ต้องเป็น JPG, PNG, WebP, หรือ GIF เท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Error: ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/attractions/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        updateForm({ image_url: url });
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
          <button
            onClick={() => window.open("/api/admin/attractions/export", "_blank")}
            className="btn-outline"
            style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
          >
            Export
          </button>
          <label className="btn-outline" style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem", cursor: "pointer" }}>
            Import
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  if (!Array.isArray(data)) { setMessage("Error: JSON ต้องเป็น array"); return; }
                  if (!confirm(`นำเข้า ${data.length} รายการ?`)) return;
                  const res = await fetch("/api/admin/attractions/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  const result = await res.json();
                  setMessage(`นำเข้าสำเร็จ ${result.updated} รายการ, error ${result.errors} รายการ`);
                  load();
                } catch { setMessage("Error: ไฟล์ JSON ไม่ถูกต้อง"); }
                e.target.value = "";
              }}
            />
          </label>
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
              {paged.map((a) => (
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

          {filtered.length > ITEMS_PER_PAGE && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--nan-stone)" }}>
              <span>
                {filtered.length} รายการ — หน้า {page}/{totalPages}
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "0.375rem 0.75rem", borderRadius: "0.5rem",
                    border: "1.5px solid var(--nan-smoke)", background: page === 1 ? "#f9fafb" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.8rem", color: "var(--nan-bark)",
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  ← ก่อนหน้า
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`e${i}`} style={{ padding: "0.375rem 0.5rem", color: "var(--nan-stone)" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        style={{
                          padding: "0.375rem 0.625rem", borderRadius: "0.5rem",
                          border: `1.5px solid ${page === p ? "var(--nan-forest)" : "var(--nan-smoke)"}`,
                          background: page === p ? "var(--nan-forest)" : "#fff",
                          color: page === p ? "#fff" : "var(--nan-bark)",
                          cursor: "pointer", fontSize: "0.8rem", fontWeight: page === p ? 600 : 400,
                        }}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "0.375rem 0.75rem", borderRadius: "0.5rem",
                    border: "1.5px solid var(--nan-smoke)", background: page === totalPages ? "#f9fafb" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "0.8rem", color: "var(--nan-bark)",
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  ถัดไป →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {form.id !== "" || !editing ? (
          <div style={{ background: "#fff", borderRadius: "1rem", border: "1.5px solid var(--nan-smoke)", padding: "1.25rem", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1rem", color: "var(--nan-bark)", fontWeight: 600 }}>
                {editing ? "Edit" : "New"} Attraction
              </h2>
              {isDirty && (
                <span style={{ fontSize: "0.75rem", color: "var(--nan-gold)", fontWeight: 500 }}>
                  มีการแก้ไข chưaบันทึก
                </span>
              )}
            </div>

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
                    onClick={() => updateForm({ image_url: "" })}
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
                { label: "Name *", key: "name", type: "text" },
                { label: "District", key: "district", type: "text" },
                { label: "Description", key: "description", type: "textarea" },
                { label: "Season Note", key: "season_note", type: "textarea" },
                { label: "Contact", key: "contact", type: "text" },
                { label: "Latitude (-90 to 90)", key: "lat", type: "number" },
                { label: "Longitude (-180 to 180)", key: "lng", type: "number" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={(form as Record<string, unknown>)[field.key] as string ?? ""}
                      onChange={(e) => {
                        const patch: Record<string, unknown> = { [field.key]: e.target.value };
                        updateForm(patch as Partial<Attraction>);
                      }}
                      disabled={field.disabled}
                      rows={2}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1.5px solid var(--nan-smoke)", fontSize: "0.8rem", outline: "none", resize: "vertical" }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={(form as Record<string, unknown>)[field.key] as string ?? ""}
                      onChange={(e) => {
                        const val = field.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value;
                        const patch: Record<string, unknown> = { [field.key]: val };
                        updateForm(patch as Partial<Attraction>);
                      }}
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
                  onChange={(e) => updateForm({ budget_level: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1.5px solid var(--nan-smoke)", fontSize: "0.8rem" }}
                >
                  {BUDGET_LEVELS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--nan-bark)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_secondary} onChange={(e) => updateForm({ is_secondary: e.target.checked })} />
                  Secondary
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--nan-bark)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_community} onChange={(e) => updateForm({ is_community: e.target.checked })} />
                  Community
                </label>
              </div>

              {/* Categories */}
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>Categories *</label>
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
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.25rem" }}>Best Months *</label>
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
                <button onClick={() => { setEditing(null); setForm(EMPTY); setIsDirty(false); snapshotRef.current = ""; setMessage(""); }} className="btn-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
