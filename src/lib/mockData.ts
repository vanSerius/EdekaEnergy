import seedrandom from "seedrandom";
import {
  Achievement,
  EnergyReading,
  Insight,
  LeaderboardEntry,
  League,
  MarketSize,
  MarketSnapshot,
  Region,
  SensorArea,
} from "@/types/energy";

const SEED = "edeka-energie-2026";
const rng = seedrandom(SEED);

// Verkaufsfläche des eigenen Markts in m² — zentrale Quelle für die
// Umrechnung von kWh in kWh/m² (Energieintensität, fairer Markt-Vergleich).
export const OWN_MARKET_SQM = 1240;

function rand(min: number, max: number): number {
  return min + rng() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Deterministic "demo time": fixed date to keep numbers stable across reloads.
// Today, Tuesday 2026-05-12, 14:23 local.
export const DEMO_NOW = new Date(2026, 4, 12, 14, 23, 0);

const AREA_SHARE: Record<SensorArea, number> = {
  kuehlung: 0.38,
  beleuchtung: 0.18,
  backstation: 0.14,
  heizung: 0.08,
  klima: 0.13,
  sonstiges: 0.09,
};

// Hourly demand curve per area (0..23). Multiplier on baseline.
function hourlyProfile(hour: number, area: SensorArea): number {
  switch (area) {
    case "kuehlung":
      // Very flat with mild mid-day climb due to door openings
      return 0.85 + 0.25 * Math.sin(((hour - 6) * Math.PI) / 14);
    case "beleuchtung":
      // Off at night, full from 7-21
      if (hour < 5 || hour > 22) return 0.05;
      if (hour < 7 || hour > 20) return 0.55;
      return 1.0;
    case "backstation":
      // Spikes 5-9, mild 14-18
      if (hour >= 5 && hour < 9) return 1.6 + (hour === 6 ? 0.4 : 0);
      if (hour >= 14 && hour < 18) return 1.0;
      if (hour >= 4 && hour < 22) return 0.4;
      return 0.1;
    case "heizung":
      // Morning warmup + evening
      if (hour >= 5 && hour < 9) return 1.3;
      if (hour >= 17 && hour < 21) return 1.1;
      if (hour < 5 || hour > 22) return 0.4;
      return 0.7;
    case "klima":
      // Midday-heavy
      if (hour >= 11 && hour < 19) return 1.4;
      if (hour < 6 || hour > 21) return 0.2;
      return 0.7;
    case "sonstiges":
      if (hour < 6 || hour > 21) return 0.35;
      return 0.85 + (hour >= 17 && hour < 20 ? 0.4 : 0);
  }
}

function weekdayMultiplier(date: Date): number {
  const d = date.getDay();
  // Sun=0 (closed-ish), Mon=1..Sat=6
  if (d === 0) return 0.25;
  if (d === 6) return 1.15;
  if (d === 5) return 1.1; // Friday
  if (d === 1) return 0.95;
  return 1.0;
}

const BASELINE_KW = 38; // average load in kW for a mid-size EDEKA

/**
 * Profil eines einzelnen EDEKA-Markts. Jeder Markt hat seine eigene
 * Verkaufsfläche und Grundlast, damit sich Verbräuche realistisch
 * unterscheiden — Basis für die Manager-Ansicht (V0.9) und den
 * fairen kWh/m²-Vergleich.
 */
export interface StoreProfile {
  id: string;
  /** Anzeigename inkl. "EDEKA …" */
  name: string;
  /** Standort/Stadtteil */
  city: string;
  region: Region;
  size: MarketSize;
  squareMeters: number;
  /** Durchschnittliche Grundlast in kW (skaliert die Verbrauchskurve). */
  loadKw: number;
  /**
   * Salz für das deterministische Rauschen je Markt. Der eigene Markt nutzt
   * "" → identische Zahlen wie bisher; andere Märkte erhalten ein eigenes
   * Muster.
   */
  salt: string;
  league: League;
  rank: number;
  rankLastWeek: number;
  streakDays: number;
  isOwn: boolean;
}

// Der eigene Markt — Zahlen bleiben exakt wie zuvor (loadKw = BASELINE_KW,
// salt = "", Fläche = OWN_MARKET_SQM).
export const OWN_STORE: StoreProfile = {
  id: "edeka-4721",
  name: "EDEKA Wagner",
  city: "Hamburg-Eppendorf",
  region: "nord",
  size: "M",
  squareMeters: OWN_MARKET_SQM,
  loadKw: BASELINE_KW,
  salt: "",
  league: "gold",
  rank: 7,
  rankLastWeek: 11,
  streakDays: 12,
  isOwn: true,
};

/**
 * Markt-Roster für die Manager-Ansicht (V0.9). Der eigene Markt steht an
 * erster Stelle; die übrigen variieren in Größe, Fläche und Grundlast.
 */
export const STORES: StoreProfile[] = [
  OWN_STORE,
  {
    id: "edeka-3185",
    name: "EDEKA Sommer",
    city: "München-Schwabing",
    region: "sued",
    size: "L",
    squareMeters: 1860,
    loadKw: 53,
    salt: "sommer",
    league: "platin",
    rank: 3,
    rankLastWeek: 5,
    streakDays: 24,
    isOwn: false,
  },
  {
    id: "edeka-5602",
    name: "EDEKA Brinkmann",
    city: "Köln-Nippes",
    region: "west",
    size: "M",
    squareMeters: 1080,
    loadKw: 33,
    salt: "brinkmann",
    league: "gold",
    rank: 21,
    rankLastWeek: 18,
    streakDays: 6,
    isOwn: false,
  },
  {
    id: "edeka-2940",
    name: "EDEKA Voss",
    city: "Berlin-Pankow",
    region: "ost",
    size: "XL",
    squareMeters: 2450,
    loadKw: 72,
    salt: "voss",
    league: "silber",
    rank: 42,
    rankLastWeek: 36,
    streakDays: 0,
    isOwn: false,
  },
  {
    id: "edeka-7731",
    name: "EDEKA Keller",
    city: "Frankfurt-Bornheim",
    region: "mitte",
    size: "S",
    squareMeters: 720,
    loadKw: 22,
    salt: "keller",
    league: "gold",
    rank: 14,
    rankLastWeek: 14,
    streakDays: 9,
    isOwn: false,
  },
  {
    id: "edeka-6118",
    name: "EDEKA Hofmann",
    city: "Stuttgart-Bad Cannstatt",
    region: "sued",
    size: "M",
    squareMeters: 1320,
    loadKw: 42,
    salt: "hofmann",
    league: "silber",
    rank: 58,
    rankLastWeek: 63,
    streakDays: 3,
    isOwn: false,
  },
  {
    id: "edeka-4488",
    name: "EDEKA Naumann",
    city: "Leipzig-Gohlis",
    region: "ost",
    size: "L",
    squareMeters: 1640,
    loadKw: 49,
    salt: "naumann",
    league: "bronze",
    rank: 96,
    rankLastWeek: 88,
    streakDays: 0,
    isOwn: false,
  },
  {
    id: "edeka-5377",
    name: "EDEKA Petersen",
    city: "Bremen-Findorff",
    region: "nord",
    size: "M",
    squareMeters: 1150,
    loadKw: 35,
    salt: "petersen",
    league: "gold",
    rank: 33,
    rankLastWeek: 29,
    streakDays: 7,
    isOwn: false,
  },
];

export function getStoreById(id: string): StoreProfile {
  return STORES.find(s => s.id === id) ?? OWN_STORE;
}

function consumptionAt(date: Date, area: SensorArea, store: StoreProfile = OWN_STORE): number {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const t = hour + minute / 60;
  // smooth between hours
  const lo = Math.floor(t);
  const hi = (lo + 1) % 24;
  const frac = t - lo;
  const profile = hourlyProfile(lo, area) * (1 - frac) + hourlyProfile(hi, area) * frac;
  const share = AREA_SHARE[area];
  const wkMult = weekdayMultiplier(date);
  // Deterministic noise based on store+date+area (own store keeps legacy seed)
  const saltPrefix = store.salt ? `${store.salt}-` : "";
  const noiseSeed = seedrandom(`${saltPrefix}${date.toISOString().slice(0, 13)}-${area}`);
  const noise = 0.9 + noiseSeed() * 0.2;
  return store.loadKw * share * profile * wkMult * noise; // in kW for that minute snapshot
}

// kWh accumulated for an hour at given time
function hourlyKWh(date: Date, area: SensorArea, store: StoreProfile = OWN_STORE): number {
  return consumptionAt(date, area, store); // 1 hour at avg kW = kWh
}

export const AREAS: SensorArea[] = ["kuehlung", "beleuchtung", "backstation", "heizung", "klima", "sonstiges"];

export interface ReadingsQuery {
  range: "day" | "week" | "month" | "year";
  areas?: SensorArea[];
  reference?: Date; // end date, defaults to DEMO_NOW
  store?: StoreProfile; // defaults to the own market
}

export function getReadings(q: ReadingsQuery): EnergyReading[] {
  const ref = q.reference ?? DEMO_NOW;
  const areas = q.areas && q.areas.length > 0 ? q.areas : AREAS;
  const store = q.store ?? OWN_STORE;
  const result: EnergyReading[] = [];

  if (q.range === "day") {
    // 24 hours, hourly
    const start = new Date(ref);
    start.setHours(0, 0, 0, 0);
    for (let h = 0; h < 24; h++) {
      const ts = new Date(start);
      ts.setHours(h);
      const total = areas.reduce((sum, a) => sum + hourlyKWh(ts, a, store), 0);
      result.push({ timestamp: ts, kWh: total, area: "sonstiges" });
    }
  } else if (q.range === "week") {
    // 7 days, daily totals
    for (let i = 6; i >= 0; i--) {
      const day = new Date(ref);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      let total = 0;
      for (let h = 0; h < 24; h++) {
        const ts = new Date(day);
        ts.setHours(h);
        total += areas.reduce((sum, a) => sum + hourlyKWh(ts, a, store), 0);
      }
      result.push({ timestamp: day, kWh: total, area: "sonstiges" });
    }
  } else if (q.range === "month") {
    // last 30 days
    for (let i = 29; i >= 0; i--) {
      const day = new Date(ref);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      let total = 0;
      for (let h = 0; h < 24; h++) {
        const ts = new Date(day);
        ts.setHours(h);
        total += areas.reduce((sum, a) => sum + hourlyKWh(ts, a, store), 0);
      }
      // gentle downward trend over the month — story of improvement
      const trend = 1 + (i / 30) * 0.12;
      result.push({ timestamp: day, kWh: total * trend, area: "sonstiges" });
    }
  } else {
    // year — 12 monthly totals
    for (let i = 11; i >= 0; i--) {
      const day = new Date(ref);
      day.setMonth(day.getMonth() - i, 15);
      day.setHours(0, 0, 0, 0);
      // approximate monthly total: avg daily × 30
      let total = 0;
      for (let h = 0; h < 24; h++) {
        const ts = new Date(day);
        ts.setHours(h);
        total += areas.reduce((sum, a) => sum + hourlyKWh(ts, a, store), 0);
      }
      const monthFactor = 28 + (day.getMonth() >= 4 && day.getMonth() <= 8 ? 4 : 0); // summer slightly higher
      // seasonal modulation
      const seasonal = 1 + 0.15 * Math.cos(((day.getMonth() - 1) * Math.PI) / 6);
      result.push({ timestamp: day, kWh: total * monthFactor * seasonal, area: "sonstiges" });
    }
  }
  return result;
}

// Per-area breakdown for today
export function getAreaBreakdown(
  store: StoreProfile = OWN_STORE,
  reference: Date = DEMO_NOW,
): { area: SensorArea; kWh: number }[] {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  return AREAS.map(area => {
    let total = 0;
    for (let h = 0; h < 24; h++) {
      const ts = new Date(start);
      ts.setHours(h);
      total += hourlyKWh(ts, area, store);
    }
    return { area, kWh: total };
  });
}

// Heatmap: rows = weekdays (Mo-So), cols = hours (0-23), value = avg kWh
export function getHeatmap(): number[][] {
  const grid: number[][] = [];
  // collect 4 weeks of data
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      let sum = 0;
      let n = 0;
      for (let w = 0; w < 6; w++) {
        const d = new Date(DEMO_NOW);
        d.setDate(d.getDate() - w * 7 - ((d.getDay() + 6) % 7) + day);
        d.setHours(hour, 0, 0, 0);
        sum += AREAS.reduce((s, a) => s + hourlyKWh(d, a), 0);
        n++;
      }
      row.push(sum / n);
    }
    grid.push(row);
  }
  return grid;
}

