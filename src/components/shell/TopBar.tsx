"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bell, Sparkles } from "lucide-react";
import { EdekaMark } from "@/components/brand/EdekaMark";
import { getCurrentMarketSnapshot } from "@/lib/mockData";
import { formatRelativeMinutes } from "@/lib/formatters";
import { cn } from "@/lib/cn";

export function TopBar() {
  const market = getCurrentMarketSnapshot();
  const marketName = market.displayName.split(" · ")[0].replace("EDEKA ", "");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Use IntersectionObserver on a sentinel div at top of page —
    // more reliable than scroll events in constrained preview envs
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 transition-all duration-300 ease-out sm:px-6 lg:px-10 lg:py-5",
          // Mobile: always opaque
          "border-b border-line bg-paper/95 backdrop-blur",
          // Desktop: transparent at top, solid once scrolled
          scrolled
            ? "lg:border-b lg:border-line lg:bg-paper lg:shadow-card lg:backdrop-blur-0"
            : "lg:border-b-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-0",
        )}
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <EdekaMark size={26} />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold text-ink">Energie</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
              {marketName}
            </span>
          </div>
        </div>

        {/* Desktop greeting */}
        <div className="hidden lg:flex lg:flex-col lg:gap-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
            <span className="h-px w-8 bg-line-strong" />
            <span>Status</span>
            <span className="text-leaf">
              · {formatRelativeMinutes(market.updatedAtMinutesAgo)} aktualisiert
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
            Guten Tag im{" "}
            <span className="serif-italic text-edeka-blue">{marketName}</span>.
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="relative cursor-pointer rounded-full border border-line bg-paper p-2.5 text-ink-soft transition hover:text-ink"
            aria-label="Benachrichtigungen"
          >
            <Bell className="h-4 w-4" strokeWidth={1.8} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-edeka-yellow ring-2 ring-paper" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-edeka-blue-deep px-4 py-2.5 text-xs font-medium text-paper shadow-deep"
          >
            <Sparkles className="h-3.5 w-3.5 text-edeka-yellow" strokeWidth={2.4} />
            <span className="hidden sm:inline">Tipps</span>
          </motion.button>
        </div>
    </header>
  );
}
