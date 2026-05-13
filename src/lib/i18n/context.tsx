"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { de, type Translations } from "./de";
import { en } from "./en";

export type Lang = "de" | "en";

const DICTS: Record<Lang, Translations> = { de, en };
const LS_KEY = "edeka-lang";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "de",
  t: de,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY) as Lang | null;
      if (stored === "de" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: DICTS[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Primary hook — returns the full translation dict */
export function useT(): Translations {
  return useContext(LanguageContext).t;
}

/** Secondary hook — returns lang + setLang for the switcher */
export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const { lang, setLang } = useContext(LanguageContext);
  return { lang, setLang };
}
