"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { OwnRankCard } from "@/components/leaderboard/OwnRankCard";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { AchievementGrid } from "@/components/leaderboard/AchievementGrid";
import { getLeaderboard } from "@/lib/mockData";
import { REGION_META, type MarketSize, type Region } from "@/types/energy";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/context";

type RegionFilter = Region | "all";
type SizeFilter = MarketSize | "all";

export default function BestenlistePage() {
  const t = useT();
  const [region, setRegion] = useState<RegionFilter>("all");
  const [size, setSize] = useState<SizeFilter>("all");

  const entries = useMemo(() => getLeaderboard({ region, size, limit: 12 }), [region, size]);

  const regionLabel =
    region === "all"
      ? t.leaderboard.nationwide
      : (t.regions[region as Region] ?? REGION_META[region as Region].label);

  return (
    <div className="space-y-8 lg:space-y-10">
      <OwnRankCard />

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
              {t.leaderboard.breadcrumb}
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {t.leaderboard.title_prefix} <span className="serif-italic text-edeka-blue">
                · {regionLabel}
              </span>
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {t.leaderboard.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterGroup label={t.leaderboard.filter_region}>
              {(["all", "nord", "sued", "ost", "west", "mitte"] as RegionFilter[]).map(r => (
                <FilterChip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(r)}
                  label={
                    r === "all"
                      ? t.leaderboard.filter_all
                      : (t.regions[`${r}_short`] ?? REGION_META[r as Region].short)
                  }
                />
              ))}
            </FilterGroup>
            <FilterGroup label={t.leaderboard.filter_size}>
              {(["all", "S", "M", "L", "XL"] as SizeFilter[]).map(s => (
                <FilterChip
                  key={s}
                  active={size === s}
                  onClick={() => setSize(s)}
                  label={s === "all" ? t.leaderboard.filter_all : s}
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
            {t.leaderboard.achievements_label}
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.leaderboard.achievements_title_1} <span className="serif-italic text-edeka-blue">{t.leaderboard.achievements_title_2}</span> {t.leaderboard.achievements_title_3}
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
