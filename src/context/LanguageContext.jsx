'use client';
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved && saved !== lang) setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    try {
      localStorage.setItem("lang", lang);
    } catch { }
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));
  const isAr = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isAr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
