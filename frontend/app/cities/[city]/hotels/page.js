"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { hotelService, getHotelImage } from "@/services/hotel.service";
import ListingShell from "@/components/listing/ListingShell";
import ListingCard from "@/components/listing/ListingCard";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = [
  { key: "type", label: "Type", options: [
    { value: "luxury", label: "Luxury" }, { value: "boutique", label: "Boutique" },
    { value: "heritage", label: "Heritage" }, { value: "resort", label: "Resort" },
    { value: "budget", label: "Budget" }, { value: "hostel", label: "Hostel" },
  ]},
  { key: "stars", label: "Stars", options: [
    { value: "5", label: "5★" }, { value: "4", label: "4★" }, { value: "3", label: "3★" },
  ]},
  { key: "minRating", label: "Rating", options: [
    { value: "4.5", label: "4.5+" }, { value: "4", label: "4+" },
  ]},
];

export default function HotelsListPage() {
  const { city } = useParams();
  const [data, setData] = useState({ hotels: [], pagination: {} });
  const [filters, setFilters] = useState({ type: "", stars: "", minRating: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    hotelService.getAll({ city, ...filters, page, limit: 12 })
      .then((d) => setData(d || { hotels: [], pagination: {} }))
      .catch(() => setData({ hotels: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const heroImg = data.hotels?.[0]?.heroImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80";

  return (
    <ListingShell citySlug={city} eyebrow="Stay · Curated" title={`Stays in ${city.replace(/-/g, " ")}`}
      subtitle="Heritage palaces, boutique stays and clean hostels — at every price point."
      count={data.pagination?.total} heroImg={heroImg}>

      <FilterBar groups={FILTERS} values={filters} count={data.pagination?.total}
        onChange={onFilter} onClear={() => { setFilters({ type: "", stars: "", minRating: "" }); setPage(1); }} />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl bg-white/5" />)}
          </div>
        ) : data.hotels?.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">No stays match those filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.hotels.map((h, i) => {
              const min = h.priceRange?.min;
              return (
                <ListingCard key={h._id} item={h} type="hotel" delay={i * 0.04}
                  image={getHotelImage(h)}
                  href={`/cities/${city}/hotels/${h.slug}`}
                  primary={`${h.type || ""} ${h.stars ? "· " + "★".repeat(h.stars) : ""}`}
                  secondary={h.tagline || h.shortDescription}
                  rating={h.rating}
                  price={min ? `From ₹${min.toLocaleString()} / night` : null}
                  badge={h.isFeatured && "Featured"} />
              );
            })}
          </div>
        )}
        <Pagination page={page} totalPages={data.pagination?.totalPages || 1} onPage={setPage} />
      </section>
    </ListingShell>
  );
}