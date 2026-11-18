import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../i18n';
import { CircleOff, TrendingDown, HelpCircle } from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function WhatIsNothing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const columns = [
    {
      num: t.what_col1_num,
      title: t.what_col1_title,
      text: t.what_col1_text,
      icon: <CircleOff size={28} />,
    },
    {
      num: t.what_col2_num,
      title: t.what_col2_title,
      text: t.what_col2_text,
      icon: <TrendingDown size={28} />,
    },
    {
      num: t.what_col3_num,
      title: t.what_col3_title,
      text: t.what_col3_text,
      icon: <HelpCircle size={28} />,
    },
  ];

  return (
    <section id="about" className="section-dark bg-[var(--color-bg-primary,#0D111A)] py-24 sm:py-32 px-4 sm:px-6 relative border-t border-white/[0.08] overflow-hidden">
      {/* Ambient background glow for organic 3D integration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-sky-500/[0.03] via-white/[0.02] to-transparent rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Title */}
        <motion.div variants={item} className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[11px] font-bold text-zinc-300 tracking-widest uppercase mb-4">
            <CircleOff size={12} className="text-zinc-400" />
            <span>Falsafa & Konsept</span>
          </span>
          <h2 className="text-section font-black tracking-tight gradient-heading">
            {t.what_title}
          </h2>
        </motion.div>

        {/* Text block with glassmorphic backing plate */}
        <motion.div
          variants={item}
          className="max-w-3xl mx-auto mb-16 sm:mb-20 p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 space-y-6"
        >
          <p className="text-subtitle font-medium text-zinc-200 leading-relaxed">
            {t.what_text_1}
          </p>
          <div className="space-y-3 text-base sm:text-lg text-zinc-100 font-medium">
            <p className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 shrink-0" />
              <span>{t.what_text_2}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 shrink-0" />
              <span>{t.what_text_3}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 shrink-0" />
              <span>{t.what_text_4}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 shrink-0" />
              <span>{t.what_text_5}</span>
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white pt-4 border-t border-white/10">
            {t.what_text_6}
          </p>
        </motion.div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative p-7 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-white/25 hover:bg-zinc-900/70 transition-all backdrop-blur-xl shadow-xl shadow-black/40"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-sky-400 tracking-wider">
                  {col.num}
                </span>
                <div className="w-8 h-px bg-white/10" />
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200 group-hover:text-white group-hover:scale-110 transition-all mb-4">
                {col.icon}
              </div>

              <h3 className="text-xl font-black text-white mb-2.5">
                {col.title}
              </h3>

              <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                {col.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
