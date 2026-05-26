"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "52+", label: "CURATED PLACES" },
  { value: "84+", label: "RESTAURANTS" },
  { value: "151+", label: "STAYS & HOTELS" },
  { value: "25+", label: "LOCAL AGENCIES" },
];

export default function StatsBand() {
  return (
    <section style={{ background: "#0E0E10", color: "#fff", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)", fontWeight: 800, color: "#F97316", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {s.value}
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", letterSpacing: "0.16em", color: "rgba(255,255,255,0.7)" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}