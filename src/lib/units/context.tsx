"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OWN_MARKET_SQM } from "@/lib/mockData";
import { formatkWh, formatIntensity } from "@/lib/formatters";

/**
 * Anzeige-Einheit für den Energieverbrauch:
 * - "total"     → absolute Kilowattstunden (kWh)
 * - "intensity" → Verbrauch pro Quadratmeter Verkaufsfläche (kWh/m²),
 *                 für einen fairen Vergleich unterschiedlich großer Märkte.
 */
export type UnitMode = "total" | "intensity";

const LS_KEY = "edeka-unit";

interface UnitContextValue {
  mode: UnitMode;
  setMode: (m: UnitMode) => void;
  isIntensity: boolean;
  /** Verkaufsfläche des eigenen Markts in m². */
  sqm: number;
  /** Absoluten kWh-Wert in die aktive Einheit umrechnen (kWh oder kWh/m²). */
  convert: (kWh: number) => number;
  /** Kurzes Symbol der aktiven Einheit. */
  unitLabel: string;
  /** Absoluten kWh-Wert umrechnen und mit dem aktiven Einheiten-Symbol formatieren. */
  format: (kWh: number, opts?: { digits?: number; unit?: boolean }) => string;
}

const UnitContext = createContext<UnitContextValue>({
  mode: "total",
  setMode: () => {},
  isIntensity: false,
  sqm: OWN_MARKET_SQM,
  convert: kWh => kWh,
  unitLabel: "kWh",
  format: (kWh, opts) => formatkWh(kWh, opts),
});

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<UnitMode>("total");

  // Aus localStorage hydratisieren (nur Client)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY) as UnitMode | null;
      if (stored === "total" || stored === "intensity") setModeState(stored);
    } catch {}
  }, []);

  const setMode = useCallback((m: UnitMode) => {
    setModeState(m);
    try {
      localStorage.setItem(LS_KEY, m);
    } catch {}
  }, []);

  const value = useMemo<UnitContextValue>(() => {
    const isIntensity = mode === "intensity";
    const sqm = OWN_MARKET_SQM;
    return {
      mode,
      setMode,
      isIntensity,
      sqm,
      convert: (kWh: number) => (isIntensity ? kWh / sqm : kWh),
      unitLabel: isIntensity ? "kWh/m²" : "kWh",
      format: (kWh, opts) =>
        isIntensity ? formatIntensity(kWh / sqm, opts) : formatkWh(kWh, opts),
    };
  }, [mode, setMode]);

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnit(): UnitContextValue {
  return useContext(UnitContext);
}
