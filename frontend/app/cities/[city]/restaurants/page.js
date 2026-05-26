"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { restaurantService, getRestaurantImage } from "@/services/restuarant.service";
import ListingShell from "@/components/listing/ListingShell";
import ListingCard from "@/components/listing/ListingCard";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ values match the proper-case strings stored in your MongoDB
const FILTERS = [
  { key: "cuisine", label: "Cuisine", options: [
    { value: "North Indian",   label: "North Indian" },
    { value: "South Indian",   label: "South Indian" },
    { value: "Modern Indian",  label: "Modern Indian" },
    { value: "Mughlai",        label: "Mughlai" },
    { value: "Chinese",        label: "Chinese" },
    { value: "Pan-Asian",      label: "Pan-Asian" },
    { value: "Continental",    label: "Continental" },
    { value: "Italian",        label: "Italian" },
    { value: "Bengali",        label: "Bengali" },
    { value: "Parsi",          label: "Parsi" },
    { value: "Seafood",        label: "Seafood" },
    { value: "Street Food",    label: "Street Food" },
  ]},
  { key: "priceRange", label: "Price", options: [
    { value: "₹",    label: "₹" },
    { value: "₹₹",   label: "₹₹" },
    { value: "₹₹₹",  label: "₹₹₹" },
    { value: "₹₹₹₹", label: "₹₹₹₹" },
  ]},
  { key: "minRating", label: "Rating", options: [
    { value: "4.5", label: "4.5+" },
    { value: "4",   label: "4+" },
  ]},
];

export default function RestaurantsListPage() {
  const { city } = useParams();
  const [data, setData] = useState({ restaurants: [], pagination: {} });
  const [filters, setFilters] = useState({ cuisine: "", priceRange: "", minRating: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    restaurantService.getAll({ city, ...filters, page, limit: 12 })
      .then((d) => setData(d || { restaurants: [], pagination: {} }))
      .catch((err) => { console.error("Restaurants fetch error:", err); setData({ restaurants: [], pagination: {} }); })
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const onClear = () => { setFilters({ cuisine: "", priceRange: "", minRating: "" }); setPage(1); };

  const mosaicImages = (data.restaurants || []).slice(0, 5).map(getRestaurantImage);

  return (
    <ListingShell
      citySlug={city}
      eyebrow="Eat · Like a local"
      title={`Restaurants in ${city.replace(/-/g, " ")}`}
      subtitle="Where the locals actually eat — heritage kitchens, hidden cafes and street legends."
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
        ) : data.restaurants?.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No restaurants match those filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.restaurants.map((r, i) => (
              <ListingCard
                key={r._id}
                item={r}
                type="restaurant"
                delay={i * 0.04}
                image={getRestaurantImage(r)}
                href={`/cities/${city}/restaurants/${r.slug}`}
                primary={`${(r.cuisine || []).slice(0, 2).join(", ")} · ${r.priceRange || ""}`}
                secondary={r.tagline || r.shortDescription}
                rating={r.rating}
                badge={r.isFeatured && "Featured"}
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