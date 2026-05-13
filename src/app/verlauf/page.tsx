"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, TrendingDown } from "lucide-react";
import { RangeTabs, type Range } from "@/components/verlauf/RangeTabs";
import { AreaFilter } from "@/components/verlauf/AreaFilter";
import { ConsumptionAreaChart, type ChartPoint } from "@/components/charts/ConsumptionAreaChart";
import { HeatmapChart } from "@/components/charts/HeatmapChart";
import { getReadings, getHeatmap, DEMO_NOW } from "@/lib/mockData";
import { weekdayShort, formatkWh, formatPercent, monthShort } from "@/lib/formatters";
import type { SensorArea } from "@/types/energy";
import { useT, useLang } from "@/lib/i18n/context";

export default function VerlaufPage() {
  const t = useT();
  const { lang } = useLang();
  const [range, setRange] = useState<Range>("week");
  const [areas, setAreas] = useState<SensorArea[]>([]);

  const data: ChartPoint[] = useMemo(() => {
    const sel = areas.length === 0 ? undefined : areas;
    const current = getReadings({ range, areas: sel });
    const prevRef = new Date(DEMO_NOW);
    if (range === "day") prevRef.setDate(prevRef.getDate() - 1);
    else if (range === "week") prevRef.setDate(prevRef.getDate() - 7);
    else if (range === "month") prevRef.setDate(prevRef.getDate() - 30);
    else prevRef.setFullYear(prevRef.getFullYear() - 1);
    const previous = getReadings({ range, areas: sel, reference: prevRef });
    return current.map((p, i) => {
      const labelDate = p.timestamp;
      const label =
        range === "day"
          ? `${String(labelDate.getHours()).padStart(2, "0")} Uhr`
          : range === "week"
          ? weekdayShort(labelDate, lang)
          : range === "month"
          ? `${labelDate.getDate()}.`
          : monthShort(labelDate, lang);
      return {
        label,
        current: p.kWh,
        previous: previous[i]?.kWh,
      };
    });
  }, [range, areas, lang]);

  const totals = useMemo(() => {
    const sumCurrent = data.reduce((s, p) => s + p.current, 0);
    const sumPrev = data.reduce((s, p) => s + (p.previous ?? 0), 0);
    const peak = data.reduce((max, p) => (p.current > max.current ? p : max), data[0]);
    const trough = data.reduce((min, p) => (p.current < min.current ? p : min), data[0]);
    const delta = sumPrev > 0 ? ((sumCurrent - sumPrev) / sumPrev) * 100 : 0;
    return { sumCurrent, sumPrev, peak, trough, delta };
  }, [data]);

  const heatmap = useMemo(() => getHeatmap(), []);

  const rangeLabelMap: Record<Range, string> = {
    day: t.history.range_label_day,
    week: t.history.range_label_week,
    month: t.history.range_label_month,
    year: t.history.range_label_year,
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      <motion.header
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
              {t.history.breadcrumb}
            </div>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t.history.title_1} <br /><span className="serif-italic text-edeka-blue">{t.history.title_2}</span>{t.history.title_3}
            </h1>
          </div>
          <RangeTabs value={range} onChange={setRange} />
        </div>
      </motion.header>

      <AreaFilter
        selected={areas}
        onReset={() => setAreas([])}
        onToggle={(a) =>
          setAreas(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]))
        }
      />

      <motion.section
        key={range + areas.join(",")}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card relative overflow-hidden p-6 sm:p-10"
      >
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
              {t.history.total_label} {rangeLabelMap[range]}
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="display-num text-edeka-blue-deep text-[64px] leading-[0.85] sm:text-[88px] lg:text-[112px]">
                {(totals.sumCurrent / (range === "year" ? 1000 : 1)).toLocaleString("de-DE", {
                  maximumFractionDigits: range === "day" ? 0 : 1,
                })}
              </span>
              <span className="font-mono text-base font-medium text-ink-soft">
                {range === "year" ? "MWh" : "kWh"}
              </span>
              <span
                className={`pill px-3 py-1.5 text-sm font-semibold ${
                  totals.delta < 0 ? "bg-leaf text-paper" : "bg-edeka-blue-deep text-paper"
                }`}
              >
                {totals.delta < 0 ? (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                )}
                <span className="num">{formatPercent(totals.delta, { signed: true })}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            <Legend swatch="#001A4D" label={t.history.legend_current} />
            <Legend swatch="#8089A0" label={t.history.legend_prev} dashed />
          </div>
        </div>

        <div className="relative mt-8">
          <ConsumptionAreaChart data={data} />
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={t.history.stat_peak} value={`${totals.peak?.label ?? ""} · ${formatkWh(totals.peak?.current ?? 0, { digits: 0 })}`} />
          <Stat label={t.history.stat_trough} value={`${totals.trough?.label ?? ""} · ${formatkWh(totals.trough?.current ?? 0, { digits: 0 })}`} />
          <Stat label={t.history.stat_prev} value={formatkWh(totals.sumPrev, { digits: 0 })} />
          <Stat
            label={t.history.stat_trend}
            value={totals.delta < 0 ? t.history.trend_saving : t.history.trend_over}
            tone={totals.delta < 0 ? "leaf" : "ember"}
          />
        </div>
      </motion.section>

      <section className="card relative overflow-hidden p-6 sm:p-10">
        <div className="relative mb-6 flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
              {t.history.heatmap_label}
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t.history.heatmap_title_1} <span className="serif-italic text-edeka-blue">{t.history.heatmap_title_2}</span>{t.history.heatmap_title_3}
            </h2>
          </div>
        </div>
        <div className="relative">
          <HeatmapChart grid={heatmap} />
        </div>
      </section>

      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div className="relative flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-leaf" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
            {t.history.insights_label}
          </span>
        </div>
        <ul className="relative mt-4 space-y-3 text-sm text-ink">
          <li>
            <span className="font-semibold text-edeka-blue">{t.history.insight_1_area}</span>{" "}
            {t.history.insight_1}
          </li>
          <li>
            <span className="font-semibold text-edeka-blue">{t.history.insight_2_area}</span>{" "}
            {t.history.insight_2}
          </li>
          <li>
            <span className="font-semibold text-edeka-blue">{t.history.insight_3_area}</span>{" "}
            {t.history.insight_3}
          </li>
        </ul>
      </section>
    </div>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
      <span
        className="h-0.5 w-6 rounded-full"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${swatch} 0 4px, transparent 4px 8px)`
            : swatch,
        }}
      />
      {label}
    </div>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "leaf" | "ember" }) {
  const c = tone === "leaf" ? "text-leaf" : tone === "ember" ? "text-ember" : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-paper-soft p-4">
      <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-faint">{label}</div>
      <div className={`mt-1.5 font-display text-base font-semibold ${c}`}>{value}</div>
    </div>
  );
}
