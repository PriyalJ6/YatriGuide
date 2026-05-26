"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import {
  User,
  Mail,
  Lock,
  AtSign,
  Plane,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await register(form);

      if (!result.success) {
        throw new Error(result.message);
      }

      router.push("/auth/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0E0E10" }}>
      
      {/* LEFT SIDE */}
      <div
        className="auth-visual"
        style={{
          flex: 1,
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg,rgba(14,14,16,.45),rgba(14,14,16,.95))"
        }} />

        <div style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem",
        }}>
          <div>
            <p style={{
              color: "#F97316",
              letterSpacing: "0.3em",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Join Us
            </p>

            <h2 style={{
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 800,
              color: "#fff",
            }}>
              Start your next <span style={{ color: "#F97316" }}>journey</span>
            </h2>

            <p style={{
              marginTop: 14,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 440,
            }}>
              Create your account and explore trips & destinations.
            </p>
          </div>

          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
            India • Explore Bharat
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            marginBottom: 8,
            color: "#ffffff",
          }}>
            Create Account
          </h1>

          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 30 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#F97316", fontWeight: 600 }}>
              Login
            </Link>
          </p>

          {error && (
            <div style={{
              padding: "0.75rem",
              borderRadius: 10,
              background: "rgba(232,69,10,0.1)",
              border: "1px solid rgba(232,69,10,0.3)",
              color: "#FFB199",
              marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          <Field icon={<User size={16} />} label="Full Name">
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Enter full name"
              style={inputStyle}
            />
          </Field>

          <Field icon={<AtSign size={16} />} label="Username">
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              style={inputStyle}
            />
          </Field>

          <Field icon={<Mail size={16} />} label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </Field>

          <Field icon={<Lock size={16} />} label="Password">
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtn}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <button
            type="submit"
            disabled={busy}
            style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}
          >
            {busy ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* GLOBAL FIXES */}
      <style>{`
        @media (max-width: 880px) {
          .auth-visual {
            display:none !important;
          }
        }

        input {
          background: transparent !important;
          color: #fff !important;
        }

        input:focus,
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #141414 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        input::selection {
          background: #F97316;
          color: white;
        }

        input::placeholder {
          color: rgba(255,255,255,0.25);
        }
      `}</style>
    </div>
  );
}

/* FIELD */
function Field({ icon, label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{
        fontSize: "0.78rem",
        color: "rgba(255,255,255,0.6)",
        marginBottom: 6,
        display: "block",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}>
        {label}
      </span>

      <div style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "0 14px",
      }}>
        <span style={{ color: "#F97316", marginRight: 10 }}>
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}

const inputStyle = {
  flex: 1,
  padding: "0.95rem 0",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#fff",
};

const eyeBtn = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.4)",
  cursor: "pointer",
};

const primaryBtn = {
  width: "100%",
  background: "#F97316",
  color: "#fff",
  border: "none",
  padding: "0.95rem",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};