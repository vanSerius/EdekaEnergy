"use client";

import { motion } from "motion/react";
import { SENSOR_AREAS, type SensorArea } from "@/types/energy";
import { cn } from "@/lib/cn";

export function AreaFilter({
  selected,
  onToggle,
  onReset,
}: {
  selected: SensorArea[];
  onToggle: (a: SensorArea) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onReset}
        className={cn(
          "cursor-pointer rounded-full px-3 py-2 text-xs font-medium transition",
          selected.length === 0
            ? "bg-edeka-blue-deep text-paper shadow-deep"
            : "border border-line bg-paper text-ink-soft hover:bg-paper-soft hover:text-ink",
        )}
      >
        Alle Bereiche
      </button>
      {SENSOR_AREAS.map(a => {
        const active = selected.includes(a.id);
        return (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onToggle(a.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition",
              active
                ? "bg-edeka-yellow text-edeka-blue-deep shadow-yellow-glow"
                : "border border-line bg-paper text-ink-soft hover:bg-paper-soft hover:text-ink",
            )}
          >
            <span className="text-sm leading-none">{a.emoji}</span>
            {a.label}
          </motion.button>
        );
      })}
    </div>
  );
}
