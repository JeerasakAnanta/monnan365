"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/admin/dashboard";
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email หรือ Password ไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setResetLoading(false);
      return;
    }

    setResetSent(true);
    setResetLoading(false);
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
            {showReset ? "รีเซ็ตรหัสผ่าน" : "เข้าสู่ระบบจัดการ"}
          </p>
        </div>

        {showReset ? (
          resetSent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", color: "var(--nan-forest)", background: "var(--nan-sprout)", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1rem" }}>
                ส่งลิงก์รีเซ็ตรหัสผ่านไปที่<br /><strong>{resetEmail}</strong><br />แล้ว กรุณาตรวจสอบอีเมล
              </div>
              <button
                onClick={() => { setShowReset(false); setResetSent(false); setError(""); }}
                className="btn-outline"
                style={{ width: "100%", padding: "0.625rem", fontSize: "0.9rem" }}
              >
                กลับไปเข้าสู่ระบบ
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.375rem" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="กรอก email ที่ใช้เข้าสู่ระบบ"
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
                disabled={resetLoading}
                className="btn-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {resetLoading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
              </button>

              <button
                type="button"
                onClick={() => { setShowReset(false); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--nan-stone)", fontSize: "0.8rem", cursor: "pointer", textAlign: "center" }}
              >
                กลับไปเข้าสู่ระบบ
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--nan-bark)", display: "block", marginBottom: "0.375rem" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={() => { setShowReset(true); setResetEmail(email); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--nan-forest)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            {error && (
              <div style={{ fontSize: "0.8rem", color: "#DC2626", background: "#FEF2F2", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
