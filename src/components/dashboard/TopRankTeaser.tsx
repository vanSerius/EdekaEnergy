"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Trophy } from "lucide-react";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { LEAGUE_META } from "@/types/energy";

export function TopRankTeaser() {
  const m = getCurrentMarketSnapshot();
  const league = LEAGUE_META[m.league];
  const movedUp = m.rankLastWeek - m.rank;

  return (
    <Link href="/bestenliste" className="group block h-full">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="block-navy relative h-full overflow-hidden p-6 sm:p-7"
      >
        {/* Decorative giant rank number */}
        <span
          aria-hidden
          className="display-num pointer-events-none absolute -right-4 -top-10 select-none text-[240px] leading-none text-edeka-yellow/10"
        >
          #{m.rank}
        </span>

        <div className="relative flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-edeka-yellow" strokeWidth={2.4} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-edeka-yellow">
            {league.label}
          </span>
        </div>

        <div className="relative mt-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper/55">
            Dein Markt belegt aktuell
          </div>
          <div className="mt-2 flex items-end gap-3">
            <span className="display-num text-[88px] leading-[0.8] text-edeka-yellow sm:text-[100px]">
              #{m.rank}
            </span>
            <span className="pb-3 font-serif text-xl italic text-paper/75">
              von {m.totalMarkets}
            </span>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          {movedUp > 0 ? (
            <span className="pill bg-leaf text-paper">▲ {movedUp} Ränge diese Woche</span>
          ) : movedUp < 0 ? (
            <span className="pill bg-ember text-paper">▼ {Math.abs(movedUp)}</span>
          ) : (
            <span className="pill bg-white/15 text-paper">stabil</span>
          )}
          <span className="pill bg-white/10 text-paper/70">noch 2 für Platinliga</span>
        </div>

        <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-medium">
          <span className="font-serif text-lg italic text-paper">Zur Bestenliste</span>
          <motion.span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-edeka-yellow text-edeka-blue-deep"
            whileHover={{ scale: 1.1, rotate: 12 }}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
