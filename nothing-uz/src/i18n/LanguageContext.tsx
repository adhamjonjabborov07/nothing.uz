import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TranslationStrings } from './types';
import { languages } from './languages';
import type { Language } from './languages';
import { en } from './translations/en';

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: TranslationStrings;
  currentLanguage: Language;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
  currentLanguage: languages[1],
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

// Lazy-load translations
const translationModules = import.meta.glob('./translations/*.ts') as Record<string, () => Promise<{ [key: string]: TranslationStrings }>>;

const translationCache: Record<string, TranslationStrings> = { en };

async function loadTranslation(code: string): Promise<TranslationStrings> {
  if (translationCache[code]) return translationCache[code];

  const fileCode = code.replace('-', '_');
  const path = `./translations/${fileCode}.ts`;

  if (translationModules[path]) {
    try {
      const mod = await translationModules[path]();
      const key = Object.keys(mod).find(k => k !== 'default') || fileCode;
      const translation = mod[key] || mod.default;
      if (translation) {
        translationCache[code] = translation;
        return translation;
      }
    } catch (e) {
      console.warn(`Failed to load translation for ${code}:`, e);
    }
  }

  return en;
}

function detectBrowserLanguage(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const code = browserLang.split('-')[0].toLowerCase();
  const found = languages.find(l => l.code === code);
  return found ? found.code : 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('nothing-lang');
    if (saved && languages.find(l => l.code === saved)) return saved;
    return detectBrowserLanguage();
  });

  const [translations, setTranslations] = useState<TranslationStrings>(en);

  const currentLanguage = languages.find(l => l.code === language) || languages[1];
  const isRTL = currentLanguage.rtl || false;

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    localStorage.setItem('nothing-lang', code);
  }, []);

  useEffect(() => {
    loadTranslation(language).then(setTranslations);
  }, [language]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations, currentLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
