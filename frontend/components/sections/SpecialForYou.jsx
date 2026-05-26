"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { placeService, getPlaceImage } from "@/services/place.service";

const BUTTON_LABELS = {
  monument: "DISCOVER",
  temple: "VISIT",
  museum: "EXPLORE",
  park: "WANDER",
  beach: "ESCAPE",
  heritage: "UNCOVER",
  "religious-site": "VISIT",
  viewpoint: "SEE IT",
  nature: "EXPLORE",
  fort: "DISCOVER",
  cave: "EXPLORE",
  lake: "ESCAPE",
  waterfall: "ESCAPE",
  pilgrimage: "VISIT",
};

export default function SpecialForYou() {
  const [places, setPlaces] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    placeService.getFeatured().then(setPlaces).catch(console.error);
  }, []);

  const maxIndex = Math.max(0, places.length - visible);
  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxIndex, c + 1));
  const cardWidth = 100 / visible;

  return (
    <section style={{ background: "#FAFAF7", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.22em", color: "#F97316", fontWeight: 600, marginBottom: "0.8rem" }}>MUST VISIT</div>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", color: "#0E0E10" }}>
              Special <span style={{ color: "#F97316" }}>for you</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={prev} disabled={current === 0}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: current === 0 ? "#F9FAFB" : "#fff", cursor: current === 0 ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: current === 0 ? "#D1D5DB" : "#0E0E10", transition: "all 0.2s" }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} disabled={current === maxIndex}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: current === maxIndex ? "#F9FAFB" : "#F97316", cursor: current === maxIndex ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: current === maxIndex ? "#D1D5DB" : "#fff", transition: "all 0.2s" }}>
              <ChevronRight size={18} />
            </button>
            <Link href="/places" style={{ color: "#F97316", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              All places <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div style={{ overflow: "clip", padding: "0 2px" }}>
          <motion.div
            animate={{ x: `calc(-${current * cardWidth}% - ${current * 1.4 / visible}rem)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: "flex", gap: "1.4rem" }}
          >
            {places.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                style={{ minWidth: `calc(${cardWidth}% - ${1.4 * (visible - 1) / visible}rem)`, background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #ECECE8", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", flexShrink: 0 }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 220, backgroundImage: `url(${p.heroImage || getPlaceImage(p)})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "#F3F4F6" }}>
                  <span style={{ position: "absolute", top: 14, left: 14, background: "#F97316", color: "#fff", padding: "0.3rem 0.65rem", fontSize: "0.65rem", letterSpacing: "0.15em", fontWeight: 700, borderRadius: 6 }}>
                    FEATURED
                  </span>
                  <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.95)", color: "#0E0E10", padding: "0.3rem 0.6rem", fontSize: "0.78rem", fontWeight: 700, borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" /> {p.rating}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", color: "#9CA3AF", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {p.category.toUpperCase().replace("-", " ")}
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 1rem 0", color: "#0E0E10", lineHeight: 1.3 }}>
                    {p.name}
                  </h3>
                  {/* ONE link, ONE button label, nothing else */}
                  <Link
                    href={`/cities/${p.citySlug}/places/${p.slug}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F97316", color: "#fff", padding: "0.55rem 1rem", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}
                  >
                    {BUTTON_LABELS[p.category] || "EXPLORE"} <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        {places.length > visible && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "2rem" }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === current ? "#F97316" : "#E5E7EB", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}