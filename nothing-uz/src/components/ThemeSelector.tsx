import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { THEMES, type ThemeId } from '../theme/types';
import { Palette, Check, Sparkles, Terminal, Crown } from 'lucide-react';

interface ThemeSelectorProps {
  variant?: 'navbar' | 'floating';
}

export default function ThemeSelector({ variant = 'navbar' }: ThemeSelectorProps) {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeList = Object.values(THEMES);

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'classic':
        return <Sparkles size={14} className="text-red-400" />;
      case 'matrix':
        return <Terminal size={14} className="text-emerald-400" />;
      case 'gold':
        return <Crown size={14} className="text-amber-400" />;
    }
  };

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 left-6 z-50" ref={dropdownRef}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 left-0 w-80 p-3 rounded-3xl bg-zinc-950/95 border border-white/20 shadow-2xl backdrop-blur-2xl text-white space-y-2 mb-2"
            >
              <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white">Mavzuni tanlang</p>
                  <p className="text-[10px] text-zinc-400">Xarakteringizga mos xatti-harakat</p>
                </div>
                <Palette size={15} className="text-white/40" />
              </div>

              <div className="space-y-1.5 pt-1">
                {themeList.map((t) => {
                  const isCurrent = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-2xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-white/10 border border-white/25 shadow-md'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        {getThemeIcon(t.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white">{t.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-sky-300/90 mt-0.5">{t.behaviorTitle}</p>
                        <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 line-clamp-2">{t.behaviorDesc}</p>
                      </div>
                      {isCurrent && <Check size={16} className="text-emerald-400 mt-1 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 text-white text-xs font-bold shadow-xl backdrop-blur-xl cursor-pointer transition-colors"
          title="Mavzularni almashtirish"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: themeConfig.accentColor }}
          />
          <span className="hidden sm:inline font-mono">{themeConfig.name}</span>
          <Palette size={14} className="text-white/60" />
        </motion.button>
      </div>
    );
  }

  // Navbar variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/90 hover:text-white transition-all cursor-pointer"
        title="Mavzuni almashtirish (3 ta xatti-harakat)"
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: themeConfig.accentColor }}
        />
        <span className="hidden md:inline font-bold text-[11px]">{themeConfig.badge.split(' ')[1]}</span>
        <Palette size={13} className="text-white/50" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-zinc-950/95 border border-white/20 shadow-2xl backdrop-blur-2xl text-white space-y-1 z-50"
          >
            <div className="px-3 py-1.5 border-b border-white/10">
              <p className="text-[11px] font-black uppercase tracking-wider text-white">Xatti-harakat rejimi</p>
              <p className="text-[10px] text-zinc-400">Sayt atmosferasini o‘zingizga moslang</p>
            </div>

            <div className="space-y-1 pt-1">
              {themeList.map((t) => {
                const isCurrent = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white/10 border border-white/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        {getThemeIcon(t.id)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{t.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400">{t.behaviorTitle}</span>
                      </div>
                    </div>
                    {isCurrent && <Check size={14} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
