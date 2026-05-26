"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Ticket, Star } from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_IMAGES = {
  sports:    "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
  comedy:    "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  concert:   "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
  festival:  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
  food:      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  art:       "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80",
  theatre:   "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  workshop:  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  other:     "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
};

const CATEGORY_COLORS = {
  sports:   "#F97316",
  comedy:   "#8B5CF6",
  concert:  "#EC4899",
  festival: "#F59E0B",
  food:     "#10B981",
  art:      "#3B82F6",
  theatre:  "#6366F1",
  workshop: "#0EA5E9",
  other:    "#6B7280",
};

const BUTTON_LABELS = {
  sports:   "JOIN",
  comedy:   "LAUGH",
  concert:  "ATTEND",
  festival: "CELEBRATE",
  food:     "TASTE",
  art:      "EXPLORE",
  theatre:  "WATCH",
  workshop: "LEARN",
  other:    "EXPLORE",
};

const getEventImage = (ev) =>
  ev.heroImage || CATEGORY_IMAGES[ev.category] || CATEGORY_IMAGES.other;

const fmtDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    d: String(d.getDate()).padStart(2, "0"),
    m: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
  };
};

const fmtPrice = (ticketPrice) => {
  if (!ticketPrice || ticketPrice.isFree) return "Free";
  if (ticketPrice.min === 0 && ticketPrice.max === 0) return "Free";
  if (ticketPrice.min) return `₹${ticketPrice.min.toLocaleString()}+`;
  return "Paid";
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const autoRef = useRef(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  // ── Responsive visible count ───────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Fetch real events ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${apiBase}/events?when=upcoming&limit=12&sort=date`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setEvents(data?.data?.events || []))
      .catch(() => setEvents([]));
  }, [apiBase]);

  const maxIndex = Math.max(0, events.length - visible);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  // ── Auto-play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || events.length === 0) return;
    autoRef.current = setInterval(next, 3000);
    return () => clearInterval(autoRef.current);
  }, [isPaused, events.length, next]);

  const cardWidth = 100 / visible;

  if (events.length === 0) return null;

  return (
    <section style={{ background: "#fff", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.22em", color: "#F97316", fontWeight: 600, marginBottom: "0.8rem" }}>WHAT&apos;S HAPPENING</div>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", color: "#0E0E10" }}>
              Upcoming <span style={{ color: "#F97316" }}>events</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={prev}
              disabled={current === 0}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: current === 0 ? "#F9FAFB" : "#fff", cursor: current === 0 ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: current === 0 ? "#D1D5DB" : "#0E0E10", transition: "all 0.2s" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#F97316", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s" }}
            >
              <ChevronRight size={18} />
            </button>
            <Link href="/events" style={{ color: "#F97316", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              All events <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── Slider ── */}
        <div
          style={{ overflow: "clip", padding: "0 2px" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            animate={{ x: `calc(-${current * cardWidth}% - ${current * 1.4 / visible}rem)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: "flex", gap: "1.4rem" }}
          >
            {events.map((ev, i) => {
              const date = fmtDate(ev.startDate);
              const price = fmtPrice(ev.ticketPrice);
              const catColor = CATEGORY_COLORS[ev.category] || "#6B7280";
              const btnLabel = BUTTON_LABELS[ev.category] || "EXPLORE";

              return (
                <motion.article
                  key={ev.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  style={{
                    minWidth: `calc(${cardWidth}% - ${1.4 * (visible - 1) / visible}rem)`,
                    background: "#fff",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid #ECECE8",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                    flexShrink: 0,
                  }}
                >
                  {/* Image — same height as SpecialForYou */}
                  <div style={{
                    position: "relative",
                    height: 220,
                    backgroundImage: `url(${getEventImage(ev)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#F3F4F6",
                  }}>
                    {/* Category badge — top left, matching SpecialForYou FEATURED badge style */}
                    <span style={{
                      position: "absolute", top: 14, left: 14,
                      background: catColor,
                      color: "#fff",
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.65rem", letterSpacing: "0.15em", fontWeight: 700, borderRadius: 6,
                    }}>
                      {ev.category.toUpperCase()}
                    </span>

                    {/* Price badge — top right, matching SpecialForYou rating badge style */}
                    <span style={{
                      position: "absolute", top: 14, right: 14,
                      background: price === "Free" ? "#10B981" : "rgba(255,255,255,0.95)",
                      color: price === "Free" ? "#fff" : "#0E0E10",
                      padding: "0.3rem 0.6rem",
                      fontSize: "0.78rem", fontWeight: 700, borderRadius: 999,
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}>
                      <Ticket size={11} /> {price}
                    </span>
                  </div>

                  {/* Content — mirrors SpecialForYou structure exactly */}
                  <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
                    {/* Date line */}
                    <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", color: "#9CA3AF", fontWeight: 600, marginBottom: "0.4rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: catColor }}>{date.d} {date.m}</span>
                      <span>·</span>
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 160 }}>
                        {ev.venue?.address?.split(",").slice(-2).join(",").trim()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: "1.15rem", fontWeight: 700, margin: "0.3rem 0 1rem 0", color: "#0E0E10", lineHeight: 1.3,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {ev.name}
                    </h3>

                    {/* CTA — identical pill to SpecialForYou */}
                    <Link
                      href={`/cities/${ev.citySlug}/events/${ev.slug}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "#F97316", color: "#fff",
                        padding: "0.55rem 1rem", borderRadius: 999,
                        fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
                        textDecoration: "none",
                      }}
                    >
                      {btnLabel} <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* ── Dots ── */}
        {events.length > visible && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "2rem" }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === current ? "#F97316" : "#E5E7EB", cursor: "pointer", transition: "all 0.3s", padding: 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}