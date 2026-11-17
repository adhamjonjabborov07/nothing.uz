import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Globe, X } from 'lucide-react';
import { useLanguage, languages } from '../i18n';

export default function LanguageSelector() {
  const { language, setLanguage, currentLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all text-sm text-white/70 hover:text-white"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="sm:hidden">{language.toUpperCase()}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-nothing-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]"
          >
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  {t.lang_title}
                </span>
                <button
                  onClick={() => { setIsOpen(false); setSearch(''); }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t.lang_search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/5 rounded-lg text-sm text-white placeholder-white/30 outline-none border border-white/5 focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-72 overscroll-contain">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-sm">
                  {t.lang_not_found}
                </div>
              ) : (
                filtered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                      language === lang.code ? 'bg-white/10 text-white' : 'text-white/60'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-xs text-white/30">{lang.name}</span>
                    </div>
                    {language === lang.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="p-2 border-t border-white/5">
              <p className="text-[10px] text-white/20 text-center">
                {languages.length} languages available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
