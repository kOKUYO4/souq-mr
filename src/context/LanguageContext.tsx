"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type Locale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  t: typeof translations.fr;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  t: translations.fr,
  setLocale: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
    localStorage.setItem("souq-locale", newLocale);
  };

  useEffect(() => {
    const saved = localStorage.getItem("souq-locale") as Locale | null;
    if (saved && (saved === "fr" || saved === "ar")) {
      setLocale(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        t: translations[locale] as typeof translations.fr,
        setLocale,
        isRTL: locale === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
