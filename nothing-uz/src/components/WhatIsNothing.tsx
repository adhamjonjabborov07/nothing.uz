import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../i18n';
import { CircleOff, TrendingDown, HelpCircle } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function WhatIsNothing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const columns = [
    {
      num: t.what_col1_num,
      title: t.what_col1_title,
      text: t.what_col1_text,
      icon: <CircleOff size={24} />,
    },
    {
      num: t.what_col2_num,
      title: t.what_col2_title,
      text: t.what_col2_text,
      icon: <TrendingDown size={24} />,
    },
    {
      num: t.what_col3_num,
      title: t.what_col3_title,
      text: t.what_col3_text,
      icon: <HelpCircle size={24} />,
    },
  ];

  return (
    <section id="about" className="section-light py-32 px-6">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-5xl mx-auto"
      >
        {/* Title */}
        <motion.h2 variants={item} className="text-section font-extrabold text-nothing-black mb-16 text-center">
          {t.what_title}
        </motion.h2>

        {/* Text block */}
        <motion.div variants={item} className="max-w-3xl mx-auto mb-20 space-y-6">
          <p className="text-subtitle text-nothing-black/70">
            {t.what_text_1}
          </p>
          <div className="space-y-2 text-lg text-nothing-black/50">
            <p>{t.what_text_2}</p>
            <p>{t.what_text_3}</p>
            <p>{t.what_text_4}</p>
            <p>{t.what_text_5}</p>
          </div>
          <p className="text-xl font-semibold text-nothing-black/80 pt-4">
            {t.what_text_6}
          </p>
        </motion.div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative p-8 rounded-2xl bg-white border border-nothing-black/5 hover:border-nothing-black/10 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-nothing-black/30 font-semibold">
                  {col.num}
                </span>
                <div className="w-8 h-px bg-nothing-black/10" />
              </div>
              <div className="text-nothing-black/20 mb-4 group-hover:text-nothing-black/40 transition-colors">
                {col.icon}
              </div>
              <h3 className="text-xl font-bold text-nothing-black mb-3">
                {col.title}
              </h3>
              <p className="text-sm text-nothing-black/50 leading-relaxed">
                {col.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
