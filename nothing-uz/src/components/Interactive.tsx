import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { Wand2, Loader2, BarChart3, Hash, Mail, Shuffle, Sparkles } from 'lucide-react';

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

function InteractiveCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Interactive() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Give Me Something
  const [showGiveMe, setShowGiveMe] = useState(false);

  // Generate Nothing
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);

  // Progress
  const [progress] = useState(100);

  // Random generator
  const [randomMsg, setRandomMsg] = useState('');

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  }, []);

  const handleLoading = useCallback(() => {
    setLoading(true);
    setLoadingDone(false);
    setTimeout(() => {
      setLoading(false);
      setLoadingDone(true);
    }, 2500);
  }, []);

  const handleRandom = useCallback(() => {
    const messages = [t.int_random_1, t.int_random_2, t.int_random_3, t.int_random_4, t.int_random_5];
    setRandomMsg(messages[Math.floor(Math.random() * messages.length)]);
  }, [t]);

  // Auto-reset generate after showing
  useEffect(() => {
    if (generated) {
      const timer = setTimeout(() => setGenerated(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [generated]);

  return (
    <section className="section-dark py-32 px-6">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={item} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/40 tracking-widest uppercase mb-6">
            <Sparkles size={12} />
            {t.int_badge}
          </span>
          <h2 className="text-section font-extrabold text-white">
            {t.int_title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Give Me Something */}
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <Wand2 size={18} className="text-white/30" />
              <h3 className="font-semibold text-white">{t.int_give_me}</h3>
            </div>
            <button
              onClick={() => setShowGiveMe(true)}
              className="btn-secondary text-sm mb-4 w-full"
            >
              {t.int_give_me}
            </button>
            <AnimatePresence>
              {showGiveMe && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white/40 text-sm text-center"
                >
                  {t.int_give_me_result}
                </motion.p>
              )}
            </AnimatePresence>
          </InteractiveCard>

          {/* Generate Nothing */}
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <Loader2 size={18} className={`text-white/30 ${generating ? 'animate-spin' : ''}`} />
              <h3 className="font-semibold text-white">{t.int_generate}</h3>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-secondary text-sm mb-4 w-full disabled:opacity-50"
            >
              {generating ? t.int_loading : t.int_generate}
            </button>
            <AnimatePresence>
              {generated && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/40 text-sm text-center"
                >
                  ✨ {t.int_generate_result}
                </motion.p>
              )}
            </AnimatePresence>
          </InteractiveCard>

          {/* Loading Animation */}
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={18} className="text-white/30" />
              <h3 className="font-semibold text-white">{t.int_loading.replace('...', '')}</h3>
            </div>
            <button
              onClick={handleLoading}
              disabled={loading}
              className="btn-secondary text-sm mb-4 w-full disabled:opacity-50"
            >
              {loading ? t.int_loading : t.int_start_loading}
            </button>
            {loading && (
              <div className="space-y-2">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                    className="h-full bg-white/40 rounded-full"
                  />
                </div>
                <p className="text-white/30 text-xs text-center">{t.int_loading}</p>
              </div>
            )}
            <AnimatePresence>
              {loadingDone && !loading && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/40 text-sm text-center"
                >
                  ✅ {t.int_loading_done}
                </motion.p>
              )}
            </AnimatePresence>
          </InteractiveCard>

          {/* Progress & Counter */}
          <InteractiveCard>
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/40">{t.int_progress}</span>
                  <span className="text-sm font-mono text-white/60">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={isInView ? { width: '100%' } : {}}
                    transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-white/30 rounded-full"
                  />
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-white/30" />
                  <span className="text-sm text-white/40">{t.int_counter}</span>
                </div>
                <span className="text-3xl font-extrabold text-white/80 font-mono">0</span>
              </div>
            </div>
          </InteractiveCard>

          {/* Contact Us */}
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <Mail size={18} className="text-white/30" />
              <h3 className="font-semibold text-white">{t.int_contact}</h3>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('contact-result');
                if (el) el.style.display = el.style.display === 'none' ? 'block' : 'block';
              }}
              className="btn-secondary text-sm mb-4 w-full"
              id="contact-btn"
            >
              {t.int_contact}
            </button>
            <p id="contact-result" className="text-white/40 text-sm text-center">
              {t.int_contact_result}
            </p>
          </InteractiveCard>

          {/* Random Nothing Generator */}
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <Shuffle size={18} className="text-white/30" />
              <h3 className="font-semibold text-white">{t.int_random_title}</h3>
            </div>
            <button
              onClick={handleRandom}
              className="btn-secondary text-sm mb-4 w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Shuffle size={14} />
                {t.int_generate_btn}
              </span>
            </button>
            <AnimatePresence mode="wait">
              {randomMsg && (
                <motion.p
                  key={randomMsg}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white/40 text-sm text-center"
                >
                  {randomMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </InteractiveCard>
        </div>
      </motion.div>
    </section>
  );
}
