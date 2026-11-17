import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { ShieldCheck } from 'lucide-react';

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
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
    <section id="disclaimer" className="section-dark py-32 px-6">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={item} className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ShieldCheck size={22} className="text-white/40" />
          </div>
        </motion.div>

        <motion.h2 variants={item} className="text-section font-extrabold text-white mb-6 text-center">
          {t.disclaimer_title}
        </motion.h2>

        <motion.p variants={item} className="text-white/40 text-center mb-10 text-subtitle">
          {t.disclaimer_text_1}
        </motion.p>

        <motion.div variants={item} className="space-y-4">
          {points.map((point, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 flex-shrink-0" />
              <p className="text-white/50 text-sm leading-relaxed">
                {point}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
