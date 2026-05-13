"use client";

import { useMemo, useState } from "react";
import { useT, useLang } from "@/lib/i18n/context";

function lerpColor(t: number): string {
  const stops: { t: number; c: [number, number, number] }[] = [
    { t: 0, c: [251, 248, 241] },
    { t: 0.35, c: [255, 240, 168] },
    { t: 0.7, c: [255, 213, 0] },
    { t: 1, c: [232, 116, 58] },
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      return `rgb(${Math.round(a.c[0] + (b.c[0] - a.c[0]) * f)},${Math.round(a.c[1] + (b.c[1] - a.c[1]) * f)},${Math.round(a.c[2] + (b.c[2] - a.c[2]) * f)})`;
    }
  }
  return "rgb(0,0,0)";
}

export function HeatmapChart({ grid }: { grid: number[][] }) {
  const t = useT();
  const { lang } = useLang();
  const WEEKDAYS = t.heatmap.weekdays;
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
  const { min, max } = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const row of grid) for (const v of row) {
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    return { min: mn, max: mx };
  }, [grid]);

  const lowLabel = lang === "en" ? "Low" : "Niedrig";
  const highLabel = lang === "en" ? "High" : "Hoch";

  return (
    <div className="w-full">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[640px]">
          <div className="ml-8 flex">
            {Array.from({ length: 24 }).map((_, h) => (
              <div
                key={h}
                className="flex-1 text-center font-mono text-[9px] uppercase tracking-wider text-ink-faint"
              >
                {h % 3 === 0 ? `${String(h).padStart(2, "0")}` : ""}
              </div>
            ))}
          </div>

          {grid.map((row, d) => (
            <div key={d} className="mt-1 flex items-center">
              <div className="w-8 text-right pr-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                {WEEKDAYS[d]}
              </div>
              <div className="flex flex-1 gap-[2px]">
                {row.map((v, h) => {
                  const norm = (v - min) / (max - min);
                  const isHover = hover?.d === d && hover?.h === h;
                  return (
                    <div
                      key={h}
                      onMouseEnter={() => setHover({ d, h })}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        background: lerpColor(norm),
                        outline: isHover ? "2px solid #003D8F" : undefined,
                      }}
                      className="aspect-square min-w-[14px] flex-1 cursor-pointer rounded-[3px] transition"
                      title={`${WEEKDAYS[d]} ${String(h).padStart(2, "0")}:00 — ${v.toFixed(1)} kWh`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{lowLabel}</span>
        <div className="flex h-2 flex-1 max-w-[280px] overflow-hidden rounded-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-1" style={{ background: lerpColor(i / 39) }} />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{highLabel}</span>
        {hover && (
          <span className="ml-auto pl-3 font-mono text-xs text-ink">
            {WEEKDAYS[hover.d]} {String(hover.h).padStart(2, "0")}:00 —{" "}
            <span className="font-semibold num">{grid[hover.d][hover.h].toFixed(1)} kWh</span>
          </span>
        )}
      </div>
    </div>
  );
}
