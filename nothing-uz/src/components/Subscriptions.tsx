import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n';
import { Check, Star, Zap, X } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function SubscriptionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-nothing-dark border border-white/10 rounded-3xl p-10 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6"
            >
              <Check size={28} className="text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-3">
              {t.modal_title}
            </h3>
            <p className="text-white/50 mb-2">
              {t.modal_text_1}
            </p>
            <p className="text-white/40 text-sm mb-8">
              {t.modal_text_2}
            </p>
            <button onClick={onClose} className="btn-primary w-full">
              {t.modal_btn}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Subscriptions() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const plans = [
    {
      name: t.sub_basic_name,
      price: t.sub_basic_price,
      desc: t.sub_basic_desc,
      features: [t.sub_basic_f1, t.sub_basic_f2, t.sub_basic_f3, t.sub_basic_f4, t.sub_basic_f5],
      btn: t.sub_basic_btn,
      featured: false,
      badge: null,
    },
    {
      name: t.sub_premium_name,
      price: t.sub_premium_price,
      desc: t.sub_premium_desc,
      features: [t.sub_premium_f1, t.sub_premium_f2, t.sub_premium_f3, t.sub_premium_f4, t.sub_premium_f5],
      btn: t.sub_premium_btn,
      featured: true,
      badge: t.sub_premium_badge,
    },
    {
      name: t.sub_ultra_name,
      price: t.sub_ultra_price,
      desc: t.sub_ultra_desc,
      features: [t.sub_ultra_f1, t.sub_ultra_f2, t.sub_ultra_f3, t.sub_ultra_f4, t.sub_ultra_f5],
      btn: t.sub_ultra_btn,
      featured: false,
      badge: t.sub_ultra_badge,
    },
  ];

  return (
    <>
      <section id="subscriptions" className="section-dark py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-nothing-black via-nothing-black to-nothing-dark pointer-events-none" />
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={cardVariant} className="text-center mb-16">
            <h2 className="text-section font-extrabold text-white mb-4">
              {t.sub_title}
            </h2>
            <p className="text-subtitle text-white/40 max-w-xl mx-auto">
              {t.sub_subtitle}
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative rounded-3xl p-8 border transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.03] text-white border-white/20 shadow-2xl shadow-white/5'
                    : 'bg-white/[0.05] text-white border-white/[0.12] hover:border-white/25 hover:bg-white/[0.08]'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.featured
                      ? 'bg-white text-nothing-black'
                      : 'bg-white/10 text-white/70'
                  }`}>
                    <span className="flex items-center gap-1">
                      {i === 1 ? <Star size={10} /> : <Zap size={10} />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
<p className={`text-xs font-semibold tracking-[0.2em] mb-6 ${
                   plan.featured ? 'text-white/50' : 'text-white/50'
                 }`}>
                   {plan.name}
                 </p>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold tracking-tight ${
                    plan.featured ? 'text-white' : 'text-white'
                  }`}>
                    {plan.price.split(' ')[0]}
                  </span>
                  <span className={`text-sm ml-2 ${
                    plan.featured ? 'text-white/40' : 'text-white/30'
                  }`}>
                    UZS
                  </span>
                </div>

                {/* Description */}
<p className={`text-sm mb-8 ${
                   plan.featured ? 'text-white/60' : 'text-white/40'
                 }`}>
                   {plan.desc}
                 </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
<Check size={16} className={`mt-0.5 flex-shrink-0 ${
                    plan.featured ? 'text-white/30' : 'text-white/30'
                  }`} />
                      <span className={`text-sm ${
                        plan.featured ? 'text-white/60' : 'text-white/50'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => setModalOpen(true)}
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
                    plan.featured
                      ? 'bg-white text-nothing-black hover:bg-white/90'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.btn}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <SubscriptionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
