import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { label: t.nav_home, href: '#home' },
    { label: t.nav_about, href: '#about' },
    { label: t.nav_subscriptions, href: '#subscriptions' },
    { label: t.nav_faq, href: '#faq' },
    { label: t.footer_disclaimer, href: '#disclaimer' },
  ];

  return (
    <footer className="section-dark border-t border-white/[0.04] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              NOTHING<span className="text-white/30">.</span>
            </h2>
            <p className="text-sm text-white/30">
              {t.footer_tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.06] mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <p>{t.footer_copyright}</p>
          <p>{t.footer_built}</p>
        </div>
      </div>
    </footer>
  );
}
