import { useState, useEffect } from "react";
import en from "../locales/en.json";
import as from "../locales/as.json";
import { LanguageContext, supportedLanguages } from "./LanguageContextObject";

const translations = {
  en,
  as,
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("disha_language") || "en";
  });

  const changeLanguage = (code) => {
    setLanguageState(code);
    localStorage.setItem("disha_language", code);
  };

  useEffect(() => {
    const activeLanguage = language === "as" ? "as" : "en";
    document.documentElement.lang = activeLanguage;
    document.documentElement.dataset.language = activeLanguage;
  }, [language]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "disha_language" && e.newValue) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const currentLanguage =
    supportedLanguages.find((item) => item.code === language) ||
    supportedLanguages[0];

  const t = (path, fallback = "") => {
    if (!path || typeof path !== "string") return fallback || path;

    const langDict = translations[language];
    if (langDict) {
      // 1. Direct match in root dictionary (e.g. "Placement Readiness")
      if (path in langDict && typeof langDict[path] === "string") {
        return langDict[path];
      }

      // 2. Dot-notation lookup (e.g. "nav.appName")
      if (path.includes(".")) {
        const keys = path.split(".");
        let current = langDict;
        for (const key of keys) {
          if (current && typeof current === "object" && key in current) {
            current = current[key];
          } else {
            current = undefined;
            break;
          }
        }
        if (typeof current === "string") return current;
      }
    }

    // Fallback to English
    const enDict = translations.en;
    if (enDict) {
      if (path in enDict && typeof enDict[path] === "string") {
        return enDict[path];
      }
      if (path.includes(".")) {
        const keys = path.split(".");
        let current = enDict;
        for (const key of keys) {
          if (current && typeof current === "object" && key in current) {
            current = current[key];
          } else {
            current = undefined;
            break;
          }
        }
        if (typeof current === "string") return current;
      }
    }

    return fallback || path;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    currentLanguage,
    languages: supportedLanguages,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
