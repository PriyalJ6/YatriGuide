"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark, Utensils, Hotel, ShoppingBag,
  Calendar, Bus, MapPin, ArrowUpRight, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCityStore from "@/store/cityStore";

const CATEGORIES = [
  { key: "places",      label: "Places",      icon: Landmark,
    img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    desc: "Forts, monuments and views you'll never forget." },
  { key: "restaurants", label: "Restaurants", icon: Utensils,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    desc: "Where locals actually eat — not the tourist menus." },
  { key: "hotels",      label: "Stay",        icon: Hotel,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    desc: "Heritage palaces, boutique stays, clean hostels." },
  { key: "shopping",    label: "Shopping",    icon: ShoppingBag,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    desc: "Bazaars, boutiques and one-of-a-kind crafts." },
  { key: "events",      label: "Events",      icon: Calendar,
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    desc: "Concerts, walks and pop-ups happening this month." },
  { key: "transport",   label: "Transport",   icon: Bus,
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    desc: "Get around like a local — metro, autos, scooters." },
  { key: "agencies",    label: "Agencies",    icon: Briefcase,
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    desc: "Local travel agencies and tour operators to plan your trip." },
];

const FALLBACK = {
  mumbai:   "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=80",
  delhi:    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=80",
  jaipur:   "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=80",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=80",
  goa:      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80",
};

export default function CityOverviewPage() {
  const { city: citySlug } = useParams();
  const { fetchCityBySlug } = useCityStore();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCityBySlug(citySlug)
      .then(setCity).catch(() => setCity(null))
      .finally(() => setLoading(false));
  }, [citySlug]);

  if (loading) return <main className="bg-[#0B0B0D] min-h-screen"><Skeleton className="h-screen w-full bg-white/5" /></main>;
  if (!city) return (
    <main className="bg-[#0B0B0D] min-h-screen flex flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-4xl font-black">City not found</h1>
      <Button asChild className="bg-[#F97316] hover:bg-[#ea6a10] rounded-full"><Link href="/">Back home</Link></Button>
    </main>
  );

  const heroUrl = city.heroImage || city.coverImage || city.image || city.bannerImage || FALLBACK[citySlug] || FALLBACK.jaipur;
  const famousFor = city.famousFor || city.knownFor || ["Heritage", "Food", "Culture", "Markets"];

  // Helper to resolve href — agencies is global, everything else is city-scoped
  const getCategoryHref = (key) =>
    key === "agencies" ? "/agencies" : `/cities/${citySlug}/${key}`;

  return (
    <main className="bg-[#0B0B0D] text-white min-h-screen">
      {/* ─────── COMPACT CINEMATIC HERO ─────── */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: "easeOut" }}
          className="absolute inset-0"
          style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/50 to-[#0B0B0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/80 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-[#F97316]" />
              <span className="text-[0.7rem] tracking-[0.35em] text-[#F97316] font-bold uppercase">India · City Guide</span>
            </div>
            <h1 className="font-black tracking-[-0.04em] leading-[0.88]" style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}>
              {city.name}<span className="text-[#F97316]">.</span>
            </h1>
            {city.tagline && (
              <p className="mt-5 text-xl md:text-2xl italic font-light text-white/85 max-w-2xl">"{city.tagline}"</p>
            )}
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/70">
              <MapPin size={14} className="text-[#F97316]" />
              {city.state || ""}{city.state && city.country ? ", " : ""}{city.country || "India"}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────── STICKY CATEGORY NAVBAR ─────── */}
      <nav className="sticky top-[4.5rem] z-30 bg-[#0B0B0D]/95 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-2 md:px-6 flex gap-1 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.key} href={getCategoryHref(cat.key)}
                className="group relative inline-flex items-center gap-2.5 px-5 md:px-6 py-5 text-[0.92rem] font-semibold text-white/60 hover:text-[#F97316] transition whitespace-nowrap">
                <Icon size={16} /> {cat.label}
                <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-[#F97316] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─────── DESCRIPTION + FAMOUS FOR ─────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-[#F97316]/5 blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-[0.7rem] tracking-[0.35em] text-[#F97316] font-bold uppercase mb-5">─── About {city.name}</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[1.05] mb-10">
            What makes <span className="text-[#F97316] italic font-light">{city.name}</span><br/>unforgettable.
          </h2>
          <p className="text-xl md:text-2xl leading-[1.7] text-white/75 font-light max-w-3xl first-letter:text-7xl first-letter:font-black first-letter:text-[#F97316] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:mt-2">
            {city.about || `${city.name} is one of India's most vibrant destinations — a layered city that wears its history, food, and street life with confidence.`}
          </p>

          {/* Famous for chips */}
          <div className="mt-12">
            <div className="text-xs tracking-[0.25em] text-white/40 font-bold uppercase mb-4">Famous for</div>
            <div className="flex gap-2.5 flex-wrap">
              {famousFor.map((item) => (
                <span key={item} className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm font-medium hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── CATEGORY CARDS GRID ─────── */}
      <section className="pb-24 md:pb-32 border-t border-white/5 pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-[0.7rem] tracking-[0.35em] text-[#F97316] font-bold uppercase mb-4">─── Explore by category</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-14">
            Pick a path,<br/><span className="text-white/40">start your yatra.</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.key}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link href={getCategoryHref(cat.key)}
                    className="group relative block h-[340px] rounded-2xl overflow-hidden border border-white/10 hover:border-[#F97316]/60 transition-all duration-500">
                    {/* Image with zoom on hover */}
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${cat.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 group-hover:from-black/90 transition" />
                    {/* Orange accent on hover */}
                    <div className="absolute inset-0 bg-[#F97316]/0 group-hover:bg-[#F97316]/10 transition duration-500" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-7">
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md text-white inline-flex items-center justify-center group-hover:bg-[#F97316] transition">
                          <Icon size={20} />
                        </div>
                        <ArrowUpRight size={20} className="text-white/50 group-hover:text-[#F97316] group-hover:rotate-12 transition-all duration-300" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-[-0.02em] mb-2 group-hover:text-[#F97316] transition">{cat.label}</h3>
                        <p className="text-white/70 text-sm leading-relaxed max-w-xs">{cat.desc}</p>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition">
                          Explore {cat.label} →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 border border-[#F97316]/20"
               style={{ background: "radial-gradient(ellipse at top left, rgba(249,115,22,0.18), transparent 60%), linear-gradient(135deg, #15151A, #0E0E10)" }}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#F97316]/10 blur-[100px]" />
            <div className="relative">
              <h3 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 max-w-2xl">
                Save your favourites in {city.name}.<br/>
                <span className="text-white/40">Build a real itinerary.</span>
              </h3>
              <div className="flex gap-3 flex-wrap">
                <Button asChild className="bg-[#F97316] hover:bg-[#ea6a10] rounded-full h-12 px-7 font-bold shadow-[0_15px_40px_rgba(249,115,22,0.35)]">
                  <Link href="/auth/register">Create account <ArrowUpRight size={16} className="ml-1.5" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full h-12 px-7 font-semibold border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link href={`/cities/${citySlug}/places`}>Start exploring</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}