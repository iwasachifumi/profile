"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

export type Lang = "ja" | "en";

const STORAGE_KEY = "memoria_lang";

interface LangContext {
  lang: Lang;
  toggle: () => void;
  setLanguage: (next: Lang) => void;
  t: (ja: string, en: string) => string;
}

const LIKELY_MOJIBAKE_TOKENS = ["繧", "繝", "縺", "荳", "莠", "蟄", "螳", "逶", "譛", "隱"];

function looksLikeMojibake(text: string): boolean {
  let hits = 0;
  for (const token of LIKELY_MOJIBAKE_TOKENS) {
    if (text.includes(token)) hits += 1;
    if (hits >= 2) return true;
  }
  return false;
}

const Ctx = createContext<LangContext>({
  lang: "ja",
  toggle: () => {},
  setLanguage: () => {},
  t: (ja) => ja,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ja") {
      setLang(saved);
      return;
    }

    let alive = true;
    void (async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { ok?: boolean; data?: { language?: unknown } };
        if (!alive || payload.ok !== true) return;
        const next = payload.data?.language;
        if (next === "ja" || next === "en") {
          setLang(next);
          localStorage.setItem(STORAGE_KEY, next);
        }
      } catch {
        // Ignore bootstrap failures. localStorage/default is enough.
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const setLanguage = useCallback((next: Lang) => {
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "ja" ? "en" : "ja";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback(
    (ja: string, en: string) => {
      if (lang === "en") return en;
      return looksLikeMojibake(ja) ? en : ja;
    },
    [lang]
  );

  return <Ctx.Provider value={{ lang, toggle, setLanguage, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangContext {
  return useContext(Ctx);
}
