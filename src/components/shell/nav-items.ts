import { Gauge, LineChart, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Heute", icon: Gauge },
  { href: "/verlauf", label: "Verlauf", shortLabel: "Verlauf", icon: LineChart },
  { href: "/bestenliste", label: "Bestenliste", shortLabel: "Liga", icon: Trophy },
];
