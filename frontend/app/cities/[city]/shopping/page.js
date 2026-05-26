"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { shoppingService, getShoppingImage } from "@/services/shopping.service";
import ListingShell from "@/components/listing/ListingShell";
import ListingCard from "@/components/listing/ListingCard";
import FilterBar from "@/components/listing/FilterBar";
import Pagination from "@/components/listing/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = [
  { key: "type", label: "Type", options: [
    { value: "bazaar",        label: "Bazaars" },
    { value: "mall",          label: "Malls" },
    { value: "boutique",      label: "Boutiques" },
    { value: "street-market", label: "Street Markets" },
    { value: "flea-market",   label: "Flea Markets" },
    { value: "antique",       label: "Antiques" },
  ]},
  { key: "minRating", label: "Rating", options: [
    { value: "4.5", label: "4.5+" },
    { value: "4",   label: "4+" },
  ]},
];

export default function ShoppingListPage() {
  const { city } = useParams();
  const [data, setData] = useState({ markets: [], pagination: {} });
  const [filters, setFilters] = useState({ type: "", minRating: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    shoppingService.getAll({ city, ...filters, page, limit: 12 })
      .then((d) => setData(d || { markets: [], pagination: {} }))
      .catch((err) => { console.error("Shopping fetch error:", err); setData({ markets: [], pagination: {} }); })
      .finally(() => setLoading(false));
  }, [city, filters, page]);

  const onFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const onClear = () => { setFilters({ type: "", minRating: "" }); setPage(1); };
  const mosaicImages = (data.markets || []).slice(0, 5).map(getShoppingImage);

  return (
    <ListingShell
      citySlug={city}
      eyebrow="Shop · Curated"
      title={`Shopping in ${city.replace(/-/g, " ")}`}
      subtitle="Bazaars, boutiques, antique lanes — what to buy and where to find it."
      count={data.pagination?.total}
      mosaicImages={mosaicImages}
    >
      <FilterBar groups={FILTERS} values={filters} count={data.pagination?.total} onChange={onFilter} onClear={onClear} />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl bg-white/5" />)}
          </div>
        ) : data.markets?.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">No shopping spots match those filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.markets.map((m, i) => (
              <ListingCard
                key={m._id}
                item={m}
                type="shopping"
                delay={i * 0.04}
                image={getShoppingImage(m)}
                href={`/cities/${city}/shopping/${m.slug}`}
                primary={(m.type || "").replace(/-/g, " ")}
                secondary={m.tagline || (m.categories || []).slice(0, 3).join(" · ")}
                rating={m.rating}
                badge={m.isFeatured && "Featured"}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data.pagination?.totalPages || 1} onPage={setPage} />
      </section>
    </ListingShell>
  );
}