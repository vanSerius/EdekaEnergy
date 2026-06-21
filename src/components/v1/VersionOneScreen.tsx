"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { EdekaMark } from "@/components/brand/EdekaMark";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import { DashboardKpis } from "@/components/dashboard/DashboardKpis";
import { AreaBreakdown } from "@/components/dashboard/AreaBreakdown";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { ConsumptionExplorer } from "@/components/dashboard/ConsumptionExplorer";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { useT } from "@/lib/i18n/context";

export function VersionOneScreen({ onBack }: { onBack: () => void }) {
  const t = useT();
  const market = getCurrentMarketSnapshot();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.landing.back}</span>
            </button>
            <div className="flex items-center gap-2.5">
              <EdekaMark size={26} />
              <div className="flex flex-col leading-tight">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
                  {t.landing.v1_screen_eyebrow}
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-ink">
                  {market.displayName.split(" · ")[0].replace("EDEKA ", "")}
                </span>
              </div>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mx-auto w-full max-w-[1320px] space-y-8 lg:space-y-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t.landing.v1_screen_title}
              <span className="serif-italic text-edeka-blue">.</span>
            </h1>
          </motion.div>

          <DashboardKpis />

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <AreaBreakdown />
            <InsightsCard />
          </div>

          <ConsumptionExplorer />
        </div>
      </main>
    </div>
  );
}
