"use client";

import { DashboardKpis } from "@/components/dashboard/DashboardKpis";
import { AreaBreakdown } from "@/components/dashboard/AreaBreakdown";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { ConsumptionExplorer } from "@/components/dashboard/ConsumptionExplorer";
import { RankTeaser } from "@/components/dashboard/RankTeaser";

/**
 * Gemeinsamer Inhalt des Basis-Überblicks — verwendet im V1-Screen und in der
 * Manager-Ansicht (V0.9). Zeigt immer die Daten des aktiven Markts
 * (siehe StoreProvider).
 */
export function OverviewSections() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <RankTeaser />

      <DashboardKpis />

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <AreaBreakdown />
        <InsightsCard />
      </div>

      <ConsumptionExplorer />
    </div>
  );
}
