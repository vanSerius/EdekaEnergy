"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="pointer-events-none mx-auto flex max-w-md justify-center px-3 pb-3 pt-2">
        <div className="pointer-events-auto flex w-full items-stretch gap-1 rounded-full border border-line bg-paper p-1.5 shadow-card-lift">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2 text-[10px] font-medium text-ink-soft"
              >
                {active && (
                  <motion.div
                    layoutId="bottomnav-active"
                    className="absolute inset-0 rounded-full bg-edeka-yellow shadow-yellow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 ${
                    active ? "text-edeka-blue-deep" : "text-ink-soft"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span
                  className={`relative z-10 ${
                    active ? "text-edeka-blue-deep" : "text-ink-soft"
                  }`}
                >
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
