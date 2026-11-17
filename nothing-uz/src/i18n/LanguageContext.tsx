import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StrictTranslationStrings } from './types';
import { languages } from './languages';
import type { Language } from './languages';
import { en } from './translations/en';
import { uz } from './translations/uz';

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: StrictTranslationStrings;
  currentLanguage: Language;
  isRTL: boolean;
}

const defaultLang = languages[0]; // Uzbek

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLang.code,
  setLanguage: () => {},
  t: uz as StrictTranslationStrings,
  currentLanguage: defaultLang,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

// Lazy-load other translations (exclude en, uz, and types which are statically managed)
const translationModules = import.meta.glob([
  './translations/*.ts',
  '!./translations/en.ts',
  '!./translations/uz.ts',
  '!./translations/types.ts',
]) as Record<string, () => Promise<{ [key: string]: any }>>;

const translationCache: Record<string, StrictTranslationStrings> = {
  en: en as StrictTranslationStrings,
  uz: uz as StrictTranslationStrings,
};

async function loadTranslation(code: string): Promise<StrictTranslationStrings> {
  if (translationCache[code]) return translationCache[code];

  const fileCode = code.replace('-', '_');
  const path = `./translations/${fileCode}.ts`;

  if (translationModules[path]) {
    try {
      const mod = await translationModules[path]();
      const key = Object.keys(mod).find(k => k !== 'default') || fileCode;
      const translation = mod[key] || mod.default;
      if (translation) {
        const merged = { ...en, ...translation } as StrictTranslationStrings;
        translationCache[code] = merged;
        return merged;
      }
    } catch (e) {
      console.warn(`Failed to load translation for ${code}:`, e);
    }
  }

  return en as StrictTranslationStrings;
}

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'uz';
  const browserLang = navigator.language || (navigator as any).userLanguage || 'uz';
  const full = browserLang.toLowerCase();
  if (full.includes('cyrl') && languages.find(l => l.code === 'uz-cyrl')) {
    return 'uz-cyrl';
  }
  const code = full.split('-')[0].toLowerCase();
  const found = languages.find(l => l.code === code);
  return found ? found.code : 'uz';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('nothing-lang');
    if (saved && languages.find(l => l.code === saved)) return saved;
    return detectBrowserLanguage();
  });

  const [translations, setTranslations] = useState<StrictTranslationStrings>(() => {
    if (language === 'uz') return uz as StrictTranslationStrings;
    if (language === 'en') return en as StrictTranslationStrings;
    return uz as StrictTranslationStrings;
  });

  const currentLanguage = languages.find(l => l.code === language) || languages[0];
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
