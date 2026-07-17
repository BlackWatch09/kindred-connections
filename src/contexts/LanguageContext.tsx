import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/i18n/translations";

export type Language = "en" | "ar" | "tr" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = "lugha.lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved && ["en", "ar", "tr", "es"].includes(saved) ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {}
  };

  const t = (key: string, params?: Record<string, string>): string => {
    // Fallback chain: current language → English → key
    let text = translations[language]?.[key] ?? translations.en[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
