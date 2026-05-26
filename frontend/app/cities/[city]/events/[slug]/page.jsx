"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Star, Clock, Ticket, ArrowLeft,
  Share2, Heart, ChevronRight, Calendar,
  Navigation, ExternalLink, Tag, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtCity = (c = "") =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const CATEGORY_IMAGES = {
  sports:   "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  comedy:   "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  concert:  "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80",
  festival: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
  food:     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  art:      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=1200&q=80",
  theatre:  "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  other:    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
};

const CATEGORY_COLORS = {
  sports:   "#F97316",
  comedy:   "#8B5CF6",
  concert:  "#EC4899",
  festival: "#F59E0B",
  food:     "#10B981",
  art:      "#3B82F6",
  theatre:  "#6366F1",
  other:    "#6B7280",
};

const getEventImage = (ev) =>
  ev?.heroImage || CATEGORY_IMAGES[ev?.category] || CATEGORY_IMAGES.other;

const fmtDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
};

const fmtTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const fmtPrice = (ticketPrice) => {
  if (!ticketPrice || ticketPrice.isFree) return "Free Entry";
  if (ticketPrice.min === 0 && ticketPrice.max === 0) return "Free Entry";
  if (ticketPrice.min && ticketPrice.max && ticketPrice.min !== ticketPrice.max)
    return `₹${ticketPrice.min.toLocaleString()} – ₹${ticketPrice.max.toLocaleString()}`;
  if (ticketPrice.min) return `₹${ticketPrice.min.toLocaleString()}+`;
  return "Paid";
};

const calcDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const diff = (new Date(endDate) - new Date(startDate)) / 60000;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m} mins`;
  return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? "s" : ""}`;
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <main className="pt-[4.5rem] bg-white min-h-screen">
      <Skeleton className="h-[500px] w-full rounded-none" />
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </div>
    </main>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { city, slug } = useParams();
  const [event, setEvent]   = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]   = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/events/${city}/${slug}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setEvent(data?.data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, slug, apiBase]);

  useEffect(() => {
    if (!event) return;
    fetch(`${apiBase}/events?city=${city}&limit=4&sort=date`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const list = data?.data?.events || [];
        setNearby(list.filter((e) => e.slug !== slug).slice(0, 3));
      })
      .catch(() => {});
  }, [event, city, slug, apiBase]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: event?.name, url }); } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!event)
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900">Event not found</h1>
        <p className="text-neutral-500 max-w-md">This event may have ended or the link is outdated.</p>
        <Button asChild className="bg-[#F97316] hover:bg-[#ea6a10] rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </main>
    );

  const heroUrl   = getEventImage(event);
  const catColor  = CATEGORY_COLORS[event.category] || "#F97316";
  const isFree    = event.ticketPrice?.isFree || (event.ticketPrice?.min === 0 && event.ticketPrice?.max === 0);
  const duration  = calcDuration(event.startDate, event.endDate);
  const mapsQuery = encodeURIComponent(event.venue?.address || event.venue?.name || event.name);

  return (
    <main className="pt-[4.5rem] bg-white">

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section
        className="relative h-[62vh] min-h-[460px] w-full overflow-hidden"
        style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* top bar */}
        <div className="absolute top-5 left-0 right-0 z-10 px-5 md:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white text-sm font-medium bg-white/15 backdrop-blur-md hover:bg-white/25 transition px-4 py-2 rounded-full"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved((s) => !s)}
              aria-label="Save"
              className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition text-white"
            >
              <Heart size={17} className={saved ? "fill-[#F97316] text-[#F97316]" : ""} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share"
              className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition text-white"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* title block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 left-0 right-0 px-5 md:px-10 max-w-6xl mx-auto text-white"
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge
              className="text-white rounded-full px-3 py-1 text-[0.65rem] tracking-[0.2em] font-bold uppercase border-0"
              style={{ background: catColor }}
            >
              {event.category}
            </Badge>
            {isFree && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full px-3 py-1 text-sm font-semibold">
                Free Entry
              </span>
            )}
          </div>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {event.name}
          </h1>
          {event.venue?.name && (
            <p className="mt-3 text-white/85 italic text-lg max-w-2xl">{event.venue.name}</p>
          )}
          <div className="mt-6">
            <Breadcrumb>
              <BreadcrumbList className="text-white/70 text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-[#F97316] transition">
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/40" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-[#F97316] transition">
                    <Link href="/events">Events</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white/90">{event.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════ QUICK INFO BAND ════════════════════ */}
      <section className="bg-[#FAFAF7] border-b border-[#ECECE8]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600">
          {event.venue?.address && (
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-[#F97316]" /> {event.venue.address}
            </span>
          )}
          {event.startDate && (
            <span className="inline-flex items-center gap-2">
              <Calendar size={15} className="text-[#F97316]" /> {fmtDate(event.startDate)}
            </span>
          )}
          {event.startDate && (
            <span className="inline-flex items-center gap-2">
              <Clock size={15} className="text-[#F97316]" /> {fmtTime(event.startDate)}
              {event.endDate && ` – ${fmtTime(event.endDate)}`}
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <Ticket size={15} className="text-[#F97316]" /> {fmtPrice(event.ticketPrice)}
          </span>
        </div>
      </section>

      {/* ════════════════════════ MAIN GRID ════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-12 lg:py-16 grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">

        {/* ─────────── LEFT ─────────── */}
        <div className="min-w-0">

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[0.7rem] tracking-[0.22em] font-semibold mb-2" style={{ color: catColor }}>
              ABOUT THIS EVENT
            </div>
            <p className="text-lg md:text-xl leading-[1.8] text-neutral-700 font-light">
              {event.description}
            </p>
          </motion.div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="mt-10 flex items-center flex-wrap gap-2">
              <Tag size={15} className="text-neutral-400" />
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full px-3 py-1 font-medium border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-14" />

          {/* ── WHAT TO EXPECT (replaces redundant Details card) ── */}
          <div>
            <div className="text-[0.7rem] tracking-[0.22em] font-semibold mb-1" style={{ color: catColor }}>
              WHAT TO EXPECT
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-6">
              Before you go
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Suitable for */}
              <div className="rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${catColor}18` }}>
                  <Users size={17} style={{ color: catColor }} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide mb-1">Suitable for</div>
                  <div className="font-semibold text-neutral-900 text-[0.95rem]">
                    {event.ageGroup || "All ages welcome"}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${catColor}18` }}>
                  <Clock size={17} style={{ color: catColor }} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide mb-1">Duration</div>
                  <div className="font-semibold text-neutral-900 text-[0.95rem]">
                    {event.duration || duration || "Check organiser"}
                  </div>
                </div>
              </div>

              {/* Entry */}
              <div className="rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${catColor}18` }}>
                  <Ticket size={17} style={{ color: catColor }} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide mb-1">Entry</div>
                  <div className="font-semibold text-neutral-900 text-[0.95rem]">{fmtPrice(event.ticketPrice)}</div>
                  {event.bookingUrl && (
                    <a href={event.bookingUrl} target="_blank" rel="noreferrer"
                      className="text-xs font-medium mt-0.5 inline-flex items-center gap-1 hover:underline"
                      style={{ color: catColor }}>
                      Book now <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>

              {/* Organiser */}
              <div className="rounded-2xl border border-neutral-100 bg-[#FAFAF7] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${catColor}18` }}>
                  <Star size={17} style={{ color: catColor }} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide mb-1">Organiser</div>
                  <div className="font-semibold text-neutral-900 text-[0.95rem]">
                    {event.organiser?.name || event.organizer?.name || "Local organiser"}
                  </div>
                  {(event.organiser?.contact || event.organizer?.contact) && (
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {event.organiser?.contact || event.organizer?.contact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-14" />

          {/* ── MAP — real Google Maps iframe, no API key needed ── */}
          <div>
            <div className="text-[0.7rem] tracking-[0.22em] font-semibold mb-1" style={{ color: catColor }}>LOCATION</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-5">
              Find it on the map
            </h2>
            <div className="rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm" style={{ height: 380 }}>
              <iframe
                title="Event location"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=15`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              style={{ color: catColor }}
            >
              <Navigation size={14} /> Get directions in Google Maps
            </a>
          </div>

          {/* ── MORE EVENTS ── */}
          {nearby.length > 0 && (
            <div className="mt-14">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] font-semibold mb-1" style={{ color: catColor }}>MORE EVENTS</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    More in {fmtCity(city)}
                  </h2>
                </div>
                <Link
                  href="/events"
                  className="font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: catColor }}
                >
                  View all <ChevronRight size={15} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {nearby.map((n) => (
                  <Link key={n.slug} href={`/cities/${n.citySlug}/events/${n.slug}`} className="group">
                    <Card className="overflow-hidden border-neutral-200/80 shadow-sm rounded-2xl h-full hover:shadow-md transition">
                      <div
                        className="h-44 bg-neutral-200 group-hover:scale-[1.03] transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${getEventImage(n)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <CardContent className="p-4">
                        <div className="text-[0.65rem] tracking-[0.2em] font-semibold uppercase" style={{ color: CATEGORY_COLORS[n.category] || "#6B7280" }}>
                          {n.category}
                        </div>
                        <div className="mt-1 font-bold text-neutral-900 line-clamp-1">{n.name}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">{fmtDate(n.startDate)}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─────────── RIGHT SIDEBAR ─────────── */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <Card className="border-neutral-200/80 shadow-[0_8px_40px_rgba(14,14,16,0.06)] rounded-2xl overflow-hidden">
            <div className="text-white px-6 py-5" style={{ background: "#0E0E10" }}>
              <div className="text-[0.65rem] tracking-[0.22em] font-semibold mb-1" style={{ color: catColor }}>
                PLAN YOUR VISIT
              </div>
              <div className="text-lg font-bold">Everything you need</div>
            </div>
            <CardContent className="p-6 space-y-5">

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar size={16} className="mt-0.5" style={{ color: catColor }} />
                <div>
                  <div className="text-xs text-neutral-500 font-medium">DATE & TIME</div>
                  <div className="font-semibold text-neutral-900 text-[0.95rem]">
                    {fmtDate(event.startDate)}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {fmtTime(event.startDate)}{event.endDate && ` – ${fmtTime(event.endDate)}`}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ticket price */}
              <div>
                <div className="text-xs text-neutral-500 font-medium mb-2 flex items-center gap-1.5">
                  <Ticket size={13} style={{ color: catColor }} /> TICKET PRICE
                </div>
                <div className="font-bold text-neutral-900 text-lg">{fmtPrice(event.ticketPrice)}</div>
                {!isFree && event.ticketPrice?.max && event.ticketPrice.max !== event.ticketPrice.min && (
                  <div className="text-xs text-neutral-400 mt-0.5">Up to ₹{event.ticketPrice.max.toLocaleString()}</div>
                )}
              </div>

              <Separator />

              {/* Venue */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5" style={{ color: catColor }} />
                <div>
                  <div className="text-xs text-neutral-500 font-medium">VENUE</div>
                  <div className="font-medium text-neutral-900 text-[0.92rem] leading-snug">
                    {event.venue?.name}
                  </div>
                  {event.venue?.address && (
                    <div className="text-xs text-neutral-400 mt-0.5 leading-snug">{event.venue.address}</div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2.5">
                {event.bookingUrl && (
                  <Button
                    asChild
                    className="w-full text-white rounded-full h-11 font-semibold"
                    style={{ background: catColor }}
                  >
                    <a target="_blank" rel="noreferrer" href={event.bookingUrl}>
                      <Ticket size={15} className="mr-2" /> Book Tickets
                    </a>
                  </Button>
                )}

                <Button
                  asChild
                  className="w-full bg-[#0E0E10] hover:bg-neutral-800 text-white rounded-full h-11 font-semibold"
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                  >
                    <Navigation size={15} className="mr-2" /> Get Directions
                  </a>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSaved((s) => !s)}
                    className="rounded-full h-10 border-neutral-200 hover:border-[#F97316] hover:text-[#F97316]"
                  >
                    <Heart size={14} className={`mr-2 ${saved ? "fill-[#F97316] text-[#F97316]" : ""}`} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="rounded-full h-10 border-neutral-200 hover:border-[#F97316] hover:text-[#F97316]"
                  >
                    <Share2 size={14} className="mr-2" /> Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 px-2 text-xs text-neutral-400 leading-relaxed">
            Info refreshed weekly by local curators. Spot a mistake?{" "}
            <a href="#" className="text-[#F97316] font-medium">Tell us</a>.
          </div>
        </aside>
      </section>
    </main>
  );
}