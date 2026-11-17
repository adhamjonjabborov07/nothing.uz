import { Suspense, lazy } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { ArrowDown, Sparkles } from 'lucide-react';

const Scene3D = lazy(() => import('./Scene3D'));

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden section-dark">
      {/* 3D Scene */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-nothing-black/20 via-transparent to-nothing-black z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-nothing-black/30 via-transparent to-nothing-black/30 z-[1]" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Label */}
        <motion.div variants={item} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium text-white/70 tracking-widest uppercase">
            <Sparkles size={12} className="text-white/50" />
            {t.hero_label}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 variants={item} className="text-hero font-extrabold text-white mb-6">
          {t.hero_title_1}
          <br />
          <span className="gradient-text">{t.hero_title_2}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={item} className="text-subtitle text-white/70 max-w-2xl mx-auto mb-10">
          {t.hero_subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            {t.hero_btn_primary}
          </button>
          <button
            onClick={() => document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            {t.hero_btn_secondary}
          </button>
        </motion.div>

        {/* Footnote */}
        <motion.p variants={item} className="text-xs text-white/25 tracking-wider">
          {t.hero_footnote}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-white/20"
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
