import WhyUs from "@/components/sections/WhyUs";
import Footer from "@/components/layout/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT US PAGE
// Route: /about
// Navbar "About Us" link goes here
// ─────────────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "About Us — YatriGuide",
  description: "Learn about YatriGuide and why we built it for Indian travellers",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: 64 }}>

      {/* Hero banner */}
      <section
        style={{
          background: "#0E0E10",
          padding: "6rem 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(249,115,22,0.08) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <p style={{ color: "#F97316", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
            Our Story
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800, color: "#fff",
              margin: "0 0 1.5rem",
              letterSpacing: "-0.03em", lineHeight: 1.05,
            }}
          >
            Built for the <span style={{ color: "#F97316" }}>curious</span> traveller
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.7, margin: 0 }}>
            YatriGuide was born from a simple frustration — finding authentic experiences 
            in Indian cities was hard. Tourist traps everywhere, real gems hidden. 
            We built this to fix that.
          </p>
        </div>
      </section>

      {/* Why Us section (reused from homepage) */}
      <WhyUs />

      {/* Mission section */}
      <section style={{ background: "#fff", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ color: "#F97316", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
              Our Mission
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0E0E10", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
              Make India easy to explore
            </h2>
            <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.75, marginBottom: "1rem" }}>
              India has 29 states, hundreds of cities, thousands of hidden gems. 
              Most travel apps show you the same 10 places everyone already knows.
            </p>
            <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.75 }}>
              YatriGuide is different. Every city page, every restaurant, every place 
              is curated with one question in mind: would a local recommend this?
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { value: "52+",   label: "Places",          color: "#F97316" },
              { value: "84+",   label: "Restaurants",     color: "#F97316" },
              { value: "151+",  label: "Hotels & Stays",  color: "#F97316" },
              { value: "25+",   label: "Travel Agencies", color: "#F97316" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#FFF8F0", border: "1px solid #F0E0D0",
                  borderRadius: 16, padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2.5rem", fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0.5rem 0 0" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}