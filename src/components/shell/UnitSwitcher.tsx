"use client";

import { motion } from "motion/react";
import { useUnit, type UnitMode } from "@/lib/units/context";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

const OPTIONS: { mode: UnitMode; label: string }[] = [
  { mode: "total", label: "kWh" },
  { mode: "intensity", label: "kWh/m²" },
];

export function UnitSwitcher() {
  const { mode, setMode } = useUnit();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t.units.switch_label}
      className="flex items-center rounded-full border border-line bg-paper p-0.5"
    >
      {OPTIONS.map(opt => {
        const active = mode === opt.mode;
        return (
          <motion.button
            key={opt.mode}
            onClick={() => setMode(opt.mode)}
            whileTap={{ scale: 0.9 }}
            aria-pressed={active}
            title={opt.mode === "intensity" ? t.units.intensity_hint : t.units.total_hint}
            className={cn(
              "relative cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              active ? "text-edeka-blue-deep" : "text-ink-faint hover:text-ink-soft",
            )}
          >
            {active && (
              <motion.div
                layoutId="unit-active"
                className="absolute inset-0 rounded-full bg-edeka-yellow"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-mono tracking-wide">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
