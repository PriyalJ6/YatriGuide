"use client";

import Link from "next/link";

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,12 2,6"/>
  </svg>
);

const COLUMNS = [
  { title: "DISCOVER", links: [
    { label: "Cities", href: "/cities" },
    { label: "Places", href: "/places" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Stays", href: "/stays" },
    { label: "Events", href: "/events" },
  ]},
  { title: "PLAN", links: [
    { label: "My Trips", href: "/trips" },
    { label: "Bookmarks", href: "/bookmarks" },
    { label: "Travel Guides", href: "/guides" },
    { label: "Itineraries", href: "/itineraries" },
  ]},
  { title: "COMPANY", links: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ]},
];

const SOCIAL_ICONS = [TwitterIcon, InstagramIcon, FacebookIcon, YoutubeIcon, MailIcon];

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0C", color: "#fff", padding: "5rem 1.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <style>{`
        .social-btn {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.06); color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background .2s; text-decoration: none;
        }
        .social-btn:hover { background: #F97316; }
        .footer-link { color: rgba(255,255,255,0.65); text-decoration: none; font-size: 0.92rem; transition: color .2s; }
        .footer-link:hover { color: #F97316; }
        @media (max-width: 820px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Yatri<span style={{ color: "#F97316" }}>guide</span>
            </div>
            <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", lineHeight: 1.65, maxWidth: 360 }}>
              Discover India one yatra at a time. Curated places, restaurants and stays — all verified by locals who live there.
            </p>
            <div style={{ marginTop: "1.4rem", display: "flex", gap: 12 }}>
              {SOCIAL_ICONS.map((Icon, i) => (
                <a key={i} href="#" className="social-btn">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: "0.78rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1.2rem", color: "#fff" }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l.label} style={{ marginBottom: "0.7rem" }}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.6rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>
          <div>© {new Date().getFullYear()} YatriGuide. Made with care for the curious traveller.</div>
          <div style={{ display: "flex", gap: "1.4rem" }}>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
            <Link href="/cookies" style={{ color: "inherit", textDecoration: "none" }}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}