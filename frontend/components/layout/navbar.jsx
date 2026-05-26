"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plane, ChevronDown, MapPin, Bookmark, Search, Menu, X } from "lucide-react";
import useAuthStore from "@/store/authStore";
import useCityStore from "@/store/cityStore";

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR — fully wired
// All buttons work. Cities come from DB via useCityStore (not hardcoded).
// ─────────────────────────────────────────────────────────────────────────────

const navLink = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 500,
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  padding: 0,
};

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  // ── Stores ────────────────────────────────────────────────────────────────
  const { user, isLoggedIn, logout } = useAuthStore();
  const { allCities, setCity }       = useCityStore();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [scrolled,     setScrolled]     = useState(false);
  const [dropOpen,     setDropOpen]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const dropRef  = useRef(null);
  const drawerRef = useRef(null);

  // ── Is home page? (transparent navbar over hero) ─────────────────────────
  const isHome = pathname === "/";

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  // ── Navbar background ─────────────────────────────────────────────────────
  // On homepage: transparent until scrolled
  // On other pages: always dark glass
  const showSolid = !isHome || scrolled || mobileOpen;

  // ── Scroll to section on homepage ────────────────────────────────────────
  // Used by "Home" link and "Explore" button in hero
  const scrollToSection = (id) => {
    if (pathname !== "/") {
      // Not on home page → navigate home first, then scroll
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ── Handle city click ─────────────────────────────────────────────────────
  const handleCityClick = (city) => {
    setCity(city);               // save to global store
    setDropOpen(false);
    setMobileOpen(false);
    router.push(`/cities/${city.slug}`);
  };

  // ── Handle logout ─────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    setDrawerOpen(false);
    router.push("/");
  };

  // ── User initials ─────────────────────────────────────────────────────────
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.username?.[0]?.toUpperCase() || "U";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: showSolid ? "rgba(14,14,16,0.92)" : "transparent",
          backdropFilter: showSolid ? "blur(12px)" : "none",
          WebkitBackdropFilter: showSolid ? "blur(12px)" : "none",
          borderBottom: showSolid ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            padding: "0.9rem 1.5rem",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "2rem",
          }}
        >
          {/* ── LOGO ───────────────────────────────────────────────────── */}
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              color: "#fff", textDecoration: "none",
              fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
              }}
            >
              <Plane size={18} color="#fff" style={{ transform: "rotate(-30deg)" }} />
            </span>
            Yatri<span style={{ color: "#F97316" }}>guide</span>
          </Link>

          {/* ── CENTER NAV (desktop) ────────────────────────────────────── */}
          <ul
            className="nav-center"
            style={{
              display: "flex", listStyle: "none",
              margin: 0, padding: 0,
              gap: "2.2rem", alignItems: "center",
            }}
          >
            {/* Home → scrolls to top/hero */}
            <li>
              <button
                onClick={() => scrollToSection("hero-top")}
                style={navLink}
              >
                Home
              </button>
            </li>

            {/* Explore cities dropdown → cities from DB */}
            <li ref={dropRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                style={{
                  ...navLink,
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}
              >
                Explore cities
                <ChevronDown
                  size={15}
                  style={{
                    transition: "transform .25s ease",
                    transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 14px)",
                    left: "50%", transform: "translateX(-50%)",
                    background: "#0E0E10",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: "0.65rem",
                    minWidth: 240,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                    animation: "slideInDown 0.2s ease",
                    zIndex: 60,
                  }}
                >
                  {/* Section label */}
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", padding: "0.3rem 0.85rem 0.5rem", margin: 0, textTransform: "uppercase" }}>
                    Select a city
                  </p>

                  {allCities.length > 0 ? (
                    allCities.map((city) => (
                      <button
                        key={city._id}
                        onClick={() => handleCityClick(city)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "0.7rem 0.85rem", borderRadius: 9,
                          width: "100%", textAlign: "left",
                          background: "none", border: "none",
                          color: "rgba(255,255,255,0.85)",
                          cursor: "pointer", fontFamily: "inherit",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                      >
                        <MapPin size={14} color="#F97316" />
                        <div>
                          <div style={{ fontSize: "0.92rem", fontWeight: 600 }}>{city.name}</div>
                          <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{city.country || "India"}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p style={{ padding: "0.75rem 0.85rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                      Loading cities...
                    </p>
                  )}
                </div>
              )}
            </li>

            {/* About Us → separate page */}
            <li>
              <Link href="/about" style={navLink}>
                About us
              </Link>
            </li>
          </ul>

          {/* ── RIGHT SIDE ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>

            {isLoggedIn ? (
              <>
                {/* Bookmarks */}
                <Link
                  href="/bookmarks"
                  style={{ color: "#fff", position: "relative", display: "inline-flex" }}
                  aria-label="Bookmarks"
                >
                  <Bookmark size={20} />
                </Link>

                {/* Avatar → side drawer */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #F97316, #EA580C)",
                    border: "2px solid rgba(249,115,22,0.5)",
                    color: "#fff", fontSize: "0.8rem", fontWeight: 700,
                    cursor: "pointer", display: "inline-flex",
                    alignItems: "center", justifyContent: "center",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                  }}
                  aria-label="Profile"
                >
                  {initials}
                </button>
              </>
            ) : (
              <>
                {/* Login → /auth/login */}
                <Link href="/auth/login" style={navLink}>
                  Login
                </Link>

                {/* Sign Up → /auth/register */}
                <Link
                  href="/auth/register"
                  style={{
                    background: "#F97316", color: "#fff",
                    padding: "0.55rem 1.1rem", borderRadius: 999,
                    textDecoration: "none", fontSize: "0.88rem", fontWeight: 600,
                    boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
                    transition: "background 0.2s, transform 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#EA580C"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                display: "none", background: "none",
                border: "none", cursor: "pointer", color: "#fff",
                padding: 4,
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ───────────────────────────────────────────────── */}
        {mobileOpen && (
          <div
            style={{
              background: "rgba(14,14,16,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "1rem 1.5rem 1.5rem",
              display: "flex", flexDirection: "column", gap: "0.25rem",
            }}
          >
            <button onClick={() => { scrollToSection("hero-top"); setMobileOpen(false); }} style={{ ...navLink, padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left" }}>
              Home
            </button>

            {/* Mobile cities */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", fontWeight: 500, padding: "0.75rem 0 0.5rem", margin: 0 }}>
                Explore cities
              </p>
              <div style={{ paddingLeft: "0.75rem", display: "flex", flexDirection: "column", gap: 2 }}>
                {allCities.map((city) => (
                  <button
                    key={city._id}
                    onClick={() => handleCityClick(city)}
                    style={{ ...navLink, padding: "0.5rem 0", display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
                  >
                    <MapPin size={13} color="#F97316" /> {city.name}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/about" style={{ ...navLink, padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "block" }}>
              About us
            </Link>

            {!isLoggedIn && (
              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.75rem" }}>
                <Link href="/auth/login" style={{ flex: 1, textAlign: "center", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>
                  Login
                </Link>
                <Link href="/auth/register" style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "#F97316", borderRadius: 999, color: "#fff", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
                  Sign Up
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.75rem" }}>
                <Link href="/bookmarks" style={{ flex: 1, textAlign: "center", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>
                  Bookmarks
                </Link>
                <button onClick={() => { setMobileOpen(false); setDrawerOpen(true); }} style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "#F97316", borderRadius: 999, color: "#fff", border: "none", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Profile
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── PROFILE SIDE DRAWER ─────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 200, backdropFilter: "blur(2px)",
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Drawer panel */}
          <aside
            ref={drawerRef}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: 300, background: "#fff",
              zIndex: 201, display: "flex", flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
              animation: "slideInRight 0.3s ease",
            }}
          >
            {/* Drawer header */}
            <div style={{ background: "#0E0E10", padding: "1.5rem 1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>My Account</span>
                <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              {/* User info */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #F97316, #EA580C)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                  border: "2px solid rgba(249,115,22,0.4)", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", margin: 0 }}>
                    {user?.fullName || user?.username}
                  </p>
                  <p style={{ color: "#F97316", fontSize: "0.78rem", margin: "2px 0 0" }}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer navigation links */}
            <nav style={{ flex: 1, padding: "0.5rem 0", overflowY: "auto" }}>
              {[
                { emoji: "🗺", label: "My Trips",  href: "/savedTrip"  },
                { emoji: "📝", label: "Notes",     href: "/notes"      },
                { emoji: "🔖", label: "Bookmarks", href: "/bookmarks"  },
                { emoji: "👤", label: "Profile",   href: "/profile"    },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.9rem 1.25rem",
                    textDecoration: "none",
                    color: pathname === item.href ? "#F97316" : "#1C1917",
                    fontSize: "0.95rem", fontWeight: pathname === item.href ? 600 : 400,
                    background: pathname === item.href ? "#FFF0E8" : "transparent",
                    borderLeft: `3px solid ${pathname === item.href ? "#F97316" : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (pathname !== item.href) e.currentTarget.style.background = "#FAFAF7"; }}
                  onMouseLeave={(e) => { if (pathname !== item.href) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.emoji}</span>
                  {item.label}
                </Link>
              ))}

              <div style={{ height: 1, background: "#F0E0D0", margin: "0.5rem 1.25rem" }} />

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "0.9rem 1.25rem", width: "100%",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#E8450A", fontSize: "0.95rem", fontWeight: 500,
                  fontFamily: "inherit", textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FFF0E8"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <span style={{ fontSize: "1.1rem" }}>🚪</span>
                Logout
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
        @media (max-width: 820px) {
          .nav-center { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}