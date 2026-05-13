"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export type Range = "day" | "week" | "month" | "year";

const TABS: { id: Range; label: string }[] = [
  { id: "day", label: "Tag" },
  { id: "week", label: "Woche" },
  { id: "month", label: "Monat" },
  { id: "year", label: "Jahr" },
];

export function RangeTabs({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-paper p-1 shadow-card">
      {TABS.map(t => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
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
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
