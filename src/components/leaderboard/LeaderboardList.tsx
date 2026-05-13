"use client";

import { motion } from "motion/react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { type LeaderboardEntry, LEAGUE_META, REGION_META } from "@/types/energy";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/context";

export function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const t = useT();

  return (
    <div className="flex flex-col gap-2">
      <div className="hidden grid-cols-12 gap-2 px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint sm:grid">
        <span className="col-span-1">{t.leaderboard.col_hash}</span>
        <span className="col-span-4">{t.leaderboard.col_market}</span>
        <span className="col-span-2">{t.leaderboard.col_region}</span>
        <span className="col-span-2">{t.leaderboard.col_size}</span>
        <span className="col-span-2 text-right">{t.leaderboard.col_kwh}</span>
        <span className="col-span-1 text-right">{t.leaderboard.col_delta}</span>
      </div>
      {entries.map((e, i) => {
        const league = LEAGUE_META[e.league];
        const isFirst = e.rank === 1;
        const isTop3 = e.rank <= 3;
        const regionLabel = t.regions[e.region] ?? REGION_META[e.region].label;
        const displayName = e.isOwn ? t.leaderboard.your_market : e.anonName;
        return (
          <motion.div
            key={e.marketId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
            className={cn(
              "grid grid-cols-12 items-center gap-2 rounded-2xl px-5 py-3.5 transition cursor-pointer",
              e.isOwn
                ? "block-yellow"
                : isFirst
                ? "border border-edeka-yellow bg-edeka-yellow/8 shadow-yellow-glow"
                : isTop3
                ? "card border-line-strong"
                : "card hover:shadow-card-lift",
            )}
          >
            <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
              {isTop3 ? (
                <span
                  className={cn(
                    "display-num",
                    isFirst ? "text-4xl text-edeka-yellow-deep" : "text-3xl",
                    e.rank === 2 && "text-ink-soft",
                    e.rank === 3 && "text-ember",
                  )}
                >
                  {e.rank}
                </span>
              ) : (
                <span className={cn("num font-mono text-sm font-medium", e.isOwn ? "text-edeka-blue-deep" : "text-ink-soft")}>
                  {e.rank}
                </span>
              )}
            </div>
            <div className="col-span-7 flex items-center gap-2.5 sm:col-span-4">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: league.color }}
              />
              <span
                className={cn(
                  "truncate font-display text-base font-semibold",
                  e.isOwn ? "text-edeka-blue-deep" : isFirst ? "text-edeka-blue-deep" : "text-ink",
                )}
              >
                {displayName}
              </span>
              {e.isOwn && (
                <span className="pill bg-edeka-blue-deep text-paper">{t.leaderboard.you}</span>
              )}
              {isFirst && !e.isOwn && (
                <span className="pill bg-edeka-yellow text-edeka-blue-deep">🥇</span>
              )}
            </div>
            <div className={cn("col-span-3 hidden text-sm sm:col-span-2 sm:block", e.isOwn ? "text-edeka-blue-deep/80" : "text-ink-soft")}>
              {regionLabel}
            </div>
            <div className={cn("col-span-3 hidden text-sm sm:col-span-2 sm:block", e.isOwn ? "text-edeka-blue-deep/80" : "text-ink-soft")}>
              {e.size}
            </div>
            <div className="col-span-3 text-right sm:col-span-2">
              <span className={cn(
                "num font-display text-lg font-semibold",
                e.isOwn ? "text-edeka-blue-deep" : isFirst ? "text-edeka-blue-deep" : "text-ink"
              )}>
                {e.kWhPerSqm.toFixed(1)}
              </span>
              <span className={cn("ml-1 font-mono text-[10px]", e.isOwn ? "text-edeka-blue-deep/70" : "text-ink-soft")}>
                kWh/m²
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <DeltaPill v={e.delta} ownTone={e.isOwn} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function DeltaPill({ v, ownTone }: { v: number; ownTone: boolean }) {
  if (v === 0) {
    return (
      <span className={cn("pill", ownTone ? "bg-edeka-blue-deep/10 text-edeka-blue-deep" : "bg-ink/5 text-ink-soft")}>
        <Minus className="h-3 w-3" />
      </span>
    );
  }
  if (v > 0) {
    return (
      <span className={cn("pill", ownTone ? "bg-edeka-blue-deep text-paper" : "bg-leaf-soft text-leaf")}>
        <ArrowUp className="h-3 w-3" />
        <span className="num">{v}</span>
      </span>
    );
  }
  return (
    <span className={cn("pill", ownTone ? "bg-edeka-blue-deep text-paper" : "bg-ember-soft text-ember")}>
      <ArrowDown className="h-3 w-3" />
      <span className="num">{Math.abs(v)}</span>
    </span>
  );
}
