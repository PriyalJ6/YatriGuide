"use client";

// =============================================================================
// FRONT / HOME PAGE — YatriGuide
// Drop this file at: frontend/app/page.js
// All section components live in: frontend/components/sections/*
// =============================================================================

import Hero from "@/components/sections/Hero";
import StatsBand from "@/components/sections/StatsBand";
import ExploreCities from "@/components/sections/ExploreCities";
import SpecialForYou from "@/components/sections/SpecialForYou";
import WhyUs from "@/components/sections/WhyUs";
import UpcomingEvents from "@/components/sections/UpcomingEvents.jsx";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main style={{ background: "var(--surface, #ffffff)", color: "var(--text, #111)" }}>
      <Hero />
      <StatsBand />
      <ExploreCities />
      <SpecialForYou />
      <UpcomingEvents />
      <Footer />
    </main>
  );
}

