"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/context";

export type Range = "day" | "week" | "month" | "year";

export function RangeTabs({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  const t = useT();

  const TABS: { id: Range; label: string }[] = [
    { id: "day", label: t.history.range_day },
    { id: "week", label: t.history.range_week },
    { id: "month", label: t.history.range_month },
    { id: "year", label: t.history.range_year },
  ];

  return (
    <div className="inline-flex rounded-full border border-line bg-paper p-1 shadow-card">
      {TABS.map(tab => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
              active ? "text-edeka-blue-deep" : "text-ink-soft hover:text-ink",
            )}
          >
            {active && (
              <motion.div
                layoutId="range-active"
                className="absolute inset-0 rounded-full bg-edeka-yellow shadow-yellow-glow"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
