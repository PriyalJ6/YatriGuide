"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { placeService, getPlaceImage } from "@/services/place.service";
import ListingShell from "@/components/listing/ListingShell";
import ListingCard from "@/components/listing/ListingCard";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = [
  { key: "category", label: "Category", options: [
    { value: "monument",  label: "Monuments" },
    { value: "fort",      label: "Forts" },
    { value: "temple",    label: "Temples" },
    { value: "park",      label: "Parks" },
    { value: "museum",    label: "Museums" },
    { value: "viewpoint", label: "Viewpoints" },
  ]},
  { key: "minRating", label: "Rating", options: [
    { value: "4.5", label: "4.5+" },
    { value: "4",   label: "4+" },
    { value: "3.5", label: "3.5+" },
  ]},
];

export default function PlacesListPage() {
  const { city } = useParams();
  const [data, setData] = useState({ places: [], pagination: {} });
  const [filters, setFilters] = useState({ category: "", minRating: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    placeService.getAll({ city, ...filters, page, limit: 12 })
      .then((d) => setData(d || { places: [], pagination: {} }))
      .catch((err) => { console.error("Places fetch error:", err); setData({ places: [], pagination: {} }); })
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const onClear = () => { setFilters({ category: "", minRating: "" }); setPage(1); };

  // Top 5 real images for the editorial mosaic header
  const mosaicImages = (data.places || []).slice(0, 5).map(getPlaceImage);

  return (
    <ListingShell
      citySlug={city}
      eyebrow="Places · City Guide"
      title={`Places in ${city.replace(/-/g, " ")}`}
      subtitle="Forts, monuments, temples and viewpoints — every spot verified by locals."
      count={data.pagination?.total}
      mosaicImages={mosaicImages}
    >
      <FilterBar
        groups={FILTERS}
        values={filters}
        count={data.pagination?.total}
        onChange={onFilter}
        onClear={onClear}
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : data.places?.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No places match those filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.places.map((p, i) => (
              <ListingCard
                key={p._id}
                item={p}
                type="place"
                delay={i * 0.04}
                image={getPlaceImage(p)}
                href={`/cities/${city}/places/${p.slug}`}
                primary={p.category?.replace(/-/g, " ")}
                secondary={p.tagline || p.shortDescription}
                rating={p.rating}
                badge={p.isFeatured && "Featured"}
              />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          totalPages={data.pagination?.totalPages || 1}
          onPage={setPage}
        />
      </section>
    </ListingShell>
  );
}
