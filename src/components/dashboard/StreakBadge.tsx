"use client";

import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { useT } from "@/lib/i18n/context";

export function StreakBadge() {
  const t = useT();
  const m = getCurrentMarketSnapshot();
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="card relative h-full overflow-hidden p-6 sm:p-7"
    >
      <div className="relative flex items-center gap-2">
        <Flame className="h-3.5 w-3.5 text-ember" strokeWidth={2.6} fill="currentColor" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
          {t.streak.label}
        </span>
      </div>

      <div className="relative mt-5 flex items-end gap-3">
        <span className="display-num text-[80px] leading-[0.8] text-ink">
          {m.streakDays}
        </span>
        <span className="pb-3 font-serif text-xl italic text-ink-soft">{t.streak.days}</span>
      </div>

      <p className="relative mt-2 text-sm text-ink-soft">
        {t.streak.subtitle} <span className="font-serif italic text-ink">{t.streak.subtitle_italic}</span>
      </p>

      <div className="relative mt-5 flex gap-0.5">
        {Array.from({ length: 14 }).map((_, i) => {
          const active = i < m.streakDays;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
              className={`h-7 flex-1 origin-bottom rounded ${active ? "bg-edeka-yellow" : "bg-line"}`}
            />
          );
        })}
      </div>
      <div className="relative mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        <span>{t.streak.two_weeks_ago}</span>
        <span>{t.streak.today}</span>
      </div>
    </motion.div>
  );
}
