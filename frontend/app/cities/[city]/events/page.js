"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventService, getEventImage } from "@/services/event.service.js";
import ListingShell from "@/components/listing/ListingShell";
import ListingCard from "@/components/listing/ListingCard";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = [
  { key: "when", label: "When", options: [
    { value: "today", label: "Today" }, { value: "this-weekend", label: "Weekend" },
    { value: "this-week", label: "This week" }, { value: "this-month", label: "This month" },
    { value: "upcoming", label: "Upcoming" },
  ]},
  { key: "isFree", label: "Price", options: [
    { value: "true", label: "Free only" },
  ]},
  { key: "sort", label: "Sort", options: [
    { value: "date", label: "Date ↑" }, { value: "price-asc", label: "Price ↑" },
    { value: "price-desc", label: "Price ↓" }, { value: "featured", label: "Featured" },
  ]},
];

const fmtDate = (d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

export default function EventsListPage() {
  const { city } = useParams();
  const [data, setData] = useState({ events: [], pagination: {} });
  const [filters, setFilters] = useState({ when: "upcoming", isFree: "", sort: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventService.getAll({ city, ...filters, page, limit: 12 })
      .then((d) => setData(d || { events: [], pagination: {} }))
      .catch(() => setData({ events: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const heroImg = data.events?.[0]?.heroImage || "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2000&q=80";

  return (
    <ListingShell citySlug={city} eyebrow="Events · Happening now" title={`Events in ${city.replace(/-/g, " ")}`}
      subtitle="Concerts, comedy, walks and pop-ups — what's on this month."
      count={data.pagination?.total} heroImg={heroImg}>

      <FilterBar groups={FILTERS} values={filters} count={data.pagination?.total}
        onChange={onFilter} onClear={() => { setFilters({ when: "upcoming", isFree: "", sort: "" }); setPage(1); }} />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl bg-white/5" />)}
          </div>
        ) : data.events?.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">No events match those filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.events.map((e, i) => {
              const tp = e.ticketPrice || {};
              const price = tp.isFree ? "Free" : tp.min ? `From ₹${tp.min.toLocaleString()}` : null;
              return (
                <ListingCard key={e._id} item={e} type="event" delay={i * 0.04}
                  image={getEventImage(e)}
                  href={`/cities/${city}/events/${e.slug}`}
                  primary={fmtDate(e.startDate)}
                  secondary={e.venue?.name || e.venue?.address}
                  price={price}
                  badge={e.isFeatured && "Featured"} />
              );
            })}
          </div>
        )}
        <Pagination page={page} totalPages={data.pagination?.totalPages || 1} onPage={setPage} />
      </section>
    </ListingShell>
  );
}