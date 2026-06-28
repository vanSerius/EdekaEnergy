"use client";

import { DashboardKpis } from "@/components/dashboard/DashboardKpis";
import { AreaBreakdown } from "@/components/dashboard/AreaBreakdown";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { ConsumptionExplorer } from "@/components/dashboard/ConsumptionExplorer";
import { RankTeaser } from "@/components/dashboard/RankTeaser";
import { useT } from "@/lib/i18n/context";

/**
 * Gemeinsamer Inhalt des Basis-Überblicks — verwendet im V1-Screen und in der
 * Manager-Ansicht (V0.9). Zeigt immer die Daten des aktiven Markts
 * (siehe StoreProvider).
 *
 * variant "v09" (Manager): Verbrauch zuerst (alles auf den ersten Blick),
 * direkt darunter der reine Markt-Rang ohne Liga-Namen.
 */
export function OverviewSections({ variant = "v1" }: { variant?: "v1" | "v09" }) {
  const t = useT();

  if (variant === "v09") {
    return (
      <div className="space-y-8 lg:space-y-10">
        <ConsumptionExplorer title={t.admin.consumption_title} hideBreadcrumb />

        <RankTeaser showLeague={false} />

        <DashboardKpis />

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <AreaBreakdown />
          <InsightsCard />
        </div>
      </div>
    );
  }

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
