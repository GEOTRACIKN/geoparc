import React, { createContext, useContext, ReactNode } from 'react';

import enTranslations from '../languages/en.json';
import frTranslations from '../languages/fr.json';
import arTranslations from '../languages/ar.json';
import esTranslations from '../languages/es.json';

type Language = 'en' | 'fr' | 'ar' | 'es'; // Ajoutez d'autres langues au besoin



const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
  es:esTranslations
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = React.useState<Language>('fr');

  const translate = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslate() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslate must be used within a LanguageProvider');
  }
  return context;
}
