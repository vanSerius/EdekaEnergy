"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, Trophy } from "lucide-react";
import { EdekaMark } from "@/components/brand/EdekaMark";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import { VersionOneScreen } from "@/components/v1/VersionOneScreen";
import { useT } from "@/lib/i18n/context";
import { useUnit } from "@/lib/units/context";

export default function LandingPage() {
  const t = useT();
  const { setMode } = useUnit();
  // Bewusst NICHT persistiert: ein Reload (F5) führt immer zurück zur Auswahl.
  const [version, setVersion] = useState<null | "v1">(null);

  if (version === "v1") {
    return <VersionOneScreen onBack={() => setVersion(null)} />;
  }

  const openV1 = () => {
    // V1 ist die Basis-Version → immer in absoluten kWh zeigen.
    setMode("total");
    setVersion("v1");
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-paper">
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12 lg:py-6">
        <div className="flex items-center gap-3">
          <EdekaMark size={30} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            {t.landing.eyebrow}
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {t.landing.title_1}{" "}
              <span className="serif-italic text-edeka-blue">{t.landing.title_2}</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft sm:text-base">
              {t.landing.subtitle}
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {/* Version 1 — Basis */}
            <motion.button
              type="button"
              onClick={openV1}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="card group relative cursor-pointer overflow-hidden p-7 text-left sm:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper-soft text-edeka-blue ring-1 ring-line">
                  <LayoutDashboard className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
                  {t.landing.v1_tag}
                </span>
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {t.landing.v1_title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {t.landing.v1_desc}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-edeka-blue-deep">
                {t.landing.v1_cta}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </motion.button>

            {/* Version 2 — Ausbaustufe */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <Link
                href="/dashboard"
                className="block-yellow group relative block h-full overflow-hidden p-7 text-left sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-edeka-blue-deep text-edeka-yellow">
                    <Trophy className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-edeka-blue-deep/70">
                    {t.landing.v2_tag}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-edeka-blue-deep sm:text-3xl">
                  {t.landing.v2_title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-edeka-blue-deep/80">
                  {t.landing.v2_desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-edeka-blue-deep">
                  {t.landing.v2_cta}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="px-5 py-5 text-center sm:px-8 lg:px-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          {t.landing.footer}
        </span>
      </footer>
    </div>
  );
}
