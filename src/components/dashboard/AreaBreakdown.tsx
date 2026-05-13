"use client";

import { motion } from "motion/react";
import { getAreaBreakdown } from "@/lib/mockData";
import { SENSOR_AREAS } from "@/types/energy";
import { formatkWh, formatPercent } from "@/lib/formatters";

// Strict on-brand palette: ink, navy, yellow, leaf, ember, soft gray
const COLORS = ["#001A4D", "#FFD500", "#003D8F", "#1F9E63", "#D9531E", "#8089A0"];

export function AreaBreakdown() {
  const breakdown = getAreaBreakdown();
  const total = breakdown.reduce((s, b) => s + b.kWh, 0);
  const sorted = [...breakdown].sort((a, b) => b.kWh - a.kWh);

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="card relative overflow-hidden p-6 sm:p-8"
    >
      <div className="relative flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
            Heute nach Bereich
          </div>
          <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink">
            Wo geht <span className="serif-italic text-edeka-blue">der Saft</span> hin?
          </h3>
        </div>
        <div className="num font-mono text-xs text-ink-faint">
          Σ {formatkWh(total, { digits: 0 })}
        </div>
      </div>

      <div className="relative mt-6 flex h-6 w-full overflow-hidden rounded-full bg-paper-soft ring-1 ring-line">
        {sorted.map((s, i) => {
          const pct = (s.kWh / total) * 100;
          return (
            <motion.div
              key={s.area}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: COLORS[i] }}
              title={`${s.area}: ${pct.toFixed(1)} %`}
            />
          );
        })}
      </div>

      <ul className="relative mt-6 space-y-3">
        {sorted.map((s, i) => {
          const meta = SENSOR_AREAS.find(a => a.id === s.area)!;
          const pct = (s.kWh / total) * 100;
          return (
            <motion.li
              key={s.area}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i] }}
              />
              <span className="flex-1 truncate text-sm font-medium text-ink">{meta.label}</span>
              <span className="num font-mono text-xs text-ink-soft">
                {formatkWh(s.kWh, { digits: 0 })}
              </span>
              <span className="num w-16 text-right font-display text-base font-semibold text-ink">
                {formatPercent(pct, { digits: 0 })}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
