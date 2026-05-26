"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// HERO SLIDES
// Add id="hero-top" to the section so navbar "Home" button can scroll here
// "Explore" button scrolls down to ExploreCities section (id="explore-cities")
// ─────────────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    city: "MUMBAI",
    tagline: "Skip the tourist traps.",
    accent: "Find the real India.",
    sub: "Loud, fast, unforgettable.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=80",
  },
  {
    city: "KERALA",
    tagline: "Slow down by the water.",
    accent: "Breathe a different India.",
    sub: "Backwaters. Spice. Silence.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80",
  },
  {
    city: "JAIPUR",
    tagline: "Walk where kings walked.",
    accent: "Live the city in pink.",
    sub: "Old walls. New stories. One city.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[active];

  // ── Scroll down to ExploreCities section ──────────────────────────────────
  const handleExploreClick = (e) => {
    e.preventDefault();
    const el = document.getElementById("explore-cities");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // id="hero-top" → navbar "Home" button scrolls here
    <section
      id="hero-top"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 640,
        overflow: "hidden",
        color: "#fff",
        background: "#0E0E10",
      }}
    >
      {/* Slideshow background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(14,14,16,0.55) 0%, rgba(14,14,16,0.35) 40%, rgba(14,14,16,0.85) 100%)",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative", zIndex: 2,
          maxWidth: 1240, margin: "0 auto",
          padding: "9rem 1.5rem 4rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          height: "100%", justifyContent: "center",
        }}
      >
        {/* Welcome label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.85rem", letterSpacing: "0.2em",
            textTransform: "uppercase", marginBottom: "0.5rem",
          }}
        >
          Welcome to
        </motion.p>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 800, margin: 0 }}
        >
          Yatri<span style={{ color: "#F97316" }}>guide</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          key={slide.city}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: "1.5rem", fontSize: "1.4rem", fontWeight: 400 }}
        >
          {slide.tagline}{" "}
          <span style={{ color: "#F97316", fontWeight: 600 }}>{slide.accent}</span>
        </motion.p>

        <motion.p
          key={slide.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ marginTop: "0.5rem", fontSize: "1rem" }}
        >
          {slide.sub}
        </motion.p>

        {/* Explore button → scrolls to ExploreCities */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ marginTop: "2.5rem" }}
        >
          <a
            href="#explore-cities"
            onClick={handleExploreClick}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#F97316",
              padding: "0.9rem 1.6rem", borderRadius: 999,
              color: "#fff", textDecoration: "none",
              fontWeight: 600, fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
              transition: "background .2s ease, transform .2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EA580C";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F97316";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: "2rem", display: "flex", gap: 8 }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8, height: 8,
                borderRadius: 4, padding: 0, border: "none",
                background: i === active ? "#F97316" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}