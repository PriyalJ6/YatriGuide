"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import useBookmarkStore from "@/store/bookmarkStore";
import useAuthStore from "@/store/authStore";

export default function ListingCard({
  item, type, image, href,
  primary, secondary, price, rating, badge,
  delay = 0,
}) {
  const toggle = useBookmarkStore((s) => s.toggle);
  const map = useBookmarkStore((s) => s.map);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // ✅ guard against missing item
  if (!item || !item._id) return null;

  const isOn = !!map[item._id];

  const onBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      if (typeof window !== "undefined") window.location.href = "/auth/login";
      return;
    }
    toggle({
      itemId: item._id,
      itemType: type,
      collectionName: "Saved",
      collectionEmoji: "🔖",
      snapshot: { name: item.name, image, citySlug: item.citySlug },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#15151A] hover:border-[#F97316]/50 transition-all duration-500"
      >
        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#F97316] text-white text-[0.65rem] tracking-wider font-bold uppercase">
              {badge}
            </span>
          )}

          <button
            onClick={onBookmark}
            title={isLoggedIn ? (isOn ? "Remove bookmark" : "Save") : "Log in to save"}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full inline-flex items-center justify-center backdrop-blur-md transition ${
              isOn ? "bg-[#F97316] text-white" : "bg-black/40 text-white hover:bg-[#F97316]"
            }`}
          >
            {isOn ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>

          {rating > 0 && (
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-semibold text-white">
              <Star size={11} fill="#F59E0B" color="#F59E0B" /> {rating}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#F97316] transition">
              {item.name}
            </h3>
            <ArrowUpRight size={17} className="text-white/30 group-hover:text-[#F97316] group-hover:rotate-12 transition shrink-0 mt-1" />
          </div>
          {primary && (
            <div className="mt-1 text-xs font-semibold text-[#F97316] uppercase tracking-wider">{primary}</div>
          )}
          {secondary && (
            <p className="mt-2 text-sm text-white/55 leading-relaxed line-clamp-2">{secondary}</p>
          )}
          {price && (
            <div className="mt-3 text-white/80 text-sm font-semibold">{price}</div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}