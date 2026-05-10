"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

export type Lang = "ja" | "en";

const STORAGE_KEY = "memoria_lang";

interface LangContext {
  lang: Lang;
  toggle: () => void;
  t: (ja: string, en: string) => string;
}

const Ctx = createContext<LangContext>({
  lang: "ja",
  toggle: () => {},
  t: (ja) => ja,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ja") setLang(saved);
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "ja" ? "en" : "ja";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback(
    (ja: string, en: string) => (lang === "ja" ? ja : en),
    [lang]
  );

  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangContext {
  return useContext(Ctx);
}
