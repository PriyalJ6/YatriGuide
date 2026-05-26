"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  Globe,
  Heart,
  IndianRupee,
  Languages,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { agencyService } from "@/services/agency.service";
import { Skeleton } from "@/components/ui/skeleton";

const fmtSlug = (s = "") =>
  s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-white pt-[4.5rem]">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <Skeleton className="h-5 w-40 rounded-full bg-slate-100" />
            <Skeleton className="h-16 w-4/5 rounded-2xl bg-slate-100" />
            <Skeleton className="h-5 w-full rounded-full bg-slate-100" />
            <Skeleton className="h-5 w-3/4 rounded-full bg-slate-100" />
          </div>
          <Skeleton className="h-[360px] rounded-[2rem] bg-slate-100" />
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-[#0F766E]" />
      <span className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#0F766E]">
        {label}
      </span>
    </div>
  );
}

function RouteDesk({ agency, citySlug, min, max }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#D8E7E3] bg-[#F8FCFB] p-6 shadow-[0_24px_70px_rgba(15,118,110,0.10)]">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#CCFBF1] blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-[#E0F2FE] blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#0F766E]">
              Agency profile
            </p>
            <p className="mt-1 text-sm font-semibold text-[#52635F]">
              Built for trip planning
            </p>
          </div>
          {agency.isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#0F766E] ring-1 ring-[#B7DDD5]">
              <BadgeCheck size={13} />
              Verified
            </span>
          )}
        </div>

        <div className="relative mb-6 h-44 overflow-hidden rounded-[1.5rem] border border-[#D8E7E3] bg-white">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 220" fill="none">
            <path d="M-20 154 C90 70 150 180 260 106 C350 45 410 98 548 34" stroke="#99D5CA" strokeWidth="12" strokeLinecap="round" />
            <path d="M-20 154 C90 70 150 180 260 106 C350 45 410 98 548 34" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M70 22 L450 198" stroke="#E2ECE9" strokeWidth="1.5" />
            <path d="M120 210 L410 18" stroke="#E2ECE9" strokeWidth="1.5" />
            <circle cx="132" cy="108" r="8" fill="#0F766E" />
            <circle cx="132" cy="108" r="18" fill="#0F766E" opacity="0.12" />
            <circle cx="370" cy="82" r="8" fill="#D97706" />
            <circle cx="370" cy="82" r="18" fill="#D97706" opacity="0.14" />
          </svg>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#0F766E]">
                Primary city
              </p>
              <p className="mt-1 text-2xl font-black text-[#102A2A]">
                {citySlug ? fmtSlug(citySlug) : "India"}
              </p>
            </div>
            {agency.rating && (
              <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-[#D8E7E3]">
                <p className="flex items-center gap-1 text-lg font-black text-[#102A2A]">
                  <Star size={15} fill="#D97706" color="#D97706" />
                  {agency.rating.toFixed(1)}
                </p>
                <p className="text-xs font-semibold text-[#52635F]">
                  {agency.reviewCount ? `${agency.reviewCount.toLocaleString()} reviews` : "traveller rated"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {agency.yearEstablished && (
            <DeskFact icon={CalendarDays} label="Since" value={agency.yearEstablished} />
          )}
          {agency.packages?.length > 0 && (
            <DeskFact icon={Sparkles} label="Tours" value={`${agency.packages.length} packages`} />
          )}
          {min && (
            <DeskFact
              icon={IndianRupee}
              label="Starting"
              value={`₹${min.toLocaleString()}${max ? ` - ₹${max.toLocaleString()}` : "+"}`}
            />
          )}
          {agency.languages?.length > 0 && (
            <DeskFact icon={Languages} label="Languages" value={agency.languages.slice(0, 2).join(", ")} />
          )}
        </div>
      </div>
    </div>
  );
}

function DeskFact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#D8E7E3] bg-white p-4">
      <Icon size={17} className="mb-3 text-[#0F766E]" />
      <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#60736E]">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#102A2A]">{value}</p>
    </div>
  );
}

