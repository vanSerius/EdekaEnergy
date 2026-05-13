"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { getAchievements } from "@/lib/mockData";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/context";

const RARITY_COLORS: Record<string, { color: string; bg: string }> = {
  gemein:   { color: "#8089A0", bg: "#F2F3F6" },
  selten:   { color: "#003D8F", bg: "#DBEAFE" },
  episch:   { color: "#001A4D", bg: "#C7D6F5" },
  legendär: { color: "#D9531E", bg: "#FBE3D5" },
};

export function AchievementGrid() {
  const t = useT();
  const list = getAchievements();

  const rarityLabel = (r: string): string =>
    (t.leaderboard as Record<string, string>)[`rarity_${r}`] ?? r;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((a, i) => {
        const rarity = RARITY_COLORS[a.rarity] ?? RARITY_COLORS["gemein"];
        const title = t.achievements[`${a.id}_title`] ?? a.title;
        const desc = t.achievements[`${a.id}_desc`] ?? a.description;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
            className={cn(
              "card relative overflow-hidden p-4 transition hover:shadow-card-lift",
              !a.unlocked && "opacity-75",
            )}
          >
            {a.unlocked && (
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl"
                style={{ background: rarity.bg }}
              />
            )}
            <div className="relative flex items-start justify-between">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl",
                  a.unlocked ? "bg-edeka-yellow" : "bg-paper-deep grayscale",
                )}
              >
                {a.unlocked ? a.icon : <Lock className="h-4 w-4 text-ink-faint" />}
              </div>
              <span
                className="pill"
                style={{
                  background: a.unlocked ? rarity.bg : "transparent",
                  color: a.unlocked ? rarity.color : "#9AA2B3",
                  border: a.unlocked ? "none" : "1px dashed #9AA2B3",
                }}
              >
                {rarityLabel(a.rarity)}
              </span>
            </div>
            <div
              className={cn(
                "relative mt-3 font-display text-sm font-semibold leading-tight",
                a.unlocked ? "text-ink" : "text-ink-faint",
              )}
            >
              {title}
            </div>
            <p
              className={cn(
                "relative mt-1 line-clamp-2 text-xs leading-snug",
                a.unlocked ? "text-ink-soft" : "text-ink-faint",
              )}
            >
              {desc}
            </p>

            {a.unlocked ? (
              <div className="relative mt-3 font-mono text-[9px] uppercase tracking-wider text-leaf">
                ✓ {t.leaderboard.unlocked_prefix}{t.leaderboard.unlocked_prefix ? " " : ""}{a.unlockedDaysAgo} {t.leaderboard.unlocked_ago}
              </div>
            ) : (
              <div className="relative mt-3">
                <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                  {t.leaderboard.progress} {Math.round((a.progress ?? 0) * 100)} %
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-ink-faint"
                    style={{ width: `${(a.progress ?? 0) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
