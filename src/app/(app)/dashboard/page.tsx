"use client";

import { EnergyHero } from "@/components/dashboard/EnergyHero";
import { TopRankTeaser } from "@/components/dashboard/TopRankTeaser";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { DashboardKpis } from "@/components/dashboard/DashboardKpis";
import { AreaBreakdown } from "@/components/dashboard/AreaBreakdown";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { AchievementToast } from "@/components/dashboard/AchievementToast";

export default function DashboardPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Top: Hero + Rank/Streak column */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnergyHero />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <TopRankTeaser />
          <StreakBadge />
        </div>
      </div>

      <DashboardKpis />

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <AreaBreakdown />
        <InsightsCard />
      </div>

      <AchievementToast />
    </div>
  );
}
