"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { formatIntensity } from "@/lib/formatters";
import { LEAGUE_META } from "@/types/energy";
import { useT } from "@/lib/i18n/context";
import { useStore } from "@/lib/store/context";

/**
 * Kompakter Rang-Hinweis für den V1-Überblick (und V0.9):
 * "Dein Markt belegt aktuell #7 von 247" — inkl. Liga, Wochen-Veränderung
 * und kWh/m² als Vergleichsbasis. Bewusst NICHT verlinkt, da V1/V0.9 keine
 * eigene Bestenliste haben.
 */
export function RankTeaser() {
  const t = useT();
  const { activeStore } = useStore();
  const m = getCurrentMarketSnapshot(activeStore);
  const league = LEAGUE_META[m.league];
  const movedUp = m.rankLastWeek - m.rank;
  // kWh pro m² auf Wochenbasis — die faire Vergleichskennzahl.
  const intensityPerWeek = m.kpis.weekKWh / m.squareMeters;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="block-navy relative overflow-hidden p-5 sm:p-6"
    >
      {/* Decorative giant rank number */}
      <span
        aria-hidden
        className="display-num pointer-events-none absolute -right-3 -top-8 select-none text-[150px] leading-none text-edeka-yellow/10"
      >
        #{m.rank}
      </span>

      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-edeka-yellow text-edeka-blue-deep">
            <Trophy className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-edeka-yellow">
              {t.leagues[m.league]}
            </div>
            <div className="mt-1 text-sm text-paper/70">
              {t.rank_teaser.current}{" "}
              <span className="display-num align-baseline text-2xl text-edeka-yellow">#{m.rank}</span>{" "}
              <span className="font-serif italic text-paper/75">
                {t.rank_teaser.of} {m.totalMarkets}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {movedUp > 0 ? (
            <span className="pill bg-leaf px-3 py-1.5 text-paper">
              <ArrowUp className="h-3.5 w-3.5" />
              {movedUp} {t.rank_teaser.weeks_up}
            </span>
          ) : movedUp < 0 ? (
            <span className="pill bg-ember px-3 py-1.5 text-paper">
              <ArrowDown className="h-3.5 w-3.5" />
              {Math.abs(movedUp)} {t.leaderboard.ranks_down}
            </span>
          ) : (
            <span className="pill bg-white/15 px-3 py-1.5 text-paper">
              <Minus className="h-3.5 w-3.5" />
              {t.rank_teaser.stable}
            </span>
          )}
          <span className="pill bg-white/10 px-3 py-1.5 text-paper/75">
            <span className="num">{formatIntensity(intensityPerWeek, { digits: 1 })}</span>
            <span className="text-paper/50">· {t.units.basis_intensity}</span>
          </span>
        </div>

        {activeStore.isOwn && league.next && (
          <span className="ml-auto hidden font-serif text-sm italic text-paper/65 sm:inline">
            {t.rank_teaser.to_platinum}
          </span>
        )}
      </div>
    </motion.div>
  );
}
