"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { OWN_STORE, STORES, type StoreProfile } from "@/lib/mockData";

/**
 * Aktiver Markt für die Datenanzeige.
 *
 * - In V1 und V2 bleibt der eigene Markt (OWN_STORE) aktiv.
 * - In der Manager-Ansicht (V0.9) kann links ein beliebiger Markt gewählt
 *   werden; sämtliche Kacheln zeigen dann dessen Werte.
 *
 * Die Verkaufsfläche des aktiven Markts ist zugleich die Basis für die
 * kWh/m²-Umrechnung (siehe UnitProvider).
 */
interface StoreContextValue {
  activeStore: StoreProfile;
  setActiveStore: (s: StoreProfile) => void;
  /** Zurück auf den eigenen Markt (z. B. beim Verlassen der Manager-Ansicht). */
  resetToOwn: () => void;
  stores: StoreProfile[];
}

const StoreContext = createContext<StoreContextValue>({
  activeStore: OWN_STORE,
  setActiveStore: () => {},
  resetToOwn: () => {},
  stores: STORES,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [activeStore, setActiveStore] = useState<StoreProfile>(OWN_STORE);

  const resetToOwn = useCallback(() => setActiveStore(OWN_STORE), []);

  const value = useMemo<StoreContextValue>(
    () => ({ activeStore, setActiveStore, resetToOwn, stores: STORES }),
    [activeStore, resetToOwn],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  return useContext(StoreContext);
}
