"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bike,
  Bus,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Navigation,
  Plane,
  Shield,
  Ship,
  Smartphone,
  Train,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { transportService } from "@/services/transport.service";

const fmtCity = (c = "") =>
  c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const ICON_MAP = {
  metro: Train,
  train: Train,
  "local-train": Train,
  bus: Bus,
  taxi: Car,
  auto: Car,
  cab: Car,
  rickshaw: Car,
  "auto-rickshaw": Car,
  scooter: Bike,
  bike: Bike,
  airport: Plane,
  "airport-transfer": Plane,
  ferry: Ship,
  boat: Ship,
};

const iconFor = (type) => ICON_MAP[(type || "").toLowerCase()] || Navigation;

function MapBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="map-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="#BFDBFE" strokeWidth="0.7" />
        </pattern>
        <linearGradient id="map-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.35" />
          <stop offset="58%" stopColor="#EFF6FF" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#EFF6FF" />
      <rect width="100%" height="100%" fill="url(#map-grid)" />
      <path
        d="M-40 250C130 170 210 280 360 210C520 135 640 180 810 115C940 65 1080 90 1220 28"
        fill="none"
        stroke="#93C5FD"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M-40 250C130 170 210 280 360 210C520 135 640 180 810 115C940 65 1080 90 1220 28"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <rect x="9%" y="18%" width="18%" height="19%" rx="12" fill="#DBEAFE" opacity="0.5" />
      <rect x="34%" y="12%" width="16%" height="26%" rx="12" fill="#BFDBFE" opacity="0.3" />
      <rect x="62%" y="18%" width="18%" height="18%" rx="12" fill="#D1FAE5" opacity="0.65" />
      <rect x="14%" y="58%" width="28%" height="24%" rx="12" fill="#DBEAFE" opacity="0.35" />
      <rect x="58%" y="56%" width="28%" height="26%" rx="12" fill="#DBEAFE" opacity="0.42" />
      <circle cx="58%" cy="42%" r="15" fill="#2563EB" opacity="0.12" />
      <circle cx="58%" cy="42%" r="7" fill="#2563EB" />
      <circle cx="58%" cy="42%" r="3" fill="white" />
      <rect width="100%" height="100%" fill="url(#map-fade)" />
    </svg>
  );
}

