import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Send, CreditCard, Crown } from 'lucide-react';
import { useLanguage } from '../i18n';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

interface NavbarProps {
  onOpenPayment?: (planName?: string, price?: string) => void;
  onOpenFounderProfile?: () => void;
}

export default function Navbar({ onOpenPayment, onOpenFounderProfile }: NavbarProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { label: t.nav_home, href: '#home' },
    { label: t.nav_about, href: '#about' },
    { label: t.nav_subscriptions || 'Tariflar', href: '#subscriptions', highlight: true },
    { label: t.nav_donations, href: '#donations' },
    { label: t.nav_faq, href: '#faq' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handlePayClick = () => {
    if (onOpenPayment) {
      onOpenPayment('PREMIUM NOTHING', '22,222 UZS');
    } else {
      scrollTo('#subscriptions');
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl bg-nothing-black/75 border-b border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#home');
              }}
              className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
              <span>NOTHING</span>
              <span className="text-white/40">.UZ</span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                    link.highlight
                      ? 'text-white hover:text-emerald-400 font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Actions: Payment CTA + Telegram + Language */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Prominent Payment Button */}
              <button
                onClick={handlePayClick}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <CreditCard size={13} className="text-black" />
                <span className="hidden sm:inline">To‘lov</span>
                <span className="text-[11px] text-zinc-500 font-semibold">@uzouf</span>
              </button>

              {/* Direct Telegram link */}
              <a
                href="https://t.me/uzouf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 hover:bg-sky-500/20 font-bold text-xs transition-all"
                title="Telegram @uzouf"
              >
                <Send size={12} />
                <span>@uzouf</span>
              </a>

              {/* Founder exclusive profile trigger (@uzouf) */}
              <button
                onClick={onOpenFounderProfile}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
                title="Faqat @uzouf uchun maxsus profil"
              >
                <Crown size={13} className="text-amber-400" />
                <span className="font-mono">@uzouf</span>
              </button>

              {/* Theme Selector: 3 user behavior modes */}
              <ThemeSelector variant="navbar" />

              <LanguageSelector />

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menyu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-zinc-950/98 backdrop-blur-2xl border-b border-white/10 p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-lg font-bold text-white/80 hover:text-white transition-colors text-left py-1 cursor-pointer flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                      10 tarif
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-zinc-400">Mavzu / Xatti-harakat:</span>
                  <ThemeSelector variant="navbar" />
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenFounderProfile?.();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Crown size={14} className="text-amber-400" />
                  <span>Asoschi Profili (@uzouf)</span>
                </button>

                <button
                  onClick={handlePayClick}
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <CreditCard size={16} />
                  <span>To‘lov qilish (@uzouf)</span>
                </button>

                <a
                  href="https://t.me/uzouf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Rasmiy Telegram: @uzouf</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
