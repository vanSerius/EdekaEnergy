"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function AchievementToast() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 900);
    const t2 = setTimeout(() => setVisible(false), 9500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="card fixed bottom-24 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 p-4 shadow-card-lift lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-sm lg:translate-x-0"
        >
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 250 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-edeka-yellow text-2xl"
            >
              🏅
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-edeka-blue">
                <Sparkles className="h-3 w-3" strokeWidth={2.4} />
                {t.dashboard.achievement_label}
              </div>
              <div className="mt-0.5 font-display text-base font-semibold text-ink">
                {t.dashboard.achievement_title}
              </div>
              <p className="text-xs leading-snug text-ink-soft">
                {t.dashboard.achievement_desc}
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="rounded-full p-1 text-ink-soft transition hover:bg-paper-soft hover:text-ink"
              aria-label={t.dashboard.achievement_close}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
