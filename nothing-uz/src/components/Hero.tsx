import { Suspense, lazy } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { ArrowDown, Sparkles, Send, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrambleText } from './MotionUI';

const Scene3D = lazy(() => import('./Scene3D'));

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

interface HeroProps {
  onOpenPayment?: (planName?: string, price?: string) => void;
}

export default function Hero({ onOpenPayment }: HeroProps) {
  const { t } = useLanguage();

  const handlePay = () => {
    if (onOpenPayment) {
      onOpenPayment('PREMIUM NOTHING', '22,222 UZS');
    } else {
      document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden section-dark pt-12 pb-20">
      {/* 3D Scene */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Gradient overlays for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-nothing-black/30 via-transparent to-nothing-black z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-nothing-black/40 via-transparent to-nothing-black/40 z-[1]" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Top Badges: Official & Telegram Payment */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[11px] font-bold text-white/80 tracking-widest uppercase">
            <Sparkles size={12} className="text-white/60" />
            {t.hero_label}
          </span>

          <a
            href="https://t.me/uzouf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-md text-[11px] font-extrabold text-sky-400 tracking-wide hover:bg-sky-500/20 transition-all shadow-lg shadow-sky-500/10"
          >
            <Send size={12} />
            <span>To‘lovlar: Telegram @uzouf</span>
          </a>
        </motion.div>

        {/* Main Headline with 3D-integrated metallic gradient and ambient lighting */}
        <motion.div variants={item} className="relative mb-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[220px] bg-gradient-to-b from-white/[0.08] via-sky-500/[0.04] to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
          <h1 className="text-hero font-black tracking-tight leading-[1.05]">
            <span className="text-white block drop-shadow-sm">{t.hero_title_1}</span>
            <span className="gradient-text block drop-shadow-sm">{t.hero_title_2}</span>
          </h1>
        </motion.div>

        {/* Subtitle with ScrambleText */}
        <motion.div variants={item} className="max-w-2xl mx-auto mb-8 space-y-3">
          <p className="text-subtitle text-zinc-100 leading-relaxed font-normal">
            {t.hero_subtitle}
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs sm:text-sm text-zinc-200 font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Jonli rejim:</span>
            <span className="text-white font-semibold"><ScrambleText /></span>
          </div>
        </motion.div>

        {/* High-visibility Action Buttons: Payment is right here! */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          {/* 1. Direct Payment Button (Telegram @uzouf) */}
          <button
            onClick={handlePay}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black font-black text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/15 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <CreditCard size={17} className="text-black" />
            <span>{t.hero_btn_payment || '💳 To‘lov qilish (@uzouf)'}</span>
          </button>

          {/* 2. View 10 Pricing Plans */}
          <button
            onClick={() => document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Sparkles size={16} className="text-white/60" />
            <span>{t.hero_btn_secondary || 'Tariflarni ko‘rish (10 ta)'}</span>
          </button>

          {/* 3. Discover Nothing */}
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-transparent text-white/60 hover:text-white font-medium text-sm transition-colors cursor-pointer"
          >
            <span>{t.hero_btn_primary || 'Nothing nima?'}</span>
          </button>
        </motion.div>

        {/* Quick Social Proof Bar & Pricing Ticker */}
        <motion.div
          variants={item}
          className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-3 px-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs text-white/60 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 size={14} />
            <span>4,200+ To‘lovlar bajarilgan</span>
          </div>

          <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-white/80">
            <ShieldCheck size={14} className="text-sky-400" />
            <span>100% Hech narsa kafolati</span>
          </div>

          <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-1 text-white/70 font-mono">
            <span>Tariflar:</span>
            <span className="font-bold text-white">1 999 — 555 555 UZS</span>
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p variants={item} className="text-xs text-white/30 tracking-wider mt-8">
          {t.hero_footnote}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <button
            onClick={() => document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            aria-label="Tariflarga o'tish"
          >
            <span className="text-[10px] uppercase tracking-widest font-mono">Pastga suring</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowDown size={18} />
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
