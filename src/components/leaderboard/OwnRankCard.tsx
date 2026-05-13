"use client";

import { motion } from "motion/react";
import { ArrowUp, ArrowDown, Flame, Sparkles } from "lucide-react";
import { getCurrentMarketSnapshot, getOwnEntry } from "@/lib/mockData";
import { LeagueBadge } from "./LeagueBadge";
import { LEAGUE_META } from "@/types/energy";

export function OwnRankCard() {
  const market = getCurrentMarketSnapshot();
  const entry = getOwnEntry();
  const league = LEAGUE_META[market.league];
  const movedUp = market.rankLastWeek - market.rank;

  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="block-yellow relative overflow-hidden p-6 sm:p-10 lg:p-12"
    >
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-3.5 w-3.5 text-edeka-blue-deep" strokeWidth={2.4} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-edeka-blue-deep">
              Dein Markt · {league.label}
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-edeka-blue-deep sm:text-5xl lg:text-6xl">
            Du bist auf{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 -skew-y-1 rounded bg-edeka-blue-deep/15 lg:h-4"
              />
              <span className="relative">Platz {market.rank}</span>
            </span>
            <br />
            <span className="serif-italic">von {market.totalMarkets}</span>.
          </h1>
          <p className="max-w-md text-sm font-medium text-edeka-blue-deep/80 sm:text-base">
            {entry.kWhPerSqm.toFixed(1)} kWh / m² · {market.squareMeters} m² · {market.displayName.split(" · ")[1]}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {movedUp > 0 ? (
              <span className="pill bg-edeka-blue-deep px-3 py-1.5 text-paper">
                <ArrowUp className="h-3.5 w-3.5" />
                {movedUp} Ränge diese Woche
              </span>
            ) : (
              <span className="pill bg-ember px-3 py-1.5 text-paper">
                <ArrowDown className="h-3.5 w-3.5" />
                {Math.abs(movedUp)} Ränge
              </span>
            )}
            <span className="pill bg-edeka-blue-deep/10 px-3 py-1.5 text-edeka-blue-deep">
              <Flame className="h-3.5 w-3.5" strokeWidth={2.4} fill="currentColor" />
              {market.streakDays}-Tage-Serie
            </span>
          </div>

          {league.next && (
            <div className="mt-5 max-w-md">
              <div className="flex justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-edeka-blue-deep">
                <span>Aufstieg in {LEAGUE_META[league.next].label}</span>
                <span className="num">{market.rank - 2} von 25 Rängen frei</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-edeka-blue-deep/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(8, ((25 - market.rank + 2) / 25) * 100)}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-edeka-blue-deep"
                />
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
          className="animate-float"
        >
          <LeagueBadge league={market.league} size={140} />
        </motion.div>
      </div>
    </motion.section>
  );
}