// Build current snapshot for a given market (defaults to the own market).
export function getCurrentMarketSnapshot(store: StoreProfile = OWN_STORE): MarketSnapshot {
  const todayReadings = getReadings({ range: "day", store });
  // sum of hours up to current
  const hourNow = DEMO_NOW.getHours();
  const todayKWh = todayReadings.slice(0, hourNow + 1).reduce((s, r) => s + r.kWh, 0);

  const yesterday = new Date(DEMO_NOW);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 0, 0);
  const ydReadings = getReadings({ range: "day", reference: yesterday, store });
  const yesterdayKWh = ydReadings.slice(0, hourNow + 1).reduce((s, r) => s + r.kWh, 0);

  const weekReadings = getReadings({ range: "week", store });
  const weekKWh = weekReadings.reduce((s, r) => s + r.kWh, 0);

  const lastWeekRef = new Date(DEMO_NOW);
  lastWeekRef.setDate(lastWeekRef.getDate() - 7);
  const lastWeekReadings = getReadings({ range: "week", reference: lastWeekRef, store });
  const lastWeekKWh = lastWeekReadings.reduce((s, r) => s + r.kWh, 0);

  const monthReadings = getReadings({ range: "month", store });
  const monthKWh = monthReadings.reduce((s, r) => s + r.kWh, 0);

  const lastMonthRef = new Date(DEMO_NOW);
  lastMonthRef.setDate(lastMonthRef.getDate() - 30);
  const lastMonthReadings = getReadings({ range: "month", reference: lastMonthRef, store });
  const lastMonthKWh = lastMonthReadings.reduce((s, r) => s + r.kWh, 0);

  // Current live kW
  const currentLoadKw = AREAS.reduce((s, a) => s + consumptionAt(DEMO_NOW, a, store), 0);

  // CO2 ratio: 0.36 kg/kWh (German mix), savings vs avg
  const expectedKWh = weekKWh * 1.12; // assume 12% above without this market
  const co2SavedKg = Math.max(0, (expectedKWh - weekKWh) * 0.36);
  const costSavedEuro = Math.max(0, (expectedKWh - weekKWh) * 0.32);

  return {
    id: store.id,
    displayName: `${store.name} · ${store.city}`,
    region: store.region,
    size: store.size,
    squareMeters: store.squareMeters,
    league: store.league,
    rank: store.rank,
    totalMarkets: 247,
    rankLastWeek: store.rankLastWeek,
    streakDays: store.streakDays,
    updatedAtMinutesAgo: 3,
    kpis: {
      todayKWh,
      yesterdayKWh,
      weekKWh,
      lastWeekKWh,
      monthKWh,
      lastMonthKWh,
      co2SavedKg,
      costSavedEuro,
      currentLoadKw,
    },
  };
}

