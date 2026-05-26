"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Star, Clock, Ticket, ArrowLeft, Tag,
  Share2, Heart, ChevronRight, Calendar,
  Navigation, Info, Camera,
} from "lucide-react";
import { placeService, getPlaceImage } from "@/services/place.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

// ── helpers ──────────────────────────────────────────────────────────────────
const fmtCity = (c = "") =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

// Always prefer heroImage from DB, fallback to service helper
const img = (place) => place?.heroImage || getPlaceImage(place);

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
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </div>
    </main>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PlaceDetailPage() {
  const { city, slug } = useParams();
  const [place, setPlace]   = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]   = useState(false);

  // ── fetch current place ────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    placeService
      .getBySlug(city, slug)
      .then(setPlace)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, slug]);

  // ── fetch nearby — geo first, city-list fallback ───────────────────────────
  useEffect(() => {
    if (!place) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

    fetch(`${apiBase}/cities/places/${city}/${slug}/nearby`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (data?.places?.length) setNearby(data.places);
        else throw new Error("empty");
      })
      .catch(() => {
        // fallback: filter same-city list
        if (!placeService.getByCity) return;
        placeService
          .getByCity(city)
          .then((list) =>
            setNearby((list || []).filter((p) => p.slug !== slug).slice(0, 3))
          )
          .catch(() => {});
      });
  }, [place, city, slug]);

  // ── share handler ──────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: place?.name, url }); } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  // ── states ─────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  if (!place)
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900">Place not found</h1>
        <p className="text-neutral-500 max-w-md">
          We couldn&apos;t locate this spot. It may have been moved or the link is outdated.
        </p>
        <Button asChild className="bg-[#F97316] hover:bg-[#ea6a10] rounded-full">
          <Link href={`/cities/${city}/places`}>Back to places</Link>
        </Button>
      </main>
    );

  const heroUrl = img(place);

  return (
    <main className="pt-[4.5rem] bg-white">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section
        className="relative h-[62vh] min-h-[460px] w-full overflow-hidden"
        style={{
          backgroundImage: `url(${heroUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* layered dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        {/* top bar */}
        <div className="absolute top-5 left-0 right-0 z-10 px-5 md:px-8 flex items-center justify-between">
          <Link
            href={`/cities/mumbai/places`}
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
            <Badge className="bg-[#F97316] hover:bg-[#F97316] text-white rounded-full px-3 py-1 text-[0.65rem] tracking-[0.2em] font-bold uppercase border-0">
              {place.category?.replace("-", " ")}
            </Badge>
            {place.rating > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 text-sm">
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <strong className="font-semibold">{place.rating}</strong>
                <span className="text-white/80">· {place.reviewCount || 0} reviews</span>
              </span>
            )}
          </div>
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[1.02]"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
          >
            {place.name}
          </h1>
          {place.tagline && (
            <p className="mt-3 text-white/85 italic text-lg max-w-2xl">{place.tagline}</p>
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
                    <Link href={`/cities/${city}/places`}>{fmtCity(city)}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white/90">{place.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════ QUICK INFO BAND ═══════════════════════ */}
      <section className="bg-[#FAFAF7] border-b border-[#ECECE8]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600">
          {place.address && (
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-[#F97316]" /> {place.address}
            </span>
          )}
          {place.duration && (
            <span className="inline-flex items-center gap-2">
              <Clock size={15} className="text-[#F97316]" /> {place.duration}
            </span>
          )}
          {place.entryFee && (
            <span className="inline-flex items-center gap-2">
              <Ticket size={15} className="text-[#F97316]" />
              ₹{place.entryFee.indian} (Indian) · ₹{place.entryFee.foreigner} (Foreign)
              {place.entryFee.note && (
                <span className="text-neutral-400"> · {place.entryFee.note}</span>
              )}
            </span>
          )}
        </div>
      </section>

      {/* ═══════════════════════════ MAIN GRID ══════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-12 lg:py-16 grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">

        {/* ───────────────── LEFT CONTENT ───────────────── */}
        <div className="min-w-0">

          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-2">OVERVIEW</div>
            <p className="text-lg md:text-xl leading-[1.8] text-neutral-700 font-light">
              {place.description}
            </p>
          </motion.div>

          {/* Tabs */}
          {(place.history || place.timeline?.length > 0 || place.openingHours?.length > 0) && (
            <div className="mt-12">
              <Tabs defaultValue={place.history ? "history" : place.timeline?.length > 0 ? "timeline" : "hours"}>
                <TabsList className="bg-neutral-100 p-1 rounded-full">
                  {place.history && (
                    <TabsTrigger
                      value="history"
                      className="rounded-full data-[state=active]:bg-[#0E0E10] data-[state=active]:text-white px-5"
                    >
                      <Info size={14} className="mr-2" /> History
                    </TabsTrigger>
                  )}
                  {place.timeline?.length > 0 && (
                    <TabsTrigger
                      value="timeline"
                      className="rounded-full data-[state=active]:bg-[#0E0E10] data-[state=active]:text-white px-5"
                    >
                      <Calendar size={14} className="mr-2" /> Timeline
                    </TabsTrigger>
                  )}
                  {place.openingHours?.length > 0 && (
                    <TabsTrigger
                      value="hours"
                      className="rounded-full data-[state=active]:bg-[#0E0E10] data-[state=active]:text-white px-5"
                    >
                      <Clock size={14} className="mr-2" /> Hours
                    </TabsTrigger>
                  )}
                </TabsList>

                {place.history && (
                  <TabsContent value="history" className="mt-6">
                    <p className="text-base leading-[1.9] text-neutral-700">{place.history}</p>
                  </TabsContent>
                )}

                {place.timeline?.length > 0 && (
                  <TabsContent value="timeline" className="mt-6">
                    <div className="relative border-l-2 border-[#F97316]/30 pl-6 space-y-6">
                      {place.timeline.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="relative"
                        >
                          <span className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-[#F97316] ring-4 ring-[#F97316]/15" />
                          <div className="text-xs font-bold text-[#F97316] tracking-[0.12em]">{t.year}</div>
                          <p className="mt-1 text-neutral-700 text-[0.95rem] leading-relaxed">{t.event}</p>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {place.openingHours?.length > 0 && (
                  <TabsContent value="hours" className="mt-6">
                    <Card className="border-neutral-200/80 shadow-sm rounded-2xl">
                      <CardContent className="p-0 divide-y divide-neutral-100">
                        {place.openingHours.map((h, i) => (
                          <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                            <span className="text-neutral-700 font-medium">{h.day}</span>
                            <span className={`font-medium ${h.isClosed ? "text-red-500" : "text-emerald-600"}`}>
                              {h.isClosed ? "Closed" : `${h.open} – ${h.close}`}
                              {h.note && <span className="text-neutral-400 font-normal"> · {h.note}</span>}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}

          {/* Tags */}
          {place.tags?.length > 0 && (
            <div className="mt-10 flex items-center flex-wrap gap-2">
              <Tag size={15} className="text-neutral-400" />
              {place.tags.map((tag) => (
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

          {/* ── GALLERY ── */}
          {/* Shows real images[] if available, otherwise shows heroImage in a clean single view */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">GALLERY</div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  A closer look
                </h2>
              </div>
              <Camera size={22} className="text-neutral-400" />
            </div>

            {place.images?.length > 0 ? (
              // Real images array from DB — show grid
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {place.images.map((imgItem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                      i === 0 ? "md:col-span-2 md:row-span-2 h-80 md:h-full" : "h-44"
                    }`}
                    style={{
                      // ✅ use actual image URL from DB, heroImage as fallback
                      backgroundImage: `url(${imgItem?.url || imgItem || heroUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                  </motion.div>
                ))}
              </div>
            ) : (
              // No images array — show heroImage in a beautiful single frame
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full h-[420px] rounded-2xl overflow-hidden"
                style={{
                  // ✅ heroImage from DB
                  backgroundImage: `url(${heroUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
          </div>

          {/* ── MAP ── */}
            {/* ── MAP — real Google Maps iframe ── */}
<div className="mt-14">
  <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">
    LOCATION
  </div>
  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-5">
    Find it on the map
  </h2>

  <div
    className="rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm"
    style={{ height: 380 }}
  >
    <iframe
      title="Place location"
      width="100%"
      height="100%"
      style={{ border: 0, display: "block" }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://maps.google.com/maps?q=${encodeURIComponent(
        place.address || place.name
      )}&output=embed&z=15`}
    />
  </div>

  <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      place.address || place.name
    )}`}
    target="_blank"
    rel="noreferrer"
    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline text-[#F97316]"
  >
    <Navigation size={14} /> Get directions in Google Maps
  </a>
</div>

          {/* ── NEARBY ── */}
          {nearby.length > 0 && (
            <div className="mt-14">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">NEARBY</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    More to explore in {fmtCity(city)}
                  </h2>
                </div>
                <Link
                  href={`/cities/${city}/places`}
                  className="text-[#F97316] font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View all <ChevronRight size={15} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {nearby.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/cities/${n.citySlug || city}/places/${n.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-neutral-200/80 shadow-sm rounded-2xl h-full hover:shadow-md transition">
                      <div
                        className="h-44 bg-neutral-200 group-hover:scale-[1.03] transition-transform duration-500"
                        style={{
                          // ✅ each nearby place uses ITS OWN heroImage
                          backgroundImage: `url(${img(n)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <CardContent className="p-4">
                        <div className="text-[0.65rem] tracking-[0.2em] text-neutral-400 font-semibold uppercase">
                          {n.category?.replace("-", " ")}
                        </div>
                        <div className="mt-1 font-bold text-neutral-900 line-clamp-1">{n.name}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT SIDEBAR ───────────────── */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <Card className="border-neutral-200/80 shadow-[0_8px_40px_rgba(14,14,16,0.06)] rounded-2xl overflow-hidden">
            <div className="bg-[#0E0E10] text-white px-6 py-5">
              <div className="text-[0.65rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">PLAN YOUR VISIT</div>
              <div className="text-lg font-bold">Everything you need</div>
            </div>
            <CardContent className="p-6 space-y-5">
              {place.entryFee && (
                <div>
                  <div className="text-xs text-neutral-500 font-medium mb-2 flex items-center gap-1.5">
                    <Ticket size={13} className="text-[#F97316]" /> ENTRY FEE
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Indian</span>
                    <span className="font-bold text-neutral-900">₹{place.entryFee.indian}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1.5">
                    <span className="text-neutral-600">Foreign</span>
                    <span className="font-bold text-neutral-900">₹{place.entryFee.foreigner}</span>
                  </div>
                  {place.entryFee.note && (
                    <p className="text-xs text-neutral-400 mt-2">{place.entryFee.note}</p>
                  )}
                </div>
              )}

              {place.duration && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[#F97316] mt-0.5" />
                    <div>
                      <div className="text-xs text-neutral-500 font-medium">TYPICAL DURATION</div>
                      <div className="font-semibold text-neutral-900 text-[0.95rem]">{place.duration}</div>
                    </div>
                  </div>
                </>
              )}

              {place.address && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#F97316] mt-0.5" />
                    <div>
                      <div className="text-xs text-neutral-500 font-medium">ADDRESS</div>
                      <div className="font-medium text-neutral-900 text-[0.92rem] leading-snug">
                        {place.address}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2.5">
                <Button
                  asChild
                  className="w-full bg-[#F97316] hover:bg-[#ea6a10] text-white rounded-full h-11 font-semibold"
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      place.address || place.name
                    )}`}
                  >
                    <Navigation size={15} className="mr-2" /> Get directions
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