"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import useCityStore from "@/store/cityStore";

// ─────────────────────────────────────────────────────────────────────────────
// EXPLORE CITIES
//
// id="explore-cities" → Hero "Explore" button scrolls here
//
// Cities come from useCityStore (fetched from DB on app load in AuthProvider)
// NOT hardcoded — when you add Goa/Bangalore to DB it appears automatically
//
// Fallback images per city slug — add more as you add cities
// ─────────────────────────────────────────────────────────────────────────────

const CITY_IMAGES = {
  mumbai:    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
  delhi:     "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
  jaipur:    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  hyderabad: "https://images.unsplash.com/photo-1563461661026-49631dd5d68e?auto=format&fit=crop&w=1200&q=80",
  varanasi:  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
  goa:       "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  kerala:    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  // Add more as you add cities to your DB
};

// Fallback gradient if no image found for slug
const GRADIENTS = [
  "linear-gradient(135deg, #2d4a4e, #4A5759)",
  "linear-gradient(135deg, #4a2d2d, #E8450A)",
  "linear-gradient(135deg, #4a3d2d, #c9843a)",
  "linear-gradient(135deg, #2d3d4a, #4a3d4a)",
];

export default function ExploreCities() {
  const router = useRouter();
  const { allCities, setCity } = useCityStore();

  const handleCityClick = (city) => {
  setCity(city);
  router.push(`/cities/${city.slug}`);
};

  // Use DB cities if available, else show loading skeletons
  const citiesToShow = allCities.length > 0 ? allCities : [];

  return (
    // id="explore-cities" → Hero Explore button scrolls here
    <section id="explore-cities" style={{ background: "#fff", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.22em", color: "#F97316", fontWeight: 600, marginBottom: "0.8rem" }}>
              WHERE TO GO
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", color: "#0E0E10" }}>
              Explore <span style={{ color: "#F97316" }}>cities</span>
            </h2>
            <p style={{ marginTop: "0.8rem", color: "#6B7280", fontSize: "1rem", maxWidth: 520 }}>
              Pick a city. Start your yatra. Every stop verified by locals.
            </p>
          </div>
        </div>

        {/* City cards grid */}
        {citiesToShow.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
            {citiesToShow.map((city, i) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <button
                  onClick={() => handleCityClick(city)}
                  style={{
                    display: "block", position: "relative",
                    height: 360, borderRadius: 20, overflow: "hidden",
                    width: "100%", cursor: "pointer", border: "none", padding: 0,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* City background image */}
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      backgroundImage: CITY_IMAGES[city.slug]
                        ? `url(${CITY_IMAGES[city.slug]})`
                        : GRADIENTS[i % GRADIENTS.length],
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.6s ease",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.85) 100%)" }} />

                  {/* Arrow icon */}
                  <span
                    style={{
                      position: "absolute", top: 16, right: 16,
                      width: 38, height: 38, borderRadius: "50%",
                      background: "#F97316", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </span>

                  {/* City name + count */}
                  <div style={{ position: "absolute", left: 18, bottom: 18, color: "#fff", textAlign: "left" }}>
                    <div style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>
                      {city.name.toUpperCase()}
                    </div>
                    <div style={{ marginTop: 6, fontSize: "0.78rem", letterSpacing: "0.18em", opacity: 0.85 }}>
                      EXPLORE →
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          // Loading skeletons
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: 360, borderRadius: 20,
                  background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}