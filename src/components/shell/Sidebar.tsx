"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { EdekaMark } from "@/components/brand/EdekaMark";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { REGION_META } from "@/types/energy";

export function Sidebar() {
  const pathname = usePathname();
  const market = getCurrentMarketSnapshot();
  const region = REGION_META[market.region];

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-dvh w-[260px] flex-col border-r border-line bg-paper lg:flex">
      <div className="flex items-center gap-3 px-6 pt-7">
        <EdekaMark size={28} />
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Energie
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
            & Nachhaltigkeit
          </span>
        </div>
      </div>

      <div className="mt-10 px-3">
        <p className="px-3 pb-3 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-faint">
          Navigation
        </p>
        <ul className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink"
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl bg-edeka-yellow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 h-[18px] w-[18px] ${
                      active ? "text-edeka-blue-deep" : ""
                    }`}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  <span className={`relative z-10 ${active ? "text-edeka-blue-deep" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto px-3 pb-6">
        <div className="card overflow-hidden p-4">
          <div className="flex items-start justify-between">
            <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-faint">
              Markt
            </div>
            <div className="flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-leaf opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-leaf" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-leaf">
                Live
              </span>
            </div>
          </div>
          <div className="mt-3 font-display text-[15px] font-semibold leading-tight text-ink">
            {market.displayName.split(" · ")[0]}
          </div>
          <div className="mt-0.5 font-serif text-xs italic text-ink-soft">
            {market.displayName.split(" · ")[1] ?? ""}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs">
            <span className="text-ink-soft">{region.label}</span>
            <span className="num font-mono text-[11px] text-ink-soft">
              {market.squareMeters} m²
            </span>
          </div>
          <button className="mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-paper-soft px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-paper hover:text-ink">
            Markt wechseln
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
