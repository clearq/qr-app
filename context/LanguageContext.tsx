// context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const loadTranslations = async (lang: string) => {
    const response = await fetch(`/locales/${lang}/common.json`);
    const data = await response.json();
    setTranslations(data);
  };

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
