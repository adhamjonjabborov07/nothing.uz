import { useLanguage } from '../i18n';
import { Send, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { label: t.nav_home, href: '#home' },
    { label: t.nav_subscriptions || 'Tariflar', href: '#subscriptions' },
    { label: t.nav_about, href: '#about' },
    { label: t.nav_donations, href: '#donations' },
    { label: t.nav_faq, href: '#faq' },
    { label: t.footer_disclaimer, href: '#disclaimer' },
  ];

  return (
    <footer className="section-dark border-t border-white/[0.08] py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Top section: Logo + Telegram + Links */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo & description */}
          <div className="text-center lg:text-left max-w-sm">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>NOTHING</span>
              <span className="text-white/30">.UZ</span>
            </h2>
            <p className="text-xs text-white/40 mb-3">
              {t.footer_tagline || 'Doing nothing since 2026.'}
            </p>
            {/* Telegram Badge */}
            <a
              href="https://t.me/uzouf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 hover:bg-sky-500/20 text-xs font-bold transition-all"
            >
              <Send size={12} />
              <span>Rasmiy to‘lov: Telegram @uzouf</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Quick Telegram Action */}
          <div className="text-center lg:text-right">
            <a
              href="https://t.me/uzouf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Send size={13} className="text-sky-600" />
              <span>Telegram: @uzouf</span>
            </a>
            <p className="text-[10px] text-white/30 mt-1.5">24/7 savollar va to‘lovlar</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.08] mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30 text-center sm:text-left">
          <p>{t.footer_copyright || '© 2026 NOTHING.UZ. Barcha huquqlar himoyalangan.'}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400/80">
              <ShieldCheck size={13} />
              <span>100% Rasmiy Hech Narsa</span>
            </span>
            <span>{t.footer_built || '0% funksionallik uchun 100% fidoyilik bilan.'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
