"use client";

import { motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, Info, TrendingDown } from "lucide-react";
import { getInsights } from "@/lib/mockData";
import { useT } from "@/lib/i18n/context";

export function InsightsCard() {
  const t = useT();
  const insights = getInsights();
  const iconFor = (tone: string) =>
    tone === "warning" ? AlertTriangle : tone === "positive" ? TrendingDown : Info;
  const colorFor = (tone: string) =>
    tone === "warning"
      ? "bg-ember-soft text-ember"
      : tone === "positive"
      ? "bg-leaf-soft text-leaf"
      : "bg-edeka-yellow-soft text-edeka-blue-deep";

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
            {t.dashboard.insights_label}
          </div>
          <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink">
            {t.dashboard.insights_title_1} <span className="serif-italic text-edeka-blue">{t.dashboard.insights_title_2}</span>{t.dashboard.insights_title_3}
          </h3>
        </div>
      </div>

      <ul className="relative mt-6 space-y-4">
        {insights.map((insight, idx) => {
          const Icon = iconFor(insight.tone);
          const text = t.insights[insight.id] ?? insight.text;
          return (
            <motion.li
              key={insight.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="group flex gap-3.5"
            >
              <span className={`shrink-0 rounded-2xl p-2 ${colorFor(insight.tone)}`}>
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <p className="flex-1 text-sm leading-relaxed text-ink">{text}</p>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-ink-faint opacity-0 transition group-hover:opacity-100"
                strokeWidth={2}
              />
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
