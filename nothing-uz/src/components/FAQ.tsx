import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={item}
      className="border-b border-white/10 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group cursor-pointer"
      >
        <span className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors pr-6">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-zinc-400 group-hover:text-white"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const faqs = [
    { q: t.faq_q1, a: t.faq_a1 },
    { q: t.faq_q2, a: t.faq_a2 },
    { q: t.faq_q3, a: t.faq_a3 },
    { q: t.faq_q4, a: t.faq_a4 },
    { q: t.faq_q5, a: t.faq_a5 },
    { q: t.faq_q6, a: t.faq_a6 },
    { q: t.faq_q7, a: t.faq_a7 },
    { q: t.faq_q8, a: t.faq_a8 },
  ];

  return (
    <section id="faq" className="section-dark bg-[var(--color-bg-primary,#0D111A)] py-24 sm:py-32 px-4 sm:px-6 border-t border-white/[0.08] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-sky-500/[0.04] to-transparent rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.div variants={item} className="text-center mb-12 sm:mb-16">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center mx-auto mb-4 text-white">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-section font-black tracking-tight mb-3 gradient-heading">
            {t.faq_title}
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Barcha savollarga aniq va ochiq javoblar. To‘lovlar bo‘yicha Telegram <span className="font-bold text-sky-400">@uzouf</span> ga yozing.
          </p>
        </motion.div>

        <div className="bg-zinc-900/40 rounded-3xl border border-white/10 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/50">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* Telegram FAQ Box */}
        <motion.div
          variants={item}
          className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl text-center flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-left">
            <p className="text-sm font-bold text-white">Boshqa savollaringiz bormi?</p>
            <p className="text-xs text-zinc-400">Operatorimiz 24/7 rejimida Telegramda javob beradi</p>
          </div>
          <a
            href="https://t.me/uzouf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 transition-colors shrink-0 shadow-lg shadow-sky-500/20"
          >
            <Send size={13} />
            <span>@uzouf ga yozish</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