// Generate 247 anonymous markets for the leaderboard
const REGIONS: Region[] = ["nord", "sued", "ost", "west", "mitte"];
const SIZES: MarketSize[] = ["S", "M", "L", "XL"];

interface MarketRecord {
  id: string;
  rank: number;
  region: Region;
  size: MarketSize;
  kWhPerSqm: number;
  league: League;
  delta: number;
  isOwn: boolean;
}

function buildAllMarkets(): MarketRecord[] {
  const lbRng = seedrandom("edeka-leaderboard-2026");
  const list: MarketRecord[] = [];
  const total = 247;
  for (let i = 0; i < total; i++) {
    const id = `m-${4500 + i}`;
    const region = REGIONS[Math.floor(lbRng() * REGIONS.length)];
    const size = SIZES[Math.floor(lbRng() * SIZES.length)];
    // efficiency: lower kWh/sqm/week is better
    const eff = 18 + lbRng() * 14; // 18..32
    list.push({
      id,
      rank: 0,
      region,
      size,
      kWhPerSqm: eff,
      league: "bronze",
      delta: Math.round((lbRng() - 0.5) * 8),
      isOwn: false,
    });
  }
  list.sort((a, b) => a.kWhPerSqm - b.kWhPerSqm);
  list.forEach((m, idx) => {
    m.rank = idx + 1;
    if (m.rank <= 25) m.league = "platin";
    else if (m.rank <= 75) m.league = "gold";
    else if (m.rank <= 150) m.league = "silber";
    else m.league = "bronze";
  });

  // Inject our own market at rank 7
  const own = list[6];
  own.id = "edeka-4721";
  own.region = "nord";
  own.size = "M";
  own.isOwn = true;
  own.delta = 4;
  own.league = "gold";

  return list;
}