export default function TransportDetailPage() {
  const { city, slug } = useParams();
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    transportService
      .getBySlug(city, slug)
      .then(setT)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, slug]);

  if (loading) return <DetailSkeleton />;
  if (!t) return <NotFound type="Transport" backHref={`/cities/${city}/transport`} />;

  const Icon = iconFor(t.type);
  const hasTips = t.tips?.length > 0;

  const fare =
    t.fare?.min !== undefined
      ? `₹${t.fare.min}${t.fare.max ? `–₹${t.fare.max}` : "+"}`
      : null;

  const hours =
    t.operatingHours?.open && t.operatingHours?.close
      ? `${t.operatingHours.open} – ${t.operatingHours.close}`
      : t.operatingHours?.note || null;

  const primaryApp = t.apps?.find((a) => a.url);
  const ctaHref = primaryApp?.url || (t.contactNumber ? `tel:${t.contactNumber}` : null);

  const essentials = [
    fare && { icon: Wallet, label: "Fare", value: fare, note: t.fare.unit || "per ride" },
    hours && {
      icon: Clock,
      label: "Hours",
      value: hours,
      note: t.operatingHours?.note && t.operatingHours?.open ? t.operatingHours.note : "",
    },
    t.frequency && {
      icon: Zap,
      label: "Frequency",
      value: t.frequency,
      note: "Typical availability",
    },
    t.apps?.length > 0 && {
      icon: Smartphone,
      label: "Apps",
      value: t.apps.map((a) => a.name).join(", "),
      note: t.apps.length > 1 ? `${t.apps.length} options available` : "Recommended option",
    },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white pt-[4.5rem] text-[#0B1220]">
      <section className="relative overflow-hidden border-b border-[#DBEAFE]">
        <MapBackground />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href={`/cities/${city}/transport`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] transition hover:text-[#2563EB]"
            >
              <ArrowLeft size={16} />
              All transport
            </Link>

            <div className="hidden items-center gap-2 text-xs font-medium text-[#475569] md:flex">
              <Link href="/" className="hover:text-[#2563EB]">Home</Link>
              <ChevronRight size={13} />
              <Link href={`/cities/${city}/transport`} className="hover:text-[#2563EB]">
                {fmtCity(city)}
              </Link>
              <ChevronRight size={13} />
              <span className="font-bold text-[#1E3A8A]">{t.name}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {t.type && (
                  <span className="rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                    {t.type.replace(/-/g, " ")}
                  </span>
                )}

                {t.servesAirport && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#1D4ED8]">
                    <Plane size={11} />
                    Airport route
                  </span>
                )}
              </div>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1D4ED8] shadow-[0_14px_32px_rgba(37,99,235,.14)] ring-1 ring-[#BFDBFE]">
                <Icon size={30} strokeWidth={1.9} />
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-[1.04] tracking-tight text-[#0B1220] md:text-5xl">
                {t.name}
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#334155]">
                {t.description ||
                  `A practical guide to using ${t.name} in ${fmtCity(city)}, including fares, routes, apps, timings, and local tips.`}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#475569]">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-[#2563EB]" />
                  {fmtCity(city)}
                </span>

                {hours && (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={15} className="text-[#2563EB]" />
                    {hours}
                  </span>
                )}

                {t.frequency && (
                  <span className="inline-flex items-center gap-2">
                    <Zap size={15} className="text-[#2563EB]" />
                    {t.frequency}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {ctaHref && (
                  <a
                    href={ctaHref}
                    target={primaryApp?.url ? "_blank" : undefined}
                    rel={primaryApp?.url ? "noreferrer" : undefined}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2563EB] px-6 text-sm font-black text-white shadow-[0_14px_32px_rgba(37,99,235,.22)] transition hover:bg-[#1D4ED8]"
                  >
                    {primaryApp?.url ? "Open official app" : `Call ${t.contactNumber}`}
                  </a>
                )}

                {hasTips && (
                  <button
                    type="button"
                    onClick={() => setTipsOpen(true)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#BFDBFE] bg-white px-6 text-sm font-black text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
                  >
                    <Info size={15} />
                    Local tips
                  </button>
                )}

                <Link
                  href={`/cities/${city}/transport`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#BFDBFE] bg-white px-6 text-sm font-black text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
                >
                  Compare transport
                </Link>
              </div>
            </motion.div>

            {essentials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="relative overflow-hidden rounded-[1.35rem] border border-[#93C5FD] bg-white/95 p-5 shadow-[0_24px_60px_rgba(37,99,235,.18)] backdrop-blur"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#A78BFA]" />
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#DBEAFE]/70 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-[#BFDBFE]/50 blur-2xl" />

                <div className="relative">
                  <p className="text-sm font-black text-[#0B1220]">Trip snapshot</p>
                  <p className="mt-1 text-xs font-medium text-[#475569]">
                    Key details before you start
                  </p>

                  <div className="mt-4 divide-y divide-[#DBEAFE]">
                    {essentials.slice(0, 4).map((item, i) => (
                      <SnapshotItem key={i} {...item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        {essentials.length > 0 && (
          <ContentSection
            eyebrow="Essentials"
            title="The practical stuff, clearly organized"
            subtitle="Fares, timing, app options, and availability grouped into consistent trip cards."
          >
            <div className="grid gap-4 md:grid-cols-4">
              {essentials.map((item, i) => (
                <EssentialTile key={i} {...item} index={i} />
              ))}
            </div>
          </ContentSection>
        )}

        {t.description && (
          <ContentSection eyebrow="Overview" title={`About ${t.name}`}>
            <p className="max-w-4xl text-base leading-8 text-[#1E293B]">{t.description}</p>
          </ContentSection>
        )}

        {t.howToUse?.length > 0 && (
          <ContentSection eyebrow="How it works" title="Step by step">
            <div className="overflow-hidden rounded-[1.35rem] border border-[#BFDBFE] bg-white shadow-[0_14px_40px_rgba(37,99,235,.05)]">
              {t.howToUse.map((step, i) => {
                const text = typeof step === "string" ? step : step.text || step.title;
                const detail = typeof step === "string" ? null : step.detail;

                return (
                  <div
                    key={i}
                    className="grid gap-4 border-b border-[#DBEAFE] p-5 last:border-b-0 hover:bg-[#F8FBFF] md:grid-cols-[96px_1fr]"
                  >
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">
                      Step {i + 1}
                    </div>
                    <div>
                      <p className="leading-7 text-[#0F172A]">{text}</p>
                      {detail && (
                        <p className="mt-1 text-sm font-medium leading-6 text-[#334155]">
                          {detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentSection>
        )}

        {t.routes?.length > 0 && (
          <ContentSection eyebrow="Routes" title="Route directory">
            <div className="overflow-hidden rounded-[1.35rem] border border-[#BFDBFE] bg-white shadow-[0_14px_40px_rgba(37,99,235,.06)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#DBEAFE] bg-[#EFF6FF] px-5 py-4">
                <div>
                  <p className="text-sm font-black text-[#0B1220]">Where it goes</p>
                  <p className="mt-1 text-xs font-medium text-[#334155]">
                    Common paths and useful notes.
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#2563EB] ring-1 ring-[#BFDBFE]">
                  {t.routes.length} routes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#DBEAFE] text-[11px] uppercase tracking-[0.16em] text-[#475569]">
                      <th className="px-5 py-4 font-black">Route</th>
                      <th className="px-5 py-4 font-black">Path</th>
                      <th className="px-5 py-4 font-black">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF2FF]">
                    {t.routes.map((rt, i) => {
                      const route = typeof rt === "string" ? { name: rt } : rt;

                      return (
                        <tr
                          key={i}
                          className="bg-white transition odd:bg-[#FCFDFF] hover:bg-[#F8FBFF]"
                        >
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-black text-[#2563EB] ring-1 ring-[#BFDBFE]">
                                {i + 1}
                              </span>
                              <div>
                                <p className="font-black leading-6 text-[#0B1220]">
                                  {route.name || "—"}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-[#475569]">
                                  Transport route
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            {route.from || route.to ? (
                              <div className="inline-grid min-w-[240px] grid-cols-[1fr_32px_1fr] items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#F8FBFF] px-3 py-2">
                                <span className="truncate text-sm font-bold text-[#1E293B]">
                                  {route.from || "Start"}
                                </span>
                                <span className="h-px bg-[#2563EB]" />
                                <span className="truncate text-right text-sm font-bold text-[#1E293B]">
                                  {route.to || "End"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-[#64748B]">—</span>
                            )}
                          </td>

                          <td className="max-w-md px-5 py-4 align-top text-sm font-medium leading-6 text-[#334155]">
                            {route.note || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ContentSection>
        )}

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {t.paymentMethods?.length > 0 && (
            <section>
              <SectionLabel label="Payment" />
              <h3 className="mb-4 text-xl font-black text-[#0B1220]">How to pay</h3>
              <div className="flex flex-wrap gap-2">
                {t.paymentMethods.map((m, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-[#DBEAFE] bg-white px-4 py-2 text-sm font-bold text-[#1E293B]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </section>
          )}

          {t.apps?.length > 0 && (
            <section>
              <SectionLabel label="Apps" />
              <h3 className="mb-4 text-xl font-black text-[#0B1220]">Official apps</h3>
              <div className="overflow-hidden rounded-[1.35rem] border border-[#BFDBFE] bg-white shadow-[0_10px_30px_rgba(37,99,235,.05)]">
                {t.apps.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 border-b border-[#DBEAFE] p-4 last:border-b-0 hover:bg-[#F8FBFF]"
                  >
                    <p className="font-bold text-[#0B1220]">{a.name}</p>
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-black text-[#2563EB] hover:underline"
                      >
                        Open
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {t.features?.length > 0 && (
          <ContentSection eyebrow="Features" title="What to expect">
            <div className="grid gap-4 md:grid-cols-3">
              {t.features.map((f, i) => (
                <FeatureTile key={i} text={f} index={i} />
              ))}
            </div>
          </ContentSection>
        )}
      </section>

      {hasTips && tipsOpen && (
        <TipsModal
          tips={t.tips}
          title={`${t.name} local tips`}
          onClose={() => setTipsOpen(false)}
        />
      )}
    </main>
  );
}

function EssentialTile({ icon: Icon, label, value, note, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex min-h-[178px] flex-col overflow-hidden rounded-[1.2rem] border border-[#BFDBFE] bg-[#F4F9FF] p-5 shadow-[0_10px_28px_rgba(37,99,235,.055)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#2563EB]" />
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-white/70" />

      <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1D4ED8] ring-1 ring-[#BFDBFE]">
        <Icon size={18} />
      </div>

      <div className="relative flex flex-1 flex-col">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#1D4ED8]">
          {label}
        </p>

        <p className="mt-2 min-h-[44px] text-[17px] font-black leading-snug text-[#0B1220]">
          {value}
        </p>

        {note && (
          <p className="mt-auto pt-3 text-sm font-medium leading-6 text-[#334155]">
            {note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function FeatureTile({ text, index }) {
  const icons = [CheckCircle2, Shield, Navigation, Zap, Smartphone, MapPin, Clock, Wallet];
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group rounded-[1.25rem] border border-[#DBEAFE] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#93C5FD] hover:shadow-[0_14px_34px_rgba(37,99,235,.08)]"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
        <Icon size={18} />
      </div>
      <p className="text-sm font-semibold leading-6 text-[#1E293B]">{text}</p>
    </motion.div>
  );
}

function TipsModal({ tips, title, onClose }) {
  const icons = [MapPin, Clock, Plane, Shield, Zap, Info, Smartphone, Wallet];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[#0F172A]/35 p-0 backdrop-blur-sm md:items-center md:justify-center md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[86vh] w-full overflow-hidden rounded-t-[1.5rem] bg-white shadow-2xl md:max-w-xl md:rounded-[1.5rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#DBEAFE] bg-[#EFF6FF] p-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2563EB]">
              Local tips
            </p>
            <h3 className="mt-1 text-xl font-black text-[#0B1220]">{title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#475569] ring-1 ring-[#BFDBFE] hover:text-[#2563EB]"
            aria-label="Close tips"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-5">
          <div className="space-y-3">
            {tips.map((tip, i) => {
              const TipIcon = icons[i % icons.length];

              return (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] ring-1 ring-[#BFDBFE]">
                    <TipIcon size={16} />
                  </div>
                  <p className="text-sm font-medium leading-6 text-[#1E293B]">{tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SnapshotItem({ icon: Icon, label, value, note }) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#BFDBFE]">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#475569]">
          {label}
        </p>
        <p className="truncate font-black text-[#0B1220]">{value}</p>
        {note && <p className="text-xs font-medium leading-5 text-[#334155]">{note}</p>}
      </div>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-4 w-1 rounded-full bg-[#2563EB]" />
      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB]">
        {label}
      </span>
    </div>
  );
}

function ContentSection({ eyebrow, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="mb-12"
    >
      {eyebrow && (
        <div className="mb-2">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2563EB]">
            {eyebrow}
          </span>
        </div>
      )}
      {title && (
        <h2 className="mb-2 text-2xl font-black tracking-tight text-[#0B1220] md:text-3xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mb-6 max-w-2xl text-sm font-medium leading-6 text-[#334155]">
          {subtitle}
        </p>
      )}
      <div className={title || subtitle ? "mt-6" : ""}>{children}</div>
    </motion.section>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-white pt-[4.5rem]">
      <div className="h-72 bg-[#EFF6FF]" />
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded-xl bg-[#DBEAFE]" />
          <div className="h-4 w-full animate-pulse rounded-xl bg-[#DBEAFE]" />
          <div className="h-4 w-4/5 animate-pulse rounded-xl bg-[#DBEAFE]" />
          <div className="mt-8 h-64 animate-pulse rounded-[1.35rem] bg-[#DBEAFE]" />
        </div>
      </div>
    </main>
  );
}

function NotFound({ type, backHref }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-[4.5rem] text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#2563EB] text-white">
        <Navigation size={28} />
      </div>
      <h1 className="text-3xl font-black text-[#0B1220]">{type} not found</h1>
      <p className="mt-2 max-w-sm text-[#334155]">
        We couldn't locate this {type.toLowerCase()}. The link may be outdated.
      </p>
      <Link
        href={backHref}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-black text-white hover:bg-[#1D4ED8]"
      >
        <ArrowLeft size={15} />
        Go back
      </Link>
    </main>
  );
}
