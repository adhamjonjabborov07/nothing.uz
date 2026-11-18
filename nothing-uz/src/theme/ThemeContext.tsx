import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, type ThemeId, type ThemeConfig } from './types';

export { THEMES, type ThemeId, type ThemeConfig };

interface ThemeContextType {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId) => void;
  nextTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'classic',
  themeConfig: THEMES.classic,
  setTheme: () => {},
  nextTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nothing_theme') as ThemeId;
      if (saved && THEMES[saved]) return saved;
    }
    return 'classic';
  });

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nothing_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      window.dispatchEvent(new CustomEvent('nothing-theme-change', { detail: newTheme }));
    }
  };

  const nextTheme = () => {
    const list: ThemeId[] = ['classic', 'matrix', 'gold'];
    const currentIndex = list.indexOf(theme);
    const next = list[(currentIndex + 1) % list.length];
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEMES[theme],
        setTheme,
        nextTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