const ALL_MARKETS = buildAllMarkets();

export interface LeaderboardQuery {
  region?: Region | "all";
  size?: MarketSize | "all";
  limit?: number;
}

function anonName(id: string): string {
  // Stable anonymous market names — use the numeric part
  const num = id.split("-")[1];
  return `Markt #${num}`;
}

export function getLeaderboard(q: LeaderboardQuery = {}): LeaderboardEntry[] {
  let list = [...ALL_MARKETS];
  if (q.region && q.region !== "all") list = list.filter(m => m.region === q.region);
  if (q.size && q.size !== "all") list = list.filter(m => m.size === q.size);
  // Re-rank within filter
  list = list.map((m, i) => ({ ...m, filteredRank: i + 1 } as MarketRecord & { filteredRank: number }));
  const top = list.slice(0, q.limit ?? 12);
  return top.map(m => ({
    marketId: m.id,
    rank: (m as MarketRecord & { filteredRank?: number }).filteredRank ?? m.rank,
    region: m.region,
    size: m.size,
    kWhPerSqm: m.kWhPerSqm,
    league: m.league,
    delta: m.delta,
    isOwn: m.isOwn,
    anonName: m.isOwn ? "Dein Markt" : anonName(m.id),
  }));
}

export function getOwnEntry(): LeaderboardEntry {
  const own = ALL_MARKETS.find(m => m.isOwn)!;
  return {
    marketId: own.id,
    rank: own.rank,
    region: own.region,
    size: own.size,
    kWhPerSqm: own.kWhPerSqm,
    league: own.league,
    delta: own.delta,
    isOwn: true,
    anonName: "Dein Markt",
  };
}

