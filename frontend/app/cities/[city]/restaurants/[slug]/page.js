"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, ArrowLeft, Heart, Share2, Navigation, Utensils, Wallet, ChefHat, Phone } from "lucide-react";
import { restaurantService, getRestaurantImage } from "@/services/restuarant.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const fmtCity = (c = "") => c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function RestaurantDetailPage() {
  const { city, slug } = useParams();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    restaurantService.getBySlug(city, slug).then(setR).catch(console.error).finally(() => setLoading(false));
  }, [city, slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) try { await navigator.share({ title: r?.name, url }); } catch {}
    else if (navigator.clipboard) await navigator.clipboard.writeText(url);
  };

  if (loading) return <DetailSkeleton />;
  if (!r) return <NotFound type="Restaurant" backHref={`/cities/${city}/restaurants`} />;

  const heroUrl = getRestaurantImage(r);

  return (
    <main className="pt-[4.5rem] bg-white">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[440px] w-full overflow-hidden" style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="absolute top-5 left-0 right-0 z-10 px-5 md:px-8 flex items-center justify-between">
          <Link href={`/cities/${city}/restaurants`} className="inline-flex items-center gap-2 text-white text-sm font-medium bg-white/15 backdrop-blur-md hover:bg-white/25 px-4 py-2 rounded-full"><ArrowLeft size={15} /> Back</Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setSaved(s => !s)} className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 text-white"><Heart size={17} className={saved ? "fill-[#F97316] text-[#F97316]" : ""} /></button>
            <button onClick={handleShare} className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 text-white"><Share2 size={16} /></button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute bottom-10 left-0 right-0 px-5 md:px-10 max-w-6xl mx-auto text-white">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge className="bg-[#F97316] hover:bg-[#F97316] text-white rounded-full px-3 py-1 text-[0.65rem] tracking-[0.2em] font-bold uppercase border-0">{r.category?.replace("-", " ")}</Badge>
            {(r.cuisine || []).slice(0, 3).map(c => (
              <Badge key={c} className="bg-white/15 hover:bg-white/15 backdrop-blur-md text-white rounded-full px-3 py-1 text-xs border-0">{c}</Badge>
            ))}
            {r.rating > 0 && <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 text-sm"><Star size={13} fill="#F59E0B" color="#F59E0B" /><strong>{r.rating}</strong><span className="text-white/80">· {r.reviewCount || 0}</span></span>}
          </div>
          <h1 className="font-extrabold tracking-[-0.03em] leading-[1.02]" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}>{r.name}</h1>
          {r.tagline && <p className="mt-3 text-white/85 italic text-lg max-w-2xl">{r.tagline}</p>}
          <Breadcrumb className="mt-6"><BreadcrumbList className="text-white/70 text-xs">
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/" className="hover:text-[#F97316]">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/cities/${city}/restaurants`} className="hover:text-[#F97316]">{fmtCity(city)}</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem><BreadcrumbPage className="text-white/90">{r.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList></Breadcrumb>
        </motion.div>
      </section>

      {/* QUICK BAND */}
      <section className="bg-[#FAFAF7] border-b border-[#ECECE8]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600">
          {r.address && <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-[#F97316]" /> {r.neighbourhood || r.address}</span>}
          {r.priceRange && <span className="inline-flex items-center gap-2"><Wallet size={15} className="text-[#F97316]" /> {r.priceRange} {r.avgCostForTwo && `· ₹${r.avgCostForTwo} for two`}</span>}
          {r.openingHours?.[0] && <span className="inline-flex items-center gap-2"><Clock size={15} className="text-[#F97316]" /> {r.openingHours[0].day} · {r.openingHours[0].open}–{r.openingHours[0].close}</span>}
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-12 lg:py-16 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="min-w-0">
          <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-2">THE STORY</div>
          <p className="text-lg md:text-xl leading-[1.8] text-neutral-700 font-light">{r.description}</p>

          {/* MUST TRY — restaurant signature */}
          {r.mustTry?.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-5"><ChefHat size={18} className="text-[#F97316]" />
                <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold">MUST TRY</div></div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-6">What the regulars order</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {r.mustTry.map((dish, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#FFF8F3] border border-[#FFE4D0] hover:border-[#F97316] transition">
                    <div className="w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="font-medium text-neutral-800">{dish}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* OPENING HOURS */}
          {r.openingHours?.length > 0 && (
            <div className="mt-12">
              <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-2">HOURS</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-5">When they're open</h2>
              <Card className="border-neutral-200/80 rounded-2xl"><CardContent className="p-0 divide-y divide-neutral-100">
                {r.openingHours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-neutral-700 font-medium">{h.day}</span>
                    <span className={`font-medium ${h.isClosed ? "text-red-500" : "text-emerald-600"}`}>{h.isClosed ? "Closed" : `${h.open} – ${h.close}`}</span>
                  </div>
                ))}
              </CardContent></Card>
            </div>
          )}

          {/* FEATURES */}
          {r.features?.length > 0 && (
            <div className="mt-10">
              <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-3">GOOD TO KNOW</div>
              <div className="flex flex-wrap gap-2">
                {r.features.map(f => <Badge key={f} variant="secondary" className="bg-neutral-100 text-neutral-700 rounded-full px-3 py-1 border-0">{f}</Badge>)}
              </div>
            </div>
          )}

          <Separator className="my-12" />

          {/* MAP */}
          <div className="text-[0.7rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">LOCATION</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-5">Find your way</h2>
          <div className="rounded-2xl overflow-hidden border border-neutral-200/80" style={{ height: 380 }}>
            <iframe title="map" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(r.address || r.name)}&output=embed&z=15`} />
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <Card className="border-neutral-200/80 shadow-[0_8px_40px_rgba(14,14,16,0.06)] rounded-2xl overflow-hidden">
            <div className="bg-[#0E0E10] text-white px-6 py-5">
              <div className="text-[0.65rem] tracking-[0.22em] text-[#F97316] font-semibold mb-1">RESERVE A TABLE</div>
              <div className="text-lg font-bold">{r.name}</div>
            </div>
            <CardContent className="p-6 space-y-5">
              {r.avgCostForTwo && (
                <div>
                  <div className="text-xs text-neutral-500 font-medium mb-2 flex items-center gap-1.5"><Wallet size={13} className="text-[#F97316]" /> AVG. COST FOR TWO</div>
                  <div className="text-2xl font-extrabold text-neutral-900">₹{r.avgCostForTwo.toLocaleString()}</div>
                  <div className="text-xs text-neutral-400 mt-1">{r.priceRange} · taxes incl.</div>
                </div>
              )}
              {r.address && <><Separator /><div className="flex items-start gap-3"><MapPin size={16} className="text-[#F97316] mt-0.5" /><div><div className="text-xs text-neutral-500 font-medium">ADDRESS</div><div className="font-medium text-neutral-900 text-[0.92rem] leading-snug">{r.address}</div></div></div></>}
              <Separator />
              <div className="space-y-2.5">
                <Button asChild className="w-full bg-[#F97316] hover:bg-[#ea6a10] rounded-full h-11 font-semibold"><a target="_blank" rel="noreferrer" href={r.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address || r.name)}`}><Navigation size={15} className="mr-2" /> Get directions</a></Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setSaved(s => !s)} className="rounded-full h-10 border-neutral-200 hover:border-[#F97316] hover:text-[#F97316]"><Heart size={14} className={`mr-2 ${saved ? "fill-[#F97316] text-[#F97316]" : ""}`} />{saved ? "Saved" : "Save"}</Button>
                  <Button variant="outline" onClick={handleShare} className="rounded-full h-10 border-neutral-200 hover:border-[#F97316] hover:text-[#F97316]"><Share2 size={14} className="mr-2" /> Share</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="pt-[4.5rem] bg-white min-h-screen">
      <div className="h-[60vh] w-full bg-neutral-200 animate-pulse" />
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4"><div className="h-8 w-1/3 bg-neutral-200 rounded animate-pulse" /><div className="h-4 w-full bg-neutral-200 rounded animate-pulse" /><div className="h-4 w-11/12 bg-neutral-200 rounded animate-pulse" /></div>
        <div className="h-[420px] bg-neutral-200 rounded-2xl animate-pulse" />
      </div>
    </main>
  );
}

function NotFound({ type, backHref }) {
  return (
    <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-extrabold text-neutral-900">{type} not found</h1>
      <p className="text-neutral-500 max-w-md">We couldn't locate this {type.toLowerCase()}. The link may be outdated.</p>
      <Button asChild className="bg-[#F97316] hover:bg-[#ea6a10] rounded-full"><Link href={backHref}>Back</Link></Button>
    </main>
  );
}