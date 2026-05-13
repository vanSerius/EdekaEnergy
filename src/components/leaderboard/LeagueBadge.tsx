"use client";

import { Crown } from "lucide-react";
import { LEAGUE_META, type League } from "@/types/energy";

export function LeagueBadge({ league, size = 96 }: { league: League; size?: number }) {
  const meta = LEAGUE_META[league];
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-[28px]"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${meta.bg} 0%, ${meta.color}55 100%)`,
        boxShadow: `inset 0 0 0 2px ${meta.color}, 0 14px 38px -10px ${meta.color}66`,
      }}
    >
      <Crown
        className="absolute"
        style={{ color: meta.color }}
        size={size * 0.42}
        strokeWidth={1.6}
      />
      <span
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em]"
        style={{ color: meta.color, border: `1px solid ${meta.color}` }}
      >
        {meta.label.replace("liga", "")}
      </span>
    </div>
  );
}
