"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Zap } from "lucide-react";
import { SparkLine } from "@/components/charts/SparkLine";
import { formatPercent, formatRelativeMinutes } from "@/lib/formatters";
import { getCurrentMarketSnapshot, getReadings, DEMO_NOW } from "@/lib/mockData";
import { useT, useLang } from "@/lib/i18n/context";

export function EnergyHero() {
  const t = useT();
  const { lang } = useLang();
  const market = getCurrentMarketSnapshot();
  const todayReadings = getReadings({ range: "day" });
  const values = todayReadings.slice(0, DEMO_NOW.getHours() + 1).map(r => r.kWh);

  const delta =
    ((market.kpis.todayKWh - market.kpis.yesterdayKWh) / market.kpis.yesterdayKWh) * 100;
  const lower = delta < 0;
  const TrendIcon = lower ? ArrowDownRight : ArrowUpRight;

  const relMinutes = formatRelativeMinutes(market.updatedAtMinutesAgo, t.shell.updated);

  return (
    <motion.section
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="block-yellow relative overflow-hidden p-6 sm:p-10 lg:p-12"
    >
      {/* Top: status strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-edeka-blue-deep opacity-50" />
            <span className="relative h-2 w-2 rounded-full bg-edeka-blue-deep" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-edeka-blue-deep">
            {t.hero.live_prefix} · {DEMO_NOW.toLocaleDateString(lang === "en" ? "en-GB" : "de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
        <div className="hidden sm:block font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-edeka-blue-deep/70">
          {relMinutes} · {market.kpis.currentLoadKw.toFixed(1)} kW
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative mt-6"
      >
        <h2 className="font-display text-2xl font-semibold leading-[1.05] tracking-tight text-edeka-blue-deep sm:text-3xl lg:text-4xl">
          {t.hero.headline_1} <span className="serif-italic">{t.hero.headline_2}</span> {t.hero.headline_3}
        </h2>
      </motion.div>

      {/* MASSIVE NUMBER */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-4 flex flex-wrap items-end gap-x-6 gap-y-4"
      >
        <div className="relative">
          <span className="display-num block text-edeka-blue-deep text-[120px] leading-[0.85] sm:text-[180px] lg:text-[240px]">
            {market.kpis.todayKWh.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
          </span>
          <span className="absolute -right-1 bottom-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-edeka-blue-deep/70">
            kWh
          </span>
        </div>

        <div className="ml-auto flex flex-col items-end gap-3 pb-4">
          <motion.div
            initial={{ scale: 0, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 220, damping: 18 }}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              lower ? "bg-leaf text-paper" : "bg-edeka-blue-deep text-paper"
            }`}
          >
            <TrendIcon className="h-4 w-4" strokeWidth={2.6} />
            <span className="num">{formatPercent(delta, { signed: true })}</span>
            <span className="text-paper/70">{t.hero.vs_yesterday}</span>
          </motion.div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-edeka-blue-deep">
            <Zap className="h-3 w-3" strokeWidth={2.6} fill="currentColor" />
            <span className="num">{market.kpis.currentLoadKw.toFixed(1)} kW</span>
            <span className="opacity-70">{t.hero.current}</span>
          </div>
        </div>
      </motion.div>

      {/* Sparkline */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="relative mt-8"
      >
        <SparkLine
          values={values}
          height={150}
          stroke="#001A4D"
          fillFrom="rgba(0,26,77,0.20)"
          fillTo="rgba(0,26,77,0)"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-edeka-blue-deep/60">
          <span>00 · 00</span>
          <span>06 · 00</span>
          <span>12 · 00</span>
          <span>18 · 00</span>
          <span className="text-edeka-blue-deep">{t.hero.now}</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
