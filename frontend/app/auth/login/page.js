"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Mail, Lock, Plane, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [form,   setForm]   = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [busy,   setBusy]   = useState(false);
  const [error,  setError]  = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // authStore.login returns { success, user } or { success: false, message }
      const result = await login(form);
      if (!result.success) throw new Error(result.message);
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0E0E10" }}>

      {/* ── LEFT — hero image (hidden on mobile) ────────────────────────── */}
      <div
        className="auth-visual"
        style={{
          flex: 1, position: "relative",
          backgroundImage: "url(https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(14,14,16,.4),rgba(14,14,16,.92))" }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem" }}>
          <div>
            <p style={{ color: "#F97316", letterSpacing: "0.3em", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: 10 }}>Welcome back</p>
            <h2 style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 480 }}>
              Your next <span style={{ color: "#F97316" }}>yatra</span> is one login away.
            </h2>
            <p style={{ marginTop: 14, color: "rgba(255,255,255,0.7)", maxWidth: 440 }}>
              Pick up right where you left off — your bookmarks, trips & notes are waiting.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT — form ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", background: "#0E0E10" }}>
        <form onSubmit={handleSubmit} data-testid="login-form" style={{ width: "100%", maxWidth: 420 }}>

         <h1 style={{
  fontSize: "2.25rem",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  marginBottom: 8,
  color: "#ffffff"
}}>Login in</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 30 }}>
            New here?{" "}
            <Link href="/auth/register" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>Create an account</Link>
          </p>

          {error && (
            <div data-testid="login-error" style={{ padding: "0.75rem 0.9rem", borderRadius: 10, background: "rgba(232,69,10,0.1)", border: "1px solid rgba(232,69,10,0.3)", color: "#FFB199", fontSize: "0.88rem", marginBottom: 18 }}>
              {error}
            </div>
          )}

          <Field icon={<Mail size={16} />} label="Email">
            <input
              type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              style={inputStyle}
              data-testid="login-email-input"
            />
          </Field>

          <Field icon={<Lock size={16} />} label="Password">
            <input
              type={showPw ? "text" : "password"} required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
              data-testid="login-password-input"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} style={eyeBtn}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <Link href="/auth/forgot-password" style={{ color: "#F97316", textDecoration: "none", fontSize: "0.85rem" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={busy} data-testid="login-submit" style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>
            {busy ? "Logging in…" : "Log in"}
          </button>

          <Divider label="OR CONTINUE WITH" />

          <button
            type="button"
            data-testid="login-google"
            onClick={() => alert("Wire this to your Google OAuth handler — your backend sets user.authProvider='google'.")}
            style={googleBtn}
          >
            <GoogleIcon /> Continue with Google
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 880px) { .auth-visual { display: none !important; } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #1a1a1c inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }
      `}</style>
    </div>
  );
}

// ── Reusable Field wrapper ───────────────────────────────────────────────────
function Field({ icon, label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 14px" }}>
        <span style={{ color: "#F97316", marginRight: 10, display: "inline-flex", flexShrink: 0 }}>{icon}</span>
        {children}
      </div>
    </label>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
      <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      {label}
      <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.4 26.7 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C40.5 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

const inputStyle = { flex: 1, padding: "0.95rem 0", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.95rem", minWidth: 0 };
const eyeBtn     = { background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, flexShrink: 0 };
const primaryBtn = { width: "100%", background: "#F97316", color: "#fff", border: "none", padding: "0.95rem", borderRadius: 12, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 30px rgba(249,115,22,0.35)", transition: "opacity .2s" };
const googleBtn  = { width: "100%", background: "#fff", color: "#1C1917", border: "none", padding: "0.85rem", borderRadius: 12, fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 };