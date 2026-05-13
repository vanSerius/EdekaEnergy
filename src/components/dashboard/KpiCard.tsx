"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

export interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: { value: number; label?: string; positiveIsLower?: boolean };
  icon: LucideIcon;
  tone?: "default" | "yellow" | "blue";
  delay?: number;
}

export function KpiCard({ label, value, unit, delta, icon: Icon, tone = "default", delay = 0 }: KpiCardProps) {
  const isLower = delta && delta.value < 0;
  const isGood = delta ? (delta.positiveIsLower ? isLower : !isLower) : null;
  const TrendIcon = isLower ? TrendingDown : TrendingUp;

  const containerCls = {
    default: "card",
    yellow: "block-yellow",
    blue: "block-navy",
  }[tone];

  const isBlue = tone === "blue";
  const isYellow = tone === "yellow";

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(containerCls, "group relative overflow-hidden p-5 sm:p-6")}
    >
      <div className="relative flex items-center justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-2xl",
            isBlue
              ? "bg-edeka-yellow text-edeka-blue-deep"
              : isYellow
              ? "bg-edeka-blue-deep text-edeka-yellow"
              : "bg-paper-soft text-edeka-blue ring-1 ring-line",
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
        {delta && (
          <span
            className={cn(
              "pill",
              isBlue
                ? "bg-white/15 text-paper"
                : isYellow
                ? isGood
                  ? "bg-edeka-blue-deep text-paper"
                  : "bg-edeka-blue-deep text-paper"
                : isGood
                ? "bg-leaf-soft text-leaf"
                : "bg-ember-soft text-ember",
            )}
          >
            <TrendIcon className="h-3 w-3" strokeWidth={2.6} />
            <span className="num">
              {delta.value > 0 ? "+" : ""}
              {delta.value.toFixed(1)} %
            </span>
          </span>
        )}
      </div>

      <div
        className={cn(
          "relative mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.24em]",
          isBlue ? "text-edeka-yellow" : isYellow ? "text-edeka-blue-deep/70" : "text-ink-soft",
        )}
      >
        {label}
      </div>
      <div className="relative mt-1 flex items-baseline gap-1.5">
        <span
          className={cn(
            "display-num text-4xl sm:text-5xl",
            isBlue ? "text-paper" : isYellow ? "text-edeka-blue-deep" : "text-ink",
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn(
              "font-mono text-xs font-medium",
              isBlue ? "text-paper/70" : isYellow ? "text-edeka-blue-deep/70" : "text-ink-soft",
            )}
          >
            {unit}
          </span>
        )}
      </div>
      {delta?.label && (
        <div
          className={cn(
            "relative mt-1.5 text-[11px]",
            isBlue ? "text-paper/60" : isYellow ? "text-edeka-blue-deep/60" : "text-ink-soft",
          )}
        >
          {delta.label}
        </div>
      )}
    </motion.div>
  );
}
