"use client";

import { motion } from "motion/react";
import { Check, Store } from "lucide-react";
import { useStore } from "@/lib/store/context";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

/**
 * Markt-Auswahl für die Manager-Ansicht (V0.9). Auf großen Screens eine
 * Spalte links, auf kleinen ein horizontal scrollbarer Streifen oben.
 * Die Auswahl steuert den aktiven Markt für alle Kacheln.
 */
export function StoreSwitcher() {
  const t = useT();
  const { activeStore, setActiveStore, stores } = useStore();

  return (
    <aside className="lg:w-72 lg:shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="mb-3 flex items-center gap-2 px-1">
          <Store className="h-3.5 w-3.5 text-ink-faint" strokeWidth={2.2} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-faint">
            {t.admin.stores_label} · {stores.length}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
          {stores.map(store => {
            const active = store.id === activeStore.id;
            return (
              <button
                key={store.id}
                onClick={() => setActiveStore(store)}
                aria-pressed={active}
                className={cn(
                  "relative min-w-[220px] shrink-0 cursor-pointer rounded-2xl border p-4 text-left transition lg:min-w-0",
                  active
                    ? "border-edeka-blue bg-edeka-blue-deep text-paper shadow-sm"
                    : "border-line bg-paper hover:border-edeka-blue/40 hover:bg-paper-soft",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "truncate font-display text-sm font-semibold tracking-tight",
                        active ? "text-paper" : "text-ink",
                      )}
                    >
                      {store.name.replace("EDEKA ", "")}
                      {store.isOwn && (
                        <span
                          className={cn(
                            "ml-1.5 align-middle font-mono text-[9px] font-semibold uppercase tracking-wider",
                            active ? "text-edeka-yellow" : "text-edeka-blue",
                          )}
                        >
                          {t.admin.own_tag}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 truncate text-xs",
                        active ? "text-paper/65" : "text-ink-soft",
                      )}
                    >
                      {store.city}
                    </div>
                  </div>
                  {active && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edeka-yellow text-edeka-blue-deep">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
                      active ? "bg-white/15 text-paper" : "bg-paper-soft text-ink-soft ring-1 ring-line",
                    )}
                  >
                    {store.size} · {store.squareMeters.toLocaleString("de-DE")} m²
                  </span>
                  <span
                    className={cn(
                      "ml-auto num font-mono text-xs font-semibold",
                      active ? "text-edeka-yellow" : "text-ink-faint",
                    )}
                  >
                    #{store.rank}
                  </span>
                </div>

                {active && (
                  <motion.span
                    layoutId="store-active-bar"
                    className="absolute inset-y-3 -left-px w-1 rounded-full bg-edeka-yellow"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
