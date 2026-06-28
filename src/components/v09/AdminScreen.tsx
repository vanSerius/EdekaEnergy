"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { EdekaMark } from "@/components/brand/EdekaMark";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import { UnitSwitcher } from "@/components/shell/UnitSwitcher";
import { StoreSwitcher } from "@/components/v09/StoreSwitcher";
import { OverviewSections } from "@/components/v1/OverviewSections";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { useT } from "@/lib/i18n/context";
import { useStore } from "@/lib/store/context";

/**
 * Version 0.9 — Manager-/Admin-Ansicht. Wie der V1-Überblick, aber mit
 * Markt-Auswahl links: Der Manager kann jeden Markt wählen und dessen Werte
 * sehen. Der kWh ↔ kWh/m²-Umschalter ist hier verfügbar, weil der Vergleich
 * unterschiedlich großer Märkte genau hier gebraucht wird.
 */
export function AdminScreen({ onBack }: { onBack: () => void }) {
  const t = useT();
  const { activeStore } = useStore();
  const market = getCurrentMarketSnapshot(activeStore);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
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
                  {t.landing.v09_screen_eyebrow}
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-ink">
                  {market.displayName.split(" · ")[0].replace("EDEKA ", "")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <UnitSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mx-auto w-full max-w-[1480px]">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 lg:mb-10"
          >
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-faint">
              {t.landing.v09_screen_eyebrow}
            </div>
            <h1 className="mt-1.5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t.landing.v09_screen_title}
              <span className="serif-italic text-edeka-blue">.</span>
            </h1>
          </motion.div>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <StoreSwitcher />
            <div className="min-w-0 flex-1">
              <motion.div
                key={activeStore.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <OverviewSections />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
