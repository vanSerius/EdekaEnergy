export type SensorArea =
  | "kuehlung"
  | "beleuchtung"
  | "backstation"
  | "heizung"
  | "klima"
  | "sonstiges";

export type Region = "nord" | "sued" | "ost" | "west" | "mitte";

export type MarketSize = "S" | "M" | "L" | "XL";

export type League = "bronze" | "silber" | "gold" | "platin";

export interface SensorAreaMeta {
  id: SensorArea;
  label: string;
  emoji: string;
  description: string;
}

export const SENSOR_AREAS: SensorAreaMeta[] = [
  { id: "kuehlung", label: "Kühlung", emoji: "❄️", description: "Truhen, Kühlregale, Lagerkühlung" },
  { id: "beleuchtung", label: "Beleuchtung", emoji: "💡", description: "Verkaufsraum & Außenbereich" },
  { id: "backstation", label: "Backstation", emoji: "🥨", description: "Öfen und Aufbackgeräte" },
  { id: "heizung", label: "Heizung", emoji: "🔥", description: "Wärmeversorgung der Räume" },
  { id: "klima", label: "Klima", emoji: "🌬️", description: "Klimaanlage & Lüftung" },
  { id: "sonstiges", label: "Sonstiges", emoji: "⚙️", description: "Kassen, Pfandautomaten, IT" },
];

export const REGION_META: Record<Region, { label: string; short: string }> = {
  nord: { label: "Region Nord", short: "N" },
  sued: { label: "Region Süd", short: "S" },
  ost: { label: "Region Ost", short: "O" },
  west: { label: "Region West", short: "W" },
  mitte: { label: "Region Mitte", short: "M" },
};

export const LEAGUE_META: Record<League, { label: string; color: string; bg: string; next: League | null }> = {
  bronze: { label: "Bronzeliga", color: "#A0763C", bg: "#F1E0CB", next: "silber" },
  silber: { label: "Silberliga", color: "#6E7891", bg: "#E1E5EE", next: "gold" },
  gold: { label: "Goldliga", color: "#B68500", bg: "#FFE9A0", next: "platin" },
  platin: { label: "Platinliga", color: "#1E5BC6", bg: "#D6E4FA", next: null },
};

export interface EnergyReading {
  timestamp: Date;
  kWh: number;
  area: SensorArea;
}

export interface KpiSet {
  todayKWh: number;
  yesterdayKWh: number;
  weekKWh: number;
  lastWeekKWh: number;
  monthKWh: number;
  lastMonthKWh: number;
  co2SavedKg: number;
  costSavedEuro: number;
  currentLoadKw: number;
}

export interface MarketSnapshot {
  id: string;
  displayName: string;
  region: Region;
  size: MarketSize;
  squareMeters: number;
  league: League;
  rank: number;
  totalMarkets: number;
  rankLastWeek: number;
  streakDays: number;
  kpis: KpiSet;
  updatedAtMinutesAgo: number;
}

export interface LeaderboardEntry {
  marketId: string;
  rank: number;
  region: Region;
  size: MarketSize;
  kWhPerSqm: number;
  league: League;
  delta: number;
  isOwn: boolean;
  anonName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  unlockedDaysAgo?: number;
  rarity: "gemein" | "selten" | "episch" | "legendär";
}

export interface Insight {
  id: string;
  text: string;
  tone: "info" | "positive" | "warning";
}