function PackageCard({ pkg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group rounded-[1.35rem] border border-[#D8E7E3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0F766E] hover:shadow-[0_18px_44px_rgba(15,118,110,0.09)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECFDF7] text-sm font-black text-[#0F766E]">
          {index + 1}
        </span>
        {pkg.duration && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7FAF9] px-3 py-1.5 text-xs font-bold text-[#52635F]">
            <Clock size={12} />
            {pkg.duration}
          </span>
        )}
      </div>

      <h3 className="text-lg font-black leading-snug text-[#102A2A] group-hover:text-[#0F766E]">
        {pkg.title}
      </h3>
      {pkg.description && (
        <p className="mt-3 text-sm font-medium leading-6 text-[#52635F]">
          {pkg.description}
        </p>
      )}

      {pkg.price && (
        <div className="mt-5 border-t border-[#E7EFED] pt-4">
          <p className="inline-flex items-center text-lg font-black text-[#0F766E]">
            <IndianRupee size={15} />
            {pkg.price.toLocaleString()}
            <span className="ml-1 text-xs font-bold text-[#7B8C87]">/ person</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}

function SidebarRow({ icon: Icon, label, value, href, note }) {
  const content = (
    <div className="flex gap-3 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF7] text-[#0F766E]">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#60736E]">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-black text-[#102A2A]">{value}</p>
        {note && <p className="mt-1 text-xs font-semibold text-[#60736E]">{note}</p>}
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block transition hover:opacity-75">
      {content}
    </a>
  ) : (
    content
  );
}

export default function AgencyDetailPage() {
  const { slug } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    agencyService
      .getBySlug(slug)
      .then(setAgency)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: agency?.name, url });
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!agency) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 pt-32 text-center">
        <h1 className="text-3xl font-black text-[#102A2A]">Agency not found</h1>
        <p className="max-w-sm text-sm text-[#52635F]">
          This link may be outdated or the agency was removed.
        </p>
        <Link
          href="/agencies"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B5F59]"
        >
          Back to agencies
        </Link>
      </main>
    );
  }

  const citySlug = agency.citySlugs?.[0];
  const min = agency.priceRange?.min;
  const max = agency.priceRange?.max;

  return (
    <main className="min-h-screen bg-white pt-[4.5rem] text-[#102A2A]">
      <section className="border-b border-[#E7EFED]">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-sm font-black text-[#52635F] transition hover:text-[#0F766E]"
            >
              <ArrowLeft size={16} />
              All agencies
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => setSaved((s) => !s)}
                aria-label="Save"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E7E3] bg-white text-[#0F766E] transition hover:bg-[#ECFDF7]"
              >
                <Heart size={17} className={saved ? "fill-[#0F766E]" : ""} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E7E3] bg-white text-[#0F766E] transition hover:bg-[#ECFDF7]"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-6 flex flex-wrap gap-2">
                {agency.isVerified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F766E] px-3 py-1.5 text-xs font-black text-white">
                    <BadgeCheck size={13} />
                    Verified agency
                  </span>
                )}
                {agency.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E7E3] bg-white px-3 py-1.5 text-xs font-black text-[#0F766E]">
                    <Sparkles size={13} />
                    Featured
                  </span>
                )}
                {agency.yearEstablished && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E7E3] bg-white px-3 py-1.5 text-xs font-bold text-[#52635F]">
                    <CalendarDays size={13} />
                    Since {agency.yearEstablished}
                  </span>
                )}
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#7B8C87]">
                <Link href="/" className="hover:text-[#0F766E]">Home</Link>
                <ChevronRight size={12} />
                <Link href="/agencies" className="hover:text-[#0F766E]">Agencies</Link>
                {citySlug && (
                  <>
                    <ChevronRight size={12} />
                    <Link href={`/cities/${citySlug}`} className="hover:text-[#0F766E]">
                      {fmtSlug(citySlug)}
                    </Link>
                  </>
                )}
              </div>

              <p className="mb-3 text-[0.72rem] font-black uppercase tracking-[0.26em] text-[#0F766E]">
                Curated travel operator
              </p>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-[#102A2A] md:text-7xl">
                {agency.name}
              </h1>

              {agency.tagline && (
                <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-[#31514C]">
                  {agency.tagline}
                </p>
              )}

              {agency.description && (
                <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-[#52635F]">
                  {agency.description.slice(0, 220)}
                  {agency.description.length > 220 ? "..." : ""}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {agency.contact?.website && (
                  <a
                    href={agency.contact.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0F766E] px-6 text-sm font-black text-white transition hover:bg-[#0B5F59]"
                  >
                    Visit website
                    <ArrowUpRight size={15} />
                  </a>
                )}

                {agency.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${agency.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#B7DDD5] bg-white px-6 text-sm font-black text-[#0F766E] transition hover:bg-[#ECFDF7]"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                )}
              </div>
            </motion.div>

            <RouteDesk agency={agency} citySlug={citySlug} min={min} max={max} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-14">
          {agency.description && (
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionLabel label="Profile" />
              <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
                <h2 className="text-3xl font-black tracking-tight text-[#102A2A]">
                  What they bring to the trip.
                </h2>
                <p className="text-lg font-medium leading-9 text-[#31514C]">
                  {agency.description}
                </p>
              </div>
            </motion.section>
          )}

          {(agency.specialisations?.length > 0 || agency.groupTypes?.length > 0 || agency.languages?.length > 0) && (
            <section>
              <SectionLabel label="Travel style" />
              <div className="grid gap-4 md:grid-cols-3">
                {agency.specialisations?.length > 0 && (
                  <InfoCluster title="Specialises in" items={agency.specialisations} icon={Sparkles} />
                )}
                {agency.groupTypes?.length > 0 && (
                  <InfoCluster title="Ideal for" items={agency.groupTypes} icon={Users} />
                )}
                {agency.languages?.length > 0 && (
                  <InfoCluster title="Languages" items={agency.languages} icon={Languages} />
                )}
              </div>
            </section>
          )}

          {agency.packages?.length > 0 && (
            <section>
              <SectionLabel label="Tour packages" />
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#102A2A] md:text-4xl">
                    Pick your journey.
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-[#60736E]">
                    {agency.packages.length} curated{" "}
                    {agency.packages.length === 1 ? "experience" : "experiences"} available.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {agency.packages.map((pkg, i) => (
                  <PackageCard key={i} pkg={pkg} index={i} />
                ))}
              </div>
            </section>
          )}

          {agency.address && (
            <section>
              <SectionLabel label="Location" />
              <h2 className="mb-5 text-3xl font-black tracking-tight text-[#102A2A]">
                Find them here.
              </h2>
              <div className="overflow-hidden rounded-[1.5rem] border border-[#D8E7E3] bg-white shadow-[0_14px_44px_rgba(15,118,110,0.06)]">
                <iframe
                  title="Agency location"
                  width="100%"
                  height="360"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    agency.address
                  )}&output=embed&z=14`}
                />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  agency.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#0F766E] hover:underline"
              >
                <Navigation size={14} />
                Get directions on Google Maps
              </a>
            </section>
          )}
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[1.5rem] border border-[#D8E7E3] bg-white shadow-[0_22px_60px_rgba(15,118,110,0.10)]">
            <div className="border-b border-[#D8E7E3] bg-[#F8FCFB] p-6">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#0F766E]">
                Contact desk
              </p>
              <h2 className="mt-2 text-xl font-black leading-tight text-[#102A2A]">
                {agency.name}
              </h2>
              {min && (
                <p className="mt-3 text-sm font-bold text-[#52635F]">
                  Starts from{" "}
                  <span className="text-lg font-black text-[#0F766E]">
                    ₹{min.toLocaleString()}
                  </span>
                  {max ? ` - ₹${max.toLocaleString()}` : "+"}
                </p>
              )}
            </div>

            <div className="divide-y divide-[#E7EFED] px-6 py-2">
              {agency.contact?.phone && (
                <SidebarRow
                  icon={Phone}
                  label="Call"
                  value={agency.contact.phone}
                  href={`tel:${agency.contact.phone}`}
                />
              )}
              {agency.contact?.whatsapp && (
                <SidebarRow
                  icon={MessageCircle}
                  label="WhatsApp"
                  value="Message the agency"
                  href={`https://wa.me/${agency.contact.whatsapp.replace(/\D/g, "")}`}
                />
              )}
              {agency.contact?.website && (
                <SidebarRow
                  icon={Globe}
                  label="Website"
                  value={agency.contact.website.replace(/https?:\/\//, "")}
                  href={agency.contact.website}
                />
              )}
              {agency.address && (
                <SidebarRow icon={MapPin} label="Address" value={agency.address} />
              )}
            </div>

            <div className="space-y-3 p-6 pt-3">
              {agency.contact?.website && (
                <a
                  href={agency.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0F766E] px-5 text-sm font-black text-white transition hover:bg-[#0B5F59]"
                >
                  Visit website
                  <ArrowUpRight size={15} />
                </a>
              )}
              {agency.contact?.whatsapp && (
                <a
                  href={`https://wa.me/${agency.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#B7DDD5] bg-white px-5 text-sm font-black text-[#0F766E] transition hover:bg-[#ECFDF7]"
                >
                  <MessageCircle size={15} />
                  WhatsApp them
                </a>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#D8E7E3] bg-white p-6">
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.24em] text-[#60736E]">
              Quick facts
            </p>
            <div className="divide-y divide-[#E7EFED]">
              {agency.yearEstablished && <FactRow label="Established" value={agency.yearEstablished} />}
              {agency.rating && (
                <FactRow
                  label="Rating"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Star size={13} fill="#D97706" color="#D97706" />
                      {agency.rating.toFixed(1)} / 5
                    </span>
                  }
                />
              )}
              {agency.reviewCount && (
                <FactRow label="Reviews" value={`${agency.reviewCount.toLocaleString()}+`} />
              )}
              {agency.packages?.length > 0 && (
                <FactRow label="Packages" value={`${agency.packages.length} tours`} />
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCluster({ title, items, icon: Icon }) {
  return (
    <div className="rounded-[1.35rem] border border-[#D8E7E3] bg-[#F8FCFB] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0F766E] ring-1 ring-[#D8E7E3]">
        <Icon size={17} />
      </div>
      <h3 className="mb-3 text-sm font-black text-[#102A2A]">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#D8E7E3] bg-white px-3 py-1.5 text-sm font-bold capitalize text-[#31514C]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FactRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-semibold text-[#60736E]">{label}</span>
      <span className="text-sm font-black text-[#102A2A]">{value}</span>
    </div>
  );
}