export function getTotalMarkets(): number {
  return ALL_MARKETS.length;
}

// Achievements
export function getAchievements(): Achievement[] {
  return [
    {
      id: "first-step",
      title: "Erster Schritt",
      description: "Erste Woche mit aktivem Energie-Tracking abgeschlossen.",
      icon: "🌱",
      unlocked: true,
      unlockedDaysAgo: 38,
      rarity: "gemein",
    },
    {
      id: "streak-7",
      title: "7-Tage-Serie",
      description: "7 Tage in Folge unter dem Markt-Durchschnitt.",
      icon: "🔥",
      unlocked: true,
      unlockedDaysAgo: 14,
      rarity: "gemein",
    },
    {
      id: "streak-30",
      title: "Monats-Marathon",
      description: "30 Tage in Folge sparen.",
      icon: "🏃",
      unlocked: false,
      progress: 0.4,
      rarity: "selten",
    },
    {
      id: "top-10",
      title: "Top 10",
      description: "Erstmals in den Top 10 der Bestenliste.",
      icon: "🏅",
      unlocked: true,
      unlockedDaysAgo: 2,
      rarity: "selten",
    },
    {
      id: "top-3",
      title: "Auf dem Treppchen",
      description: "Top 3 der Region erreichen.",
      icon: "🥇",
      unlocked: false,
      progress: 0.7,
      rarity: "episch",
    },
    {
      id: "co2-100",
      title: "Hundert-CO₂-Club",
      description: "100 kg CO₂ eingespart in einem Monat.",
      icon: "🌍",
      unlocked: true,
      unlockedDaysAgo: 5,
      rarity: "selten",
    },
    {
      id: "night-saver",
      title: "Nachteulen-Verzicht",
      description: "Nachtverbrauch eine Woche lang unter 30 % gehalten.",
      icon: "🌙",
      unlocked: false,
      progress: 0.55,
      rarity: "gemein",
    },
    {
      id: "back-pro",
      title: "Backstation-Profi",
      description: "Backofen-Spitzen erfolgreich entzerrt.",
      icon: "🥨",
      unlocked: true,
      unlockedDaysAgo: 18,
      rarity: "gemein",
    },
    {
      id: "regional-champ",
      title: "Regionsmeister",
      description: "Platz 1 in deiner Region.",
      icon: "👑",
      unlocked: false,
      progress: 0.2,
      rarity: "legendär",
    },
    {
      id: "summer-cool",
      title: "Kühler Kopf im Sommer",
      description: "Klima-Verbrauch im Sommermonat unter Schnitt.",
      icon: "🧊",
      unlocked: true,
      unlockedDaysAgo: 220,
      rarity: "selten",
    },
    {
      id: "team-effort",
      title: "Team-Power",
      description: "Schulungsmodul mit allen Schichten abgeschlossen.",
      icon: "🤝",
      unlocked: false,
      progress: 0,
      rarity: "episch",
    },
    {
      id: "platinum",
      title: "Platin-Aufstieg",
      description: "Aufstieg in die Platinliga.",
      icon: "💎",
      unlocked: false,
      progress: 0.45,
      rarity: "legendär",
    },
  ];
}

export function getInsights(): Insight[] {
  return [
    {
      id: "i1",
      text: "Spitze immer mittwochs zwischen 6–8 Uhr — wahrscheinlich Backstation. Eventuell entzerren?",
      tone: "info",
    },
    {
      id: "i2",
      text: "Letzte 7 Tage Klima-Verbrauch –14 % gegenüber Vorwoche. Weiter so.",
      tone: "positive",
    },
    {
      id: "i3",
      text: "Beleuchtung bleibt sonntags ab 22 Uhr im Markt-Eingang an. Sensor checken?",
      tone: "warning",
    },
  ];
}
