"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        className="w-10 h-10 rounded-full border border-white/15 inline-flex items-center justify-center text-white hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white transition">
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) => p === "…" ? (
        <span key={`d${i}`} className="text-white/30 px-2">…</span>
      ) : (
        <button key={p} onClick={() => onPage(p)}
          className={`min-w-[40px] h-10 px-3 rounded-full text-sm font-semibold transition ${
            p === page ? "bg-[#F97316] text-white" : "text-white/70 hover:text-[#F97316]"
          }`}>{p}</button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}
        className="w-10 h-10 rounded-full border border-white/15 inline-flex items-center justify-center text-white hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white transition">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
