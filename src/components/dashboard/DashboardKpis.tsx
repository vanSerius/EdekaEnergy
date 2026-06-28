"use client";

import { CalendarRange, Cloud, Coins, Zap } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { formatkWh, formatEuro, formatKg } from "@/lib/formatters";
import { useT } from "@/lib/i18n/context";
import { useUnit } from "@/lib/units/context";
import { useStore } from "@/lib/store/context";

/**
 * "Die Zahlen, kurz & knackig" — Überschrift + die vier Kern-KPIs.
 * Wird sowohl im V2-Dashboard als auch im V1-Überblick verwendet.
 */
export function DashboardKpis() {
  const t = useT();
  const { isIntensity, format, unitLabel } = useUnit();
  const { activeStore } = useStore();
  const m = getCurrentMarketSnapshot(activeStore);

  const dayDelta =
    ((m.kpis.todayKWh - m.kpis.yesterdayKWh) / m.kpis.yesterdayKWh) * 100;
  const weekDelta =
    ((m.kpis.weekKWh - m.kpis.lastWeekKWh) / m.kpis.lastWeekKWh) * 100;
  const monthDelta =
    ((m.kpis.monthKWh - m.kpis.lastMonthKWh) / m.kpis.lastMonthKWh) * 100;

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t.dashboard.numbers_title} <span className="serif-italic text-edeka-blue">{t.dashboard.numbers_italic}</span>{t.dashboard.numbers_suffix}
        </h3>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-faint">
          {t.dashboard.section_label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        <KpiCard
          label={t.dashboard.kpi_today}
          value={
            isIntensity
              ? format(m.kpis.todayKWh, { digits: 2, unit: false })
              : formatkWh(m.kpis.todayKWh, { digits: 0, unit: false })
          }
          unit={isIntensity ? unitLabel : t.dashboard.unit_kwh_day}
          delta={{ value: dayDelta, label: t.dashboard.delta_yesterday, positiveIsLower: true }}
          icon={Zap}
          delay={0.02}
        />
        <KpiCard
          label={t.dashboard.kpi_week}
          value={
            isIntensity
              ? format(m.kpis.weekKWh, { digits: 1, unit: false })
              : formatkWh(m.kpis.weekKWh / 1000, { digits: 2, unit: false })
          }
          unit={isIntensity ? unitLabel : t.dashboard.unit_mwh}
          delta={{ value: weekDelta, label: t.dashboard.delta_last_week, positiveIsLower: true }}
          icon={CalendarRange}
          delay={0.08}
        />
        <KpiCard
          label={t.dashboard.kpi_co2}
          value={formatKg(m.kpis.co2SavedKg, { digits: 0, unit: false })}
          unit={t.dashboard.unit_kg}
          delta={{ value: 12.4, label: t.dashboard.delta_market_avg, positiveIsLower: false }}
          icon={Cloud}
          delay={0.14}
        />
        <KpiCard
          label={t.dashboard.kpi_saved}
          value={formatEuro(m.kpis.costSavedEuro).replace(" €", "")}
          unit={t.dashboard.unit_euro}
          delta={{ value: monthDelta, label: t.dashboard.delta_month_trend, positiveIsLower: true }}
          icon={Coins}
          tone="blue"
          delay={0.2}
        />
      </div>
    </div>
  );
}
