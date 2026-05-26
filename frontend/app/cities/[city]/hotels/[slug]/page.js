"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Car,
  Coffee,
  Dumbbell,
  Heart,
  Hotel,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  Star,
  Wifi,
  Waves,
} from "lucide-react";
import { hotelService, getHotelImage } from "@/services/hotel.service";
import { Button } from "@/components/ui/button";

const fmtCity = (c = "") =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const AMENITY_ICONS = {
  wifi: Wifi,
  breakfast: Coffee,
  gym: Dumbbell,
  pool: Waves,
  parking: Car,
  spa: Sparkles,
};

const iconFor = (a) => {
  const k = (a || "").toLowerCase();
  for (const key in AMENITY_ICONS) if (k.includes(key)) return AMENITY_ICONS[key];
  return Hotel;
};

export default function HotelDetailPage() {
  const { city, slug } = useParams();
  const [h, setH] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    hotelService
      .getBySlug(city, slug)
      .then(setH)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, slug]);

  if (loading) return <DetailSkeleton />;
  if (!h) return <NotFound type="Hotel" backHref={`/cities/${city}/hotels`} />;

  const heroUrl = getHotelImage(h);
  const price = h.priceRange?.min
    ? `₹${h.priceRange.min.toLocaleString()}`
    : "Check price";

  const handleShare = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="min-h-screen bg-[#F7FBFA] pt-[4.5rem] text-[#102A2A]">
      <section className="relative overflow-hidden bg-[#EAF6F3]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_28%),radial-gradient(circle_at_90%_10%,#BFE3DC_0,transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
          <div className="mb-7 flex items-center justify-between">
            <Link
              href={`/cities/${city}/hotels`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#476764] hover:text-[#0F766E]"
            >
              <ArrowLeft size={16} />
              All stays
            </Link>

            <div className="flex gap-2">
              <IconButton onClick={() => setSaved((s) => !s)} label="Save">
                <Heart size={17} className={saved ? "fill-[#0F766E]" : ""} />
              </IconButton>
              <IconButton onClick={handleShare} label="Share">
                <Share2 size={16} />
              </IconButton>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[92px_minmax(0,1fr)_520px] lg:items-center">
            <div className="hidden lg:block">
              <div className="flex h-[420px] w-full items-center justify-center rounded-full border border-[#BFE3DC] bg-white/55">
                <span className="-rotate-90 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.34em] text-[#0F766E]">
                  Stay in {fmtCity(city)}
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {h.type && (
                  <span className="rounded-full bg-[#0F766E] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                    {h.type}
                  </span>
                )}
                {h.stars > 0 && (
                  <span className="rounded-full border border-[#BFE3DC] bg-white px-3 py-1 text-sm font-black text-[#8A5A10]">
                    {"★".repeat(h.stars)}
                  </span>
                )}
                {h.rating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFE3DC] bg-white px-3 py-1 text-sm font-black text-[#0B4F49]">
                    <Star size={13} fill="#D99A2B" color="#D99A2B" />
                    {h.rating}
                  </span>
                )}
              </div>

              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#0F766E]">
                Curated stay
              </p>

              <h1 className="text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
                {h.name}
              </h1>

              {h.tagline && (
                <p className="mt-4 max-w-2xl text-xl font-semibold leading-8 text-[#28524F]">
                  {h.tagline}
                </p>
              )}

              {h.description && (
                <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-[#385F5C]">
                  {h.description.slice(0, 230)}
                  {h.description.length > 230 ? "..." : ""}
                </p>
              )}

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MiniFact icon={BedDouble} label="From" value={`${price}${h.priceRange?.min ? " / night" : ""}`} />
                {h.rating > 0 && <MiniFact icon={Star} label="Rating" value={`${h.rating}/5`} />}
                {h.address && <MiniFact icon={MapPin} label="City" value={fmtCity(city)} />}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -bottom-5 -left-5 z-10 hidden rounded-[1.25rem] border border-[#BFE3DC] bg-white p-4 shadow-[0_20px_50px_rgba(15,118,110,.16)] md:block">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0F766E]">
                  Quiet luxury
                </p>
                <p className="mt-1 text-sm font-bold text-[#102A2A]">
                  Comfort-first stay profile
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2.25rem] border border-[#BFE3DC] bg-white p-2 shadow-[0_28px_80px_rgba(15,118,110,.16)]">
                <img
                  src={heroUrl}
                  alt={h.name}
                  className="h-[350px] w-full rounded-[1.8rem] object-cover md:h-[520px]"
                />
                <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#0F766E] shadow-lg backdrop-blur">
                  {h.type || "Stay"}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[#BFE3DC] bg-white p-4 shadow-[0_18px_50px_rgba(15,118,110,.08)]">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0F766E]">
                  Ready to stay?
                </p>
                <p className="mt-1 font-bold text-[#102A2A]">
                  Check availability or open directions to the property.
                </p>
              </div>

              <a
                target="_blank"
                rel="noreferrer"
                href={
                  h.bookingUrl ||
                  `https://www.google.com/search?q=${encodeURIComponent(h.name + " booking")}`
                }
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0F766E] px-5 text-sm font-black text-white hover:bg-[#0B5F59]"
              >
                <CalendarDays size={15} className="mr-2" />
                Check availability
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  h.address || h.name
                )}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#BFE3DC] bg-[#F7FBFA] px-5 text-sm font-black text-[#0F766E] hover:bg-[#EAF6F3]"
              >
                <Navigation size={15} className="mr-2" />
                Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <section className="mb-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
              <div>
                <SectionLabel label="The mood" />
                <h2 className="text-3xl font-black tracking-tight">
                  A stay that feels considered, not crowded.
                </h2>
              </div>
              <p className="text-base font-medium leading-8 text-[#2D4E4B]">
                {h.description}
              </p>
            </section>

            {h.amenities?.length > 0 && (
              <section className="mb-12">
                <SectionLabel label="Amenities" />
                <h2 className="mb-6 text-3xl font-black tracking-tight">
                  What makes the stay comfortable
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {h.amenities.map((a, i) => {
                    const Icon = iconFor(a);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, delay: i * 0.035 }}
                        className="group rounded-[1.25rem] border border-[#BFE3DC] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0F766E] hover:shadow-[0_16px_36px_rgba(15,118,110,.1)]"
                      >
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF6F3] text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white">
                          <Icon size={19} />
                        </div>
                        <p className="font-black text-[#102A2A]">{a}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <SectionLabel label="Location" />
              <h2 className="mb-5 text-3xl font-black tracking-tight">Where you'll stay</h2>
              <div className="overflow-hidden rounded-[1.5rem] border border-[#BFE3DC] bg-white shadow-[0_14px_44px_rgba(15,118,110,.06)]">
                <iframe
                  title="map"
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    h.address || h.name
                  )}&output=embed&z=15`}
                />
              </div>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#BFE3DC] bg-white shadow-[0_24px_70px_rgba(15,118,110,.12)]">
              <div className="bg-[#0F3F3A] p-6 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8FE3D5]">
                  Room key
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-black">{price}</span>
                  {h.priceRange?.min && <span className="text-sm text-white/70">/ night</span>}
                </div>
              </div>

              <div className="divide-y divide-[#D9EEE9] p-6">
                {h.address && <SidebarItem icon={MapPin} label="Address" value={h.address} />}
                {h.rating > 0 && <SidebarItem icon={Star} label="Guest rating" value={`${h.rating}/5`} />}
                {h.stars > 0 && <SidebarItem icon={Hotel} label="Hotel class" value={`${h.stars}-star hotel`} />}

                <div className="space-y-3 pt-5">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      h.bookingUrl ||
                      `https://www.google.com/search?q=${encodeURIComponent(h.name + " booking")}`
                    }
                    className="flex min-h-11 items-center justify-center rounded-full bg-[#0F766E] px-5 text-sm font-black text-white hover:bg-[#0B5F59]"
                  >
                    Check availability
                  </a>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      h.address || h.name
                    )}`}
                    className="flex min-h-11 items-center justify-center rounded-full border border-[#BFE3DC] bg-white px-5 text-sm font-black text-[#0F766E] hover:bg-[#F0FAF7]"
                  >
                    Get directions
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function IconButton({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#BFE3DC] bg-white text-[#0F766E] shadow-sm hover:bg-[#F0FAF7]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-4 w-1 rounded-full bg-[#0F766E]" />
      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#0F766E]">
        {label}
      </span>
    </div>
  );
}

function MiniFact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1rem] border border-[#BFE3DC] bg-white/80 p-4">
      <Icon size={17} className="mb-3 text-[#0F766E]" />
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0F766E]">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-black text-[#102A2A]">{value}</p>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 py-5 first:pt-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6F3] text-[#0F766E]">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#0F766E]">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold leading-6 text-[#102A2A]">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#F7FBFA] pt-[4.5rem]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_520px]">
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-[#BFE3DC]" />
          <div className="h-4 w-full animate-pulse rounded-xl bg-[#BFE3DC]" />
          <div className="h-4 w-4/5 animate-pulse rounded-xl bg-[#BFE3DC]" />
        </div>
        <div className="h-[500px] animate-pulse rounded-[2rem] bg-[#BFE3DC]" />
      </div>
    </main>
  );
}

function NotFound({ type, backHref }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7FBFA] px-6 pt-32 text-center">
      <h1 className="text-3xl font-black text-[#102A2A]">{type} not found</h1>
      <p className="max-w-md text-[#476764]">
        We couldn't locate this {type.toLowerCase()}. The link may be outdated.
      </p>
      <Button asChild className="rounded-full bg-[#0F766E] hover:bg-[#0B5F59]">
        <Link href={backHref}>Back</Link>
      </Button>
    </main>
  );
}
