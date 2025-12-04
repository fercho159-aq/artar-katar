'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Translations = typeof es;

type LanguageContextType = {
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
  translations: Translations;
};

const translationsMap = { en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<'en' | 'es'>('es');
  const [translations, setTranslations] = useState<Translations>(es);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'es') {
      setLanguage(storedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setLanguage('en');
      } else {
        setLanguage('es');
      }
    }
  }, []);

  const setLanguage = (lang: 'en' | 'es') => {
    setLanguageState(lang);
    setTranslations(translationsMap[lang]);
    localStorage.setItem('language', lang);
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
