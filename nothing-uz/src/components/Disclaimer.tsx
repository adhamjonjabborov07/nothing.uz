import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { ShieldCheck, Send } from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Disclaimer() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const points = [
    t.disclaimer_text_2,
    t.disclaimer_text_3,
    t.disclaimer_text_4,
    t.disclaimer_text_5,
    t.disclaimer_text_6,
    t.disclaimer_text_7,
    t.disclaimer_text_8,
  ];

  return (
    <section id="disclaimer" className="section-dark py-24 sm:py-32 px-4 sm:px-6 border-t border-white/[0.08]">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={item} className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <ShieldCheck size={28} />
          </div>
        </motion.div>

        <motion.h2 variants={item} className="text-section font-black mb-4 text-center tracking-tight gradient-heading">
          {t.disclaimer_title}
        </motion.h2>

        <motion.p variants={item} className="text-zinc-300 text-center mb-10 text-subtitle font-medium">
          {t.disclaimer_text_1}
        </motion.p>

        <motion.div variants={item} className="space-y-3.5">
          {points.map((point, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-sm shadow-emerald-400/50" />
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-normal">
                {point}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between text-xs text-sky-300"
        >
          <span>To‘lovlar va savollar bo‘yicha rasmiy aloqa:</span>
          <a
            href="https://t.me/uzouf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline flex items-center gap-1 hover:text-white"
          >
            <Send size={12} />
            <span>@uzouf</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
