"use client";

import { CalendarRange, Cloud, Coins, Zap } from "lucide-react";
import { EnergyHero } from "@/components/dashboard/EnergyHero";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TopRankTeaser } from "@/components/dashboard/TopRankTeaser";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { AreaBreakdown } from "@/components/dashboard/AreaBreakdown";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { AchievementToast } from "@/components/dashboard/AchievementToast";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { formatkWh, formatEuro, formatKg } from "@/lib/formatters";

export default function DashboardPage() {
  const m = getCurrentMarketSnapshot();

  const dayDelta =
    ((m.kpis.todayKWh - m.kpis.yesterdayKWh) / m.kpis.yesterdayKWh) * 100;
  const weekDelta =
    ((m.kpis.weekKWh - m.kpis.lastWeekKWh) / m.kpis.lastWeekKWh) * 100;
  const monthDelta =
    ((m.kpis.monthKWh - m.kpis.lastMonthKWh) / m.kpis.lastMonthKWh) * 100;

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Top: Hero + Rank/Streak column */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnergyHero />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <TopRankTeaser />
          <StreakBadge />
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Die <span className="serif-italic text-edeka-blue">Zahlen</span>, kurz & knackig.
        </h3>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-faint">
          letzte 30 Tage
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        <KpiCard
          label="Heute"
          value={formatkWh(m.kpis.todayKWh, { digits: 0, unit: false })}
          unit="kWh"
          delta={{ value: dayDelta, label: "vs. gestern", positiveIsLower: true }}
          icon={Zap}
          delay={0.02}
        />
        <KpiCard
          label="Diese Woche"
          value={formatkWh(m.kpis.weekKWh / 1000, { digits: 2, unit: false })}
          unit="MWh"
          delta={{ value: weekDelta, label: "vs. Vorwoche", positiveIsLower: true }}
          icon={CalendarRange}
          delay={0.08}
        />
        <KpiCard
          label="CO₂ gespart"
          value={formatKg(m.kpis.co2SavedKg, { digits: 0, unit: false })}
          unit="kg / 30 T."
          delta={{ value: 12.4, label: "vs. Markt-Schnitt", positiveIsLower: false }}
          icon={Cloud}
          delay={0.14}
        />
        <KpiCard
          label="Eingespart"
          value={formatEuro(m.kpis.costSavedEuro).replace(" €", "")}
          unit="€ / 30 T."
          delta={{ value: monthDelta, label: "Monatstrend", positiveIsLower: true }}
          icon={Coins}
          tone="blue"
          delay={0.2}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <AreaBreakdown />
        <InsightsCard />
      </div>

      <AchievementToast />
    </div>
  );
}
