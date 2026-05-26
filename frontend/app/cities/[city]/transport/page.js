"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Train, Bus, Car, Bike, Plane, Ship, Navigation, Plus, Star, ArrowUpRight } from "lucide-react";
import { transportService, getTransportImage } from "@/services/transport.service";
import ListingShell from "@/components/listing/ListingShell";
import { Skeleton } from "@/components/ui/skeleton";

// Map transport.type → icon
const ICON_MAP = {
  metro: Train, train: Train, bus: Bus, taxi: Car, auto: Car, cab: Car,
  rickshaw: Car, scooter: Bike, bike: Bike, bicycle: Bike,
  airport: Plane, ferry: Ship, boat: Ship,
};
const iconFor = (type) => ICON_MAP[(type || "").toLowerCase()] || Navigation;

const TYPE_FILTERS = [
  { value: "",         label: "All" },
  { value: "metro",    label: "Metro" },
  { value: "bus",      label: "Bus" },
  { value: "auto",     label: "Auto / Rickshaw" },
  { value: "taxi",     label: "Taxi / Cab" },
  { value: "scooter",  label: "Scooter Rentals" },
  { value: "ferry",    label: "Ferry" },
];

export default function TransportListPage() {
  const { city } = useParams();
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [airportOnly, setAirportOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    transportService.getAll({ city, type, servesAirport: airportOnly ? "true" : "" })
      .then(setItems)
      .catch((err) => { console.error("Transport fetch error:", err); setItems([]); })
      .finally(() => setLoading(false));
  }, [city, type, airportOnly]);

  const mosaicImages = items.slice(0, 5).map(getTransportImage);

  return (
    <ListingShell
      citySlug={city}
      eyebrow="Move · Like a local"
      title={`Getting around ${city.replace(/-/g, " ")}`}
      subtitle="Every mode of transport explained — fares, apps, tips and where to catch one."
      count={items.length}
      mosaicImages={mosaicImages}
    >
      {/* Custom toolbar — different from FilterBar */}
      <div className="border-y border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                  type === t.value
                    ? "bg-[#F97316] text-white border-[#F97316]"
                    : "bg-white/5 text-white/70 border-white/15 hover:border-[#F97316]/50 hover:text-[#F97316]"
                }`}
              >{t.label}</button>
            ))}
          </div>
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={airportOnly}
              onChange={(e) => setAirportOnly(e.target.checked)}
              className="accent-[#F97316] w-4 h-4"
            />
            <Plane size={13} className="text-[#F97316]" />
            Airport routes only
          </label>
        </div>
      </div>

      {/* Directory list — NOT cards. Each row = one transport mode. */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No transport options found for those filters.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t, i) => {
              const Icon = iconFor(t.type);
              return (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    href={`/cities/${city}/transport/${t.slug}`}
                    className="group flex items-stretch gap-5 p-5 md:p-6 bg-[#15151A] border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-[#1a1a1f] transition-all"
                  >
                    {/* Icon block */}
                    <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                      <Icon size={28} strokeWidth={2} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[0.65rem] tracking-[0.25em] text-[#F97316] font-bold uppercase mb-1">
                            {(t.type || "Transport").replace(/-/g, " ")}
                            {t.servesAirport && <span className="ml-2 text-white/40 normal-case tracking-normal">· Airport</span>}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-[#F97316] transition">
                            {t.name}
                          </h3>
                        </div>
                        <ArrowUpRight size={20} className="text-white/30 group-hover:text-[#F97316] group-hover:rotate-12 transition shrink-0 mt-1" />
                      </div>

                      {t.tagline && (
                        <p className="mt-2 text-white/60 text-sm leading-relaxed line-clamp-2 max-w-2xl">{t.tagline}</p>
                      )}

                      {/* Quick stats row */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/50">
                        {t.fareRange?.min !== undefined && (
                          <span><span className="text-white/30">Fare:</span> ₹{t.fareRange.min}{t.fareRange.max ? `–₹${t.fareRange.max}` : ""}</span>
                        )}
                        {t.app && (
                          <span><span className="text-white/30">App:</span> {t.app}</span>
                        )}
                        {t.coverage && (
                          <span><span className="text-white/30">Coverage:</span> {t.coverage}</span>
                        )}
                        {t.rating > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Star size={11} fill="#F59E0B" color="#F59E0B" /> {t.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </ListingShell>
  );
}