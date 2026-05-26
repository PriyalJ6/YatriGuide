"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { agencyService } from "@/services/agency.service";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, ArrowUpRight, Star, BadgeCheck,
  Sparkles, MapPin, Globe, Phone, CalendarDays,
  IndianRupee, Users,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80";

// Only filters that actually exist in the DB
const FILTERS = [
  {
    key: "travelStyle", label: "Style", options: [
      { value: "luxury",    label: "Luxury"    },
      { value: "mid-range", label: "Mid-range" },
      { value: "budget",    label: "Budget"    },
    ],
  },
  {
    key: "groupType", label: "Group", options: [
      { value: "solo",      label: "Solo"      },
      { value: "couple",    label: "Couple"    },
      { value: "family",    label: "Family"    },
      { value: "group",     label: "Group"     },
      { value: "corporate", label: "Corporate" },
    ],
  },
  {
    key: "minRating", label: "Rating", options: [
      { value: "4.5", label: "4.5+" },
      { value: "4",   label: "4+"   },
    ],
  },
];

const STYLE_META = {
  luxury:      { label: "Luxury",    colour: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/25"   },
  "mid-range": { label: "Mid-range", colour: "text-[#F97316]",   bg: "bg-[#F97316]/10 border-[#F97316]/25"   },
  budget:      { label: "Budget",    colour: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25" },
};

// Deterministic accent colour per card index so grid looks varied
const ACCENTS = [
  "from-[#F97316]/20 to-transparent",
  "from-amber-500/15 to-transparent",
  "from-emerald-500/15 to-transparent",
  "from-purple-500/15 to-transparent",
  "from-sky-500/15 to-transparent",
  "from-rose-500/15 to-transparent",
];

function AgencyCard({ agency, index }) {
  const min    = agency.priceRange?.min;
  const max    = agency.priceRange?.max;
  const specs  = (agency.specialisations || []).slice(0, 4);
  const styles = (agency.travelStyles   || []);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
    >
      <Link href={`/agencies/${agency.slug}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 hover:border-[#F97316]/40 bg-[#111114] transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.07)]">

        {/* Coloured top accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="flex flex-col flex-1 p-6 gap-4">

          {/* ── Row 1: name + arrow + badges ── */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {agency.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F97316] text-white text-[0.6rem] font-bold tracking-wide">
                    <BadgeCheck size={9} /> Verified
                  </span>
                )}
                {agency.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[0.6rem] font-bold tracking-wide">
                    <Sparkles size={9} /> Featured
                  </span>
                )}
                {styles.map((s) => {
                  const m = STYLE_META[s];
                  return m ? (
                    <span key={s} className={`px-2 py-0.5 rounded-full border text-[0.6rem] font-bold ${m.colour} ${m.bg}`}>
                      {m.label}
                    </span>
                  ) : null;
                })}
              </div>
              <h3 className="font-black text-[1.1rem] leading-snug tracking-[-0.02em] group-hover:text-[#F97316] transition line-clamp-2">
                {agency.name}
              </h3>
            </div>
            <ArrowUpRight size={18}
              className="flex-shrink-0 mt-1 text-white/25 group-hover:text-[#F97316] group-hover:rotate-12 transition-all duration-300" />
          </div>

          {/* ── Row 2: Tagline ── */}
          {agency.tagline && (
            <p className="text-white/50 text-sm leading-relaxed line-clamp-2 italic">
              "{agency.tagline}"
            </p>
          )}

          {/* ── Row 3: Stats row ── */}
          <div className="flex items-center gap-4 text-xs text-white/45 flex-wrap">
            {agency.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-white/80">
                <Star size={11} className="text-[#F97316] fill-[#F97316]" />
                {agency.rating.toFixed(1)}
                {agency.reviewCount && (
                  <span className="text-white/35 font-normal">
                    · {agency.reviewCount.toLocaleString()} reviews
                  </span>
                )}
              </span>
            )}
            {agency.yearEstablished && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={11} />
                Est. {agency.yearEstablished}
              </span>
            )}
            {agency.languages?.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Globe size={11} />
                {agency.languages.slice(0, 2).join(", ")}
              </span>
            )}
          </div>

          {/* ── Row 4: Specialisations ── */}
          {specs.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {specs.map((s) => (
                <span key={s}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 text-[0.68rem] leading-none">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* ── Row 5: Group types ── */}
          {agency.groupTypes?.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Users size={11} className="text-white/30" />
              {agency.groupTypes.map((g) => (
                <span key={g} className="text-[0.65rem] text-white/35 capitalize">{g}</span>
              )).reduce((a, b) => [a, <span key={Math.random()} className="text-white/20">·</span>, b])}
            </div>
          )}

          {/* ── Row 6: Footer: location + price ── */}
          <div className="mt-auto pt-4 border-t border-white/[0.07] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-white/35 text-xs">
              <MapPin size={11} className="text-[#F97316] flex-shrink-0" />
              <span className="truncate">
                {agency.address?.split(",").slice(-2).join(",").trim() || agency.citySlugs?.[0]}
              </span>
            </div>
            {min && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <IndianRupee size={11} className="text-[#F97316]" />
                <span className="text-[#F97316] font-black text-sm">{min.toLocaleString()}</span>
                {max && (
                  <span className="text-white/30 text-xs ml-0.5">– {max.toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AgenciesListPage() {
  const params = useParams();
  const city   = params?.city || null;

  const [data,    setData]    = useState({ agencies: [], pagination: {} });
  const [filters, setFilters] = useState({ travelStyle: "", groupType: "", minRating: "" });
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    agencyService.getAll({ ...(city && { city }), ...filters, page, limit: 12 })
      .then((d) => setData(d || { agencies: [], pagination: {} }))
      .catch(()  => setData({ agencies: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const onClear  = () => { setFilters({ travelStyle: "", groupType: "", minRating: "" }); setPage(1); };

  const pageTitle = city
    ? `Travel agencies in ${city.replace(/-/g, " ")}`
    : "Travel agencies";

  return (
    <main className="bg-[#0B0B0D] text-white min-h-screen pt-[4.5rem]">

      {/* ── HERO ── */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0"
          style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/65 to-[#0B0B0D]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/85 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-10">
          {city ? (
            <Link href={`/cities/${city}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-[#F97316] text-sm mb-5 transition w-fit">
              <ArrowLeft size={14} /> Back to {city.replace(/-/g, " ")}
            </Link>
          ) : (
            <Link href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-[#F97316] text-sm mb-5 transition w-fit">
              <ArrowLeft size={14} /> Back to home
            </Link>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#F97316]" />
              <span className="text-[0.7rem] tracking-[0.35em] text-[#F97316] font-bold uppercase">
                Plan · Local experts
              </span>
            </div>
            <h1 className="font-black tracking-[-0.03em] leading-[0.95] capitalize"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}>
              {pageTitle}<span className="text-[#F97316]">.</span>
            </h1>
            <p className="mt-3 text-white/55 max-w-xl text-sm md:text-base">
              Trusted local guides, tour operators and full-trip planners — verified and rated.
            </p>
            {!loading && data.pagination?.total !== undefined && (
              <div className="mt-2 text-sm text-white/35">
                {data.pagination.total} {data.pagination.total === 1 ? "agency" : "agencies"} found
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <FilterBar
        groups={FILTERS}
        values={filters}
        count={data.pagination?.total}
        onChange={onFilter}
        onClear={onClear}
      />

      {/* ── GRID ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[340px] rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : data.agencies?.length === 0 ? (
          <div className="py-24 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            <p className="text-lg font-semibold mb-1">No agencies found</p>
            <p className="text-sm">Try adjusting or clearing the filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.agencies.map((a, i) => (
              <AgencyCard key={a._id} agency={a} index={i} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={data.pagination?.totalPages || 1}
          onPage={setPage}
        />
      </section>
    </main>
  );
}