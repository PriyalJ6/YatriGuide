"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ListingShell({ citySlug, eyebrow, title, subtitle, count, heroImg, children }) {
  return (
    <main className="bg-[#0B0B0D] text-white min-h-screen pt-[4.5rem]">
      {/* Hero strip */}
      <section className="relative h-[40vh] min-h-[280px] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-[#0B0B0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/70 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-10">

          {/* Only show Back link when we have a citySlug (city-scoped pages) */}
          {citySlug ? (
            <Link href={`/cities/${citySlug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-[#F97316] text-sm mb-4 transition w-fit">
              <ArrowLeft size={14} /> Back to {citySlug.replace(/-/g, " ")}
            </Link>
          ) : (
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-[#F97316] text-sm mb-4 transition w-fit">
              <ArrowLeft size={14} /> Back to home
            </Link>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#F97316]" />
            <span className="text-[0.7rem] tracking-[0.35em] text-[#F97316] font-bold uppercase">{eyebrow}</span>
          </div>
          <h1 className="font-black tracking-[-0.03em] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            {title}<span className="text-[#F97316]">.</span>
          </h1>
          {subtitle && <p className="mt-3 text-white/70 max-w-xl">{subtitle}</p>}
          {count !== undefined && (
            <div className="mt-3 text-sm text-white/50">{count} {count === 1 ? "result" : "results"}</div>
          )}
        </div>
      </section>

      {children}
    </main>
  );
}