"use client";
import { Sliders, X } from "lucide-react";

/**
 * Generic filter chips. Pass: { groups: [{ key, label, options: [{value,label}] }], values, onChange, onClear }
 */
export default function FilterBar({ groups, values, onChange, onClear, count }) {
  const hasActive = Object.values(values || {}).some((v) => v && v.length);

  return (
    <div className="border-y border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5">
        <div className="flex items-center gap-3 mb-4">
          <Sliders size={15} className="text-[#F97316]" />
          <span className="text-[0.7rem] tracking-[0.3em] text-white/60 font-bold uppercase">Filter</span>
          {count !== undefined && (
            <span className="text-xs text-white/40">· {count} results</span>
          )}
          {hasActive && (
            <button onClick={onClear} className="ml-auto inline-flex items-center gap-1 text-xs text-[#F97316] hover:underline">
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.key} className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40 mr-2 min-w-[80px]">{g.label}</span>
              {g.options.map((o) => {
                const isOn = values[g.key] === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => onChange(g.key, isOn ? "" : o.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                      isOn
                        ? "bg-[#F97316] text-white border-[#F97316]"
                        : "bg-white/5 text-white/70 border-white/15 hover:border-[#F97316]/50 hover:text-[#F97316]"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}