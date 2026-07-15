"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
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
            เข้าสู่ระบบจัดการ
          </p>
        </div>

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
      </div>
    </div>
  );
}
