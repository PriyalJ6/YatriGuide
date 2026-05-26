"use client";

import { motion } from "framer-motion";
import { Users, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: Users, title: "Curated by locals", body: "Every place on YatriGuide is hand-picked by people who actually live there — not a faceless algorithm.", cta: "200+ LOCAL CURATORS" },
  { icon: RefreshCw, title: "Always up to date", body: "Hours change. Restaurants close. Festivals move. We refresh entries weekly so you never get burned.", cta: "UPDATED WEEKLY" },
  { icon: ShieldCheck, title: "Plan with confidence", body: "No paywall, no spam, no fake reviews. Just real recommendations from real people who eat there on Tuesdays.", cta: "FREE TO USE" },
];

export default function WhyUs() {
  return (
    <section style={{ background: "#0E0E10", color: "#fff", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="whyus-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3rem", marginBottom: "4rem", alignItems: "end" }}>
          <div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.22em", color: "#F97316", fontWeight: 600, marginBottom: "0.8rem" }}>WHY US</div>
            <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Built by locals.
              <br />
              <span style={{ color: "#F97316" }}>For travellers.</span>
            </h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 520 }}>
            We don&apos;t scrape TripAdvisor. We don&apos;t trust 5-star reviews from people who never showed up. Every entry on YatriGuide is real, recent, and rated by someone who lives down the street.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem 1.6rem" }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(249,115,22,0.15)", color: "#F97316", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, marginBottom: "0.6rem" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>{f.body}</p>
                <div style={{ marginTop: "1.2rem", color: "#F97316", fontSize: "0.72rem", letterSpacing: "0.18em", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {f.cta} <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          .whyus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}