"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setValidSession(true);
      } else {
        setError("ลิงก์รีเซ็ตรหัสผ่านหมดอายุหรือไม่ถูกต้อง");
      }
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--nan-cream)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "1.25rem",
          border: "1.5px solid var(--nan-smoke)",
          boxShadow: "0 4px 32px rgba(45,106,79,0.08)",
          padding: "2.5rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              color: "var(--nan-forest)",
              fontWeight: 700,
            }}
          >
            MonNan365 Admin
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--nan-stone)", marginTop: "0.375rem" }}>
            ตั้งรหัสผ่านใหม่
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--nan-forest)", background: "var(--nan-sprout)", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1rem" }}>
              เปลี่ยนรหัสผ่านสำเร็จแล้ว
            </div>
            <button
              onClick={() => router.push("/admin/login")}
              className="btn-primary"
              style={{ width: "100%", padding: "0.625rem", fontSize: "0.9rem" }}
            >
              เข้าสู่ระบบ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.375rem" }}>
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.75rem",
                  border: "1.5px solid var(--nan-smoke)",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--nan-leaf)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--nan-smoke)"; }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.375rem" }}>
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.75rem",
                  border: "1.5px solid var(--nan-smoke)",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--nan-leaf)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--nan-smoke)"; }}
              />
            </div>

            {error && (
              <div style={{ fontSize: "0.8rem", color: "#DC2626", background: "#FEF2F2", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !validSession}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              style={{ background: "none", border: "none", color: "var(--nan-stone)", fontSize: "0.8rem", cursor: "pointer", textAlign: "center" }}
            >
              กลับไปเข้าสู่ระบบ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
