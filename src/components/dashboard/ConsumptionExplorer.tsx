"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { RangeTabs, type Range } from "@/components/verlauf/RangeTabs";
import { AreaFilter } from "@/components/verlauf/AreaFilter";
import { ConsumptionAreaChart, type ChartPoint } from "@/components/charts/ConsumptionAreaChart";
import { getReadings, DEMO_NOW } from "@/lib/mockData";
import { weekdayShort, formatkWh, formatIntensity, formatPercent, monthShort } from "@/lib/formatters";
import type { SensorArea } from "@/types/energy";
import { useT, useLang } from "@/lib/i18n/context";
import { useUnit } from "@/lib/units/context";
import { useStore } from "@/lib/store/context";

/**
 * Eigenständige Verbrauchsverteilung (aus dem Verlauf-Screen): Zeitraum-Tabs,
 * Bereichs-Filter, Gesamtsumme, Flächen-Chart und Eckwerte. Wird im
 * V1-Überblick als kompakter "Verlauf in einer Karte" eingesetzt.
 */
export function ConsumptionExplorer() {
  const t = useT();
  const { lang } = useLang();
  const { isIntensity, convert, unitLabel } = useUnit();
  const { activeStore } = useStore();
  const [range, setRange] = useState<Range>("week");
  const [areas, setAreas] = useState<SensorArea[]>([]);

  const data: ChartPoint[] = useMemo(() => {
    const sel = areas.length === 0 ? undefined : areas;
    const current = getReadings({ range, areas: sel, store: activeStore });
    const prevRef = new Date(DEMO_NOW);
    if (range === "day") prevRef.setDate(prevRef.getDate() - 1);
    else if (range === "week") prevRef.setDate(prevRef.getDate() - 7);
    else if (range === "month") prevRef.setDate(prevRef.getDate() - 30);
    else prevRef.setFullYear(prevRef.getFullYear() - 1);
    const previous = getReadings({ range, areas: sel, reference: prevRef, store: activeStore });
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
      const prev = previous[i]?.kWh;
      return {
        label,
        current: convert(p.kWh),
        previous: prev === undefined ? undefined : convert(prev),
      };
    });
  }, [range, areas, lang, isIntensity, convert, activeStore]);

  const totals = useMemo(() => {
    const sumCurrent = data.reduce((s, p) => s + p.current, 0);
    const sumPrev = data.reduce((s, p) => s + (p.previous ?? 0), 0);
    const peak = data.reduce((max, p) => (p.current > max.current ? p : max), data[0]);
    const trough = data.reduce((min, p) => (p.current < min.current ? p : min), data[0]);
    const delta = sumPrev > 0 ? ((sumCurrent - sumPrev) / sumPrev) * 100 : 0;
    return { sumCurrent, sumPrev, peak, trough, delta };
  }, [data]);

  const fmtVal = (v: number, digits: number) =>
    isIntensity ? formatIntensity(v, { digits }) : formatkWh(v, { digits });

  const showMwh = !isIntensity && range === "year";
  const headlineNumber = showMwh ? totals.sumCurrent / 1000 : totals.sumCurrent;

  const rangeLabelMap: Record<Range, string> = {
    day: t.history.range_label_day,
    week: t.history.range_label_week,
    month: t.history.range_label_month,
    year: t.history.range_label_year,
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
            {t.history.breadcrumb}
          </div>
          <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t.history.title_1} <span className="serif-italic text-edeka-blue">{t.history.title_2}</span>{t.history.title_3}
          </h3>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <AreaFilter
        selected={areas}
        onReset={() => setAreas([])}
        onToggle={a =>
          setAreas(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]))
        }
      />

      <motion.div
        key={range + areas.join(",")}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card relative overflow-hidden p-6 sm:p-10"
      >
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
              {t.history.total_label} {rangeLabelMap[range]} · {isIntensity ? t.units.basis_intensity : t.units.basis_total}
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="display-num text-edeka-blue-deep text-[64px] leading-[0.85] sm:text-[88px] lg:text-[112px]">
                {headlineNumber.toLocaleString("de-DE", {
                  maximumFractionDigits: range === "day" ? (isIntensity ? 2 : 0) : 1,
                })}
              </span>
              <span className="font-mono text-base font-medium text-ink-soft">
                {showMwh ? "MWh" : unitLabel}
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
          <ConsumptionAreaChart
            data={data}
            formatTick={v =>
              isIntensity
                ? v.toLocaleString("de-DE", { maximumFractionDigits: 2 })
                : `${Math.round(v)}`
            }
            formatTooltip={v => fmtVal(v, isIntensity ? 2 : 0)}
          />
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={t.history.stat_peak} value={`${totals.peak?.label ?? ""} · ${fmtVal(totals.peak?.current ?? 0, isIntensity ? 2 : 0)}`} />
          <Stat label={t.history.stat_trough} value={`${totals.trough?.label ?? ""} · ${fmtVal(totals.trough?.current ?? 0, isIntensity ? 2 : 0)}`} />
          <Stat label={t.history.stat_prev} value={fmtVal(totals.sumPrev, isIntensity ? 1 : 0)} />
          <Stat
            label={t.history.stat_trend}
            value={totals.delta < 0 ? t.history.trend_saving : t.history.trend_over}
            tone={totals.delta < 0 ? "leaf" : "ember"}
          />
        </div>
      </motion.div>
    </section>
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
