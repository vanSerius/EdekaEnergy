"use client";

import { motion } from "motion/react";
import { useLang, type Lang } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: "de", label: "DE" },
  { lang: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language / Sprache"
      className="flex items-center rounded-full border border-line bg-paper p-0.5"
    >
      {OPTIONS.map(opt => {
        const active = lang === opt.lang;
        return (
          <motion.button
            key={opt.lang}
            onClick={() => setLang(opt.lang)}
            whileTap={{ scale: 0.9 }}
            aria-pressed={active}
            aria-label={opt.label}
            className={cn(
              "relative cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              active ? "text-edeka-blue-deep" : "text-ink-faint hover:text-ink-soft",
            )}
          >
            {active && (
              <motion.div
                layoutId="lang-active"
                className="absolute inset-0 rounded-full bg-edeka-yellow"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-mono tracking-wide">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
