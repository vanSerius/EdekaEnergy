"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { OwnRankCard } from "@/components/leaderboard/OwnRankCard";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { AchievementGrid } from "@/components/leaderboard/AchievementGrid";
import { getLeaderboard } from "@/lib/mockData";
import { REGION_META, type MarketSize, type Region } from "@/types/energy";
import { cn } from "@/lib/cn";

type RegionFilter = Region | "all";
type SizeFilter = MarketSize | "all";

export default function BestenlistePage() {
  const [region, setRegion] = useState<RegionFilter>("all");
  const [size, setSize] = useState<SizeFilter>("all");

  const entries = useMemo(() => getLeaderboard({ region, size, limit: 12 }), [region, size]);

  return (
    <div className="space-y-8 lg:space-y-10">
      <OwnRankCard />

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
              Bestenliste · Anonym, fair, motivierend
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Top 12 <span className="serif-italic text-edeka-blue">
                · {region === "all" ? "deutschlandweit" : REGION_META[region as Region].label}
              </span>
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Vergleich nach kWh pro m². Andere Märkte sind anonymisiert.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterGroup label="Region">
              {(["all", "nord", "sued", "ost", "west", "mitte"] as RegionFilter[]).map(r => (
                <FilterChip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(r)}
                  label={r === "all" ? "Alle" : REGION_META[r as Region].short}
                />
              ))}
            </FilterGroup>
            <FilterGroup label="Größe">
              {(["all", "S", "M", "L", "XL"] as SizeFilter[]).map(s => (
                <FilterChip
                  key={s}
                  active={size === s}
                  onClick={() => setSize(s)}
                  label={s === "all" ? "Alle" : s}
                />
              ))}
            </FilterGroup>
          </div>
        </div>

        <motion.div
          key={`${region}-${size}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <LeaderboardList entries={entries} />
        </motion.div>
      </section>

      <section className="space-y-5">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
            Achievements · Trophäenkabinett
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Was du <span className="serif-italic text-edeka-blue">erreicht</span> hast.
          </h2>
        </div>
        <AchievementGrid />
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-2">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-ink-faint">{label}</span>
      <div className="flex gap-0.5">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-edeka-blue-deep text-paper" : "text-ink-soft hover:bg-paper-soft hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
