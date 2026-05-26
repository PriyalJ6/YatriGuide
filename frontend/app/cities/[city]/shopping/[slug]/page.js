"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Train,
} from "lucide-react";
import { shoppingService, getShoppingImage } from "@/services/shopping.service";
import { Button } from "@/components/ui/button";

const fmtCity = (c = "") =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function ShoppingDetailPage() {
  const { city, slug } = useParams();
  const [m, setM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    shoppingService
      .getBySlug(city, slug)
      .then(setM)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, slug]);

  if (loading) return <DetailSkeleton />;
  if (!m) return <NotFound type="Market" backHref={`/cities/${city}/shopping`} />;

  const heroUrl = getShoppingImage(m);
  const budget =
    m.budgetRange?.min !== undefined
      ? `₹${m.budgetRange.min}${m.budgetRange.max ? ` – ₹${m.budgetRange.max}` : "+"}`
      : null;

  return (
    <main className="min-h-screen bg-[#FFF7FB] pt-[4.5rem] text-[#23131B]">
      <section className="border-b border-[#FBCFE8] bg-gradient-to-br from-[#FFF1F8] via-white to-[#FDF2F8]">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href={`/cities/${city}/shopping`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7F1D45] transition hover:text-[#DB2777]"
            >
              <ArrowLeft size={16} />
              All shopping
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => setSaved((s) => !s)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FBCFE8] bg-white text-[#9D174D] shadow-sm transition hover:bg-[#FDF2F8]"
                aria-label="Save market"
              >
                <Heart size={17} className={saved ? "fill-[#DB2777] text-[#DB2777]" : ""} />
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FBCFE8] bg-white text-[#9D174D] shadow-sm transition hover:bg-[#FDF2F8]"
                aria-label="Share market"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {m.type && (
                  <span className="rounded-full bg-[#DB2777] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                    {m.type.replace(/-/g, " ")}
                  </span>
                )}
                {m.rating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F9A8D4] bg-white px-3 py-1 text-sm font-bold text-[#831843]">
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    {m.rating}
                  </span>
                )}
              </div>

              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#DB2777]">
                {fmtCity(city)} shopping guide
              </p>

              <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-[#23131B] md:text-6xl">
                {m.name}
              </h1>

              {m.tagline && (
                <p className="mt-4 max-w-xl text-xl font-medium leading-8 text-[#7F1D45]">
                  {m.tagline}
                </p>
              )}

              {m.description && (
                <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#573142]">
                  {m.description.slice(0, 210)}
                  {m.description.length > 210 ? "..." : ""}
                </p>
              )}

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {m.openingHours && (
                  <MiniFact icon={Clock} label="Hours" value={m.openingHours} />
                )}
                {budget && <MiniFact icon={Tag} label="Budget" value={budget} />}
                {m.nearestStation && (
                  <MiniFact icon={Train} label="Nearest" value={m.nearestStation} />
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    m.address || m.name
                  )}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#DB2777] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(219,39,119,.22)] transition hover:bg-[#BE185D]"
                >
                  <Navigation size={15} className="mr-2" />
                  Get directions
                </a>

                {m.categories?.length > 0 && (
                  <a
                    href="#what-to-buy"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#F9A8D4] bg-white px-6 text-sm font-black text-[#BE185D] transition hover:bg-[#FDF2F8]"
                  >
                    <ShoppingBag size={15} className="mr-2" />
                    What to buy
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -left-5 top-8 z-10 hidden rounded-full bg-white px-4 py-2 text-sm font-black text-[#BE185D] shadow-[0_14px_34px_rgba(157,23,77,.16)] ring-1 ring-[#FBCFE8] md:block">
                Curated market pick
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[#FBCFE8] bg-white p-2 shadow-[0_24px_70px_rgba(157,23,77,.16)]">
                <div className="absolute inset-x-10 top-0 h-1 bg-gradient-to-r from-[#DB2777] via-[#F472B6] to-[#C084FC]" />
                <img
                  src={heroUrl}
                  alt={m.name}
                  className="h-[360px] w-full rounded-[1.55rem] object-cover md:h-[500px]"
                />

                <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/50 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#DB2777]">
                        Visit note
                      </p>
                      <p className="mt-1 text-sm font-bold leading-6 text-[#23131B]">
                        {m.bestTimeToVisit || m.knownFor || "Best explored slowly with time to browse."}
                      </p>
                    </div>
                    <Sparkles className="shrink-0 text-[#DB2777]" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {m.knownFor && (
            <section className="mb-12 rounded-[1.5rem] border border-[#FBCFE8] bg-white p-6 shadow-[0_12px_36px_rgba(157,23,77,.06)]">
              <SectionLabel label="Known for" />
              <p className="max-w-3xl text-xl font-bold leading-8 text-[#3B1828]">
                {m.knownFor}
              </p>
            </section>
          )}

          {m.categories?.length > 0 && (
            <section id="what-to-buy" className="mb-12">
              <SectionLabel label="What to buy" />
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="text-3xl font-black tracking-tight text-[#23131B]">
                  Bring home a piece of {fmtCity(city)}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {m.categories.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.28, delay: i * 0.04 }}
                    className="group flex items-center justify-between rounded-[1.25rem] border border-[#FBCFE8] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#F472B6] hover:shadow-[0_14px_34px_rgba(219,39,119,.1)]"
                  >
                    <span className="font-bold capitalize text-[#3B1828]">
                      {c.replace(/-/g, " ")}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF2F8] text-[#DB2777] transition group-hover:bg-[#DB2777] group-hover:text-white">
                      <Tag size={15} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {m.highlights?.length > 0 && (
            <section className="mb-12">
              <SectionLabel label="Highlights" />
              <h2 className="mb-6 text-3xl font-black tracking-tight text-[#23131B]">
                Must-see spots inside
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {m.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.28, delay: i * 0.04 }}
                    className="rounded-[1.25rem] border border-[#FBCFE8] bg-white p-5 shadow-[0_10px_30px_rgba(157,23,77,.04)]"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF2F8] text-[#DB2777]">
                      <Sparkles size={17} />
                    </div>
                    <h3 className="font-black text-[#23131B]">{h.name}</h3>
                    {h.description && (
                      <p className="mt-2 text-sm leading-6 text-[#6B3A4E]">
                        {h.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-12 grid gap-6 md:grid-cols-2">
            {m.openingHours && (
              <InfoPanel
                icon={Clock}
                label="Hours"
                title="When to visit"
                items={[
                  ["Opening hours", m.openingHours],
                  m.closedOn && ["Closed on", m.closedOn],
                  m.bestTimeToVisit && ["Best time", m.bestTimeToVisit],
                ].filter(Boolean)}
              />
            )}

            {(m.bestFor?.length > 0 || m.tips) && (
              <div className="rounded-[1.5rem] border border-[#FBCFE8] bg-[#FDF2F8] p-6">
                <SectionLabel label="Insider tips" />
                {m.tips && (
                  <p className="mb-5 text-sm font-medium leading-7 text-[#6B3A4E]">
                    {m.tips}
                  </p>
                )}
                {m.bestFor?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.bestFor.map((b, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[#9D174D] ring-1 ring-[#FBCFE8]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section>
            <SectionLabel label="Location" />
            <h2 className="mb-5 text-3xl font-black tracking-tight text-[#23131B]">
              Find the market
            </h2>
            <div className="overflow-hidden rounded-[1.5rem] border border-[#FBCFE8] bg-white shadow-[0_12px_36px_rgba(157,23,77,.06)]">
              <iframe
                title="map"
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  m.address || m.name
                )}&output=embed&z=15`}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="overflow-hidden rounded-[1.5rem] border border-[#FBCFE8] bg-white shadow-[0_20px_60px_rgba(157,23,77,.1)]">
            <div className="bg-[#831843] p-6 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F9A8D4]">
                Plan your visit
              </p>
              <h2 className="mt-2 text-xl font-black leading-tight">{m.name}</h2>
            </div>

            <div className="divide-y divide-[#FCE7F3] p-6">
              {m.address && (
                <SidebarItem icon={MapPin} label="Address" value={m.address} />
              )}

              {m.nearestStation && (
                <SidebarItem icon={Navigation} label="Nearest station" value={m.nearestStation} />
              )}

              {m.openingHours && (
                <SidebarItem
                  icon={Clock}
                  label="Hours"
                  value={m.openingHours}
                  note={m.closedOn ? `Closed: ${m.closedOn}` : ""}
                />
              )}

              {budget && <SidebarItem icon={Tag} label="Budget range" value={budget} />}

              <div className="pt-5">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    m.address || m.name
                  )}`}
                  className="flex min-h-11 items-center justify-center rounded-full bg-[#DB2777] px-5 text-sm font-black text-white transition hover:bg-[#BE185D]"
                >
                  <Navigation size={15} className="mr-2" />
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-4 w-1 rounded-full bg-[#DB2777]" />
      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#DB2777]">
        {label}
      </span>
    </div>
  );
}

function MiniFact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1rem] border border-[#FBCFE8] bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF2F8] text-[#DB2777]">
        <Icon size={16} />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9D174D]">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-black leading-5 text-[#23131B]">
        {value}
      </p>
    </div>
  );
}

function InfoPanel({ icon: Icon, label, title, items }) {
  return (
    <div className="rounded-[1.5rem] border border-[#FBCFE8] bg-white p-6 shadow-[0_12px_36px_rgba(157,23,77,.05)]">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#FDF2F8] text-[#DB2777]">
        <Icon size={18} />
      </div>
      <SectionLabel label={label} />
      <h3 className="mb-4 text-xl font-black text-[#23131B]">{title}</h3>
      <div className="divide-y divide-[#FCE7F3]">
        {items.map(([k, v], i) => (
          <div key={i} className="py-3 first:pt-0 last:pb-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9D174D]">
              {k}
            </p>
            <p className="mt-1 font-bold text-[#3B1828]">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, value, note }) {
  return (
    <div className="flex gap-3 py-5 first:pt-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDF2F8] text-[#DB2777]">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#9D174D]">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold leading-6 text-[#23131B]">{value}</p>
        {note && <p className="mt-1 text-xs font-semibold text-[#BE185D]">{note}</p>}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#FFF7FB] pt-[4.5rem]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_520px]">
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-[#FBCFE8]" />
          <div className="h-4 w-full animate-pulse rounded-xl bg-[#FBCFE8]" />
          <div className="h-4 w-4/5 animate-pulse rounded-xl bg-[#FBCFE8]" />
        </div>
        <div className="h-[500px] animate-pulse rounded-[2rem] bg-[#FBCFE8]" />
      </div>
    </main>
  );
}

function NotFound({ type, backHref }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF7FB] px-6 pt-32 text-center">
      <h1 className="text-3xl font-black text-[#23131B]">{type} not found</h1>
      <p className="max-w-md text-[#6B3A4E]">
        We couldn't locate this {type.toLowerCase()}. The link may be outdated.
      </p>
      <Button asChild className="rounded-full bg-[#DB2777] hover:bg-[#BE185D]">
        <Link href={backHref}>Back</Link>
      </Button>
    </main>
  );
}
