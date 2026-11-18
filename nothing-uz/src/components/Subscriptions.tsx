import { useState, useRef, useMemo } from 'react';
import { motion, useInView, LayoutGroup, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import PaymentModal from './PaymentModal';
import { Tilt3DCard } from './MotionUI';
import {
  Check,
  Star,
  Zap,
  Sparkles,
  Crown,
  Gem,
  Rocket,
  Shield,
  Infinity as InfinityIcon,
  Flame,
  Send,
  ArrowRight
} from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

type Category = 'all' | 'starter' | 'popular' | 'vip';

export default function Subscriptions() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; numPrice: number }>({
    name: 'PREMIUM NOTHING',
    price: '22,222 UZS',
    numPrice: 22222,
  });
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isAnnual, setIsAnnual] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // 10 Comprehensive Plans
  const plans = useMemo(() => [
    {
      id: 'micro',
      category: 'starter' as const,
      name: t.sub_micro_name || 'MICRO NOTHING',
      price: t.sub_micro_price || '1,999 UZS',
      numPrice: 1999,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_micro_desc || 'Eng kichik Nothing tajribasi.',
      features: [
        t.sub_micro_f1 || 'Mikroskopik hajmdagi hech narsa.',
        t.sub_micro_f2 || 'Nol nano-funksiya.',
        t.sub_micro_f3 || 'Oddiy ko‘z bilan ko‘rib bo‘lmaydi.',
        t.sub_micro_f4 || 'Har qanday bo‘sh cho‘ntakka sig‘adi.',
        t.sub_micro_f5 || 'O‘sha hech narsa, faqat mitti narxda.',
      ],
      btn: t.sub_micro_btn || 'Micro Nothing olish',
      featured: false,
      badge: t.sub_micro_badge || 'Hamyonbop',
      icon: Sparkles,
      color: 'from-zinc-500/10 to-transparent',
    },
    {
      id: 'starter',
      category: 'starter' as const,
      name: t.sub_starter_name || 'STARTER NOTHING',
      price: t.sub_starter_price || '4,999 UZS',
      numPrice: 4999,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_starter_desc || 'Boshlang‘ich Nothing. Har kim qayerdandir boshlashi kerak.',
      features: [
        t.sub_starter_f1 || 'Boshlang‘ich darajadagi hech narsa.',
        t.sub_starter_f2 || 'Qo‘llanma va darsliklar mutlaqo yo‘q.',
        t.sub_starter_f3 || 'O‘rganish talab etilmaydi.',
        t.sub_starter_f4 || 'To‘liq bo‘m-bo‘sh boshlang‘ich to‘plam.',
        t.sub_starter_f5 || 'Nol murakkablik.',
      ],
      btn: t.sub_starter_btn || 'Starter Nothing olish',
      featured: false,
      badge: t.sub_starter_badge || '🆕 Yangi',
      icon: CompassIcon,
      color: 'from-blue-500/10 to-transparent',
    },
    {
      id: 'basic',
      category: 'starter' as const,
      name: t.sub_basic_name || 'BASIC NOTHING',
      price: t.sub_basic_price || '11,111 UZS',
      numPrice: 11111,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_basic_desc || 'Klassik Nothing. Arzon va sifatli bo‘shliqni xohlovchilar uchun.',
      features: [
        t.sub_basic_f1 || '100% Kafolatlangan hech narsa.',
        t.sub_basic_f2 || 'Nol funksiya.',
        t.sub_basic_f3 || 'Nol moddiy foyda.',
        t.sub_basic_f4 || 'Eksklyuziv kontent mutlaqo yo‘q.',
        t.sub_basic_f5 || 'Tekingisidan umuman farq qilmaydi.',
      ],
      btn: t.sub_basic_btn || 'Basic Nothing olish',
      featured: false,
      badge: t.sub_basic_badge || 'Klassik',
      icon: Shield,
      color: 'from-zinc-500/10 to-transparent',
    },
    {
      id: 'standard',
      category: 'popular' as const,
      name: t.sub_standard_name || 'STANDARD NOTHING',
      price: t.sub_standard_price || '19,999 UZS',
      numPrice: 19999,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_standard_desc || 'Kundalik odamlar uchun standart darajadagi Nothing.',
      features: [
        t.sub_standard_f1 || 'Standart sifatli hech narsa.',
        t.sub_standard_f2 || 'ISO 0000 standarti talablariga mos.',
        t.sub_standard_f3 || 'Sifat nazorati kerak emas (chunki yo‘q).',
        t.sub_standard_f4 || 'Sertifikatlangan bo‘shliq.',
        t.sub_standard_f5 || 'Barcha standartlarga nol ta’sir.',
      ],
      btn: t.sub_standard_btn || 'Standard Nothing olish',
      featured: false,
      badge: t.sub_standard_badge || 'Standart',
      icon: Rocket,
      color: 'from-indigo-500/10 to-transparent',
    },
    {
      id: 'premium',
      category: 'popular' as const,
      name: t.sub_premium_name || 'PREMIUM NOTHING',
      price: t.sub_premium_price || '22,222 UZS',
      numPrice: 22222,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_premium_desc || 'O‘zining hech narsasiga jiddiy qaraydiganlar uchun. Bizning bestseller.',
      features: [
        t.sub_premium_f1 || '100% Premium-klassdagi hech narsa.',
        t.sub_premium_f2 || 'Nol qo‘shimcha imkoniyat.',
        t.sub_premium_f3 || 'Aynan o‘sha hech narsa, lekin hashamatli.',
        t.sub_premium_f4 || 'Hech qanday premium ortiqchalik yo‘q.',
        t.sub_premium_f5 || 'Basic bilan bir xil, lekin qimmatroq.',
      ],
      btn: t.sub_premium_btn || 'Premium Nothing olish',
      featured: true,
      badge: t.sub_premium_badge || '⭐ Eng ommabop',
      icon: Star,
      color: 'from-amber-500/20 via-sky-500/15 to-transparent',
    },
    {
      id: 'ultra',
      category: 'popular' as const,
      name: t.sub_ultra_name || 'ULTRA NOTHING',
      price: t.sub_ultra_price || '33,333 UZS',
      numPrice: 33333,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_ultra_desc || 'Hech narsa ultra narxga arziydi deb hisoblovchilar uchun.',
      features: [
        t.sub_ultra_f1 || '100% Ultra Nothing tajribasi.',
        t.sub_ultra_f2 || 'VIP imtiyozlar mutlaqo yo‘q.',
        t.sub_ultra_f3 || 'Ortiqcha hech narsa yo‘q.',
        t.sub_ultra_f4 || 'Alohida munosabat ko‘rsatilmaydi.',
        t.sub_ultra_f5 || 'Oddiy Nothing bilan 100% bir xil.',
      ],
      btn: t.sub_ultra_btn || 'Ultra Nothing olish',
      featured: false,
      badge: t.sub_ultra_badge || '⚡ Ultra Tezkor',
      icon: Zap,
      color: 'from-amber-500/15 to-transparent',
    },
    {
      id: 'pro',
      category: 'popular' as const,
      name: t.sub_pro_name || 'PRO NOTHING',
      price: t.sub_pro_price || '44,444 UZS',
      numPrice: 44444,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_pro_desc || 'Tajribali va professional hech narsa ishqibozlari uchun.',
      features: [
        t.sub_pro_f1 || 'Professional darajadagi sof hech narsa.',
        t.sub_pro_f2 || 'Nol professional asbob-uskuna.',
        t.sub_pro_f3 || 'Samaradorlik 0% ga oshadi.',
        t.sub_pro_f4 || 'Bo‘m-bo‘sh shaxsiy kabinet.',
        t.sub_pro_f5 || 'O‘zgarmas kafolatlangan bo‘shliq.',
      ],
      btn: t.sub_pro_btn || 'Pro Nothing olish',
      featured: false,
      badge: t.sub_pro_badge || '💎 Eng foydali',
      icon: Gem,
      color: 'from-cyan-500/15 to-transparent',
    },
    {
      id: 'enterprise',
      category: 'vip' as const,
      name: t.sub_enterprise_name || 'ENTERPRISE NOTHING',
      price: t.sub_enterprise_price || '99,999 UZS',
      numPrice: 99999,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_enterprise_desc || 'Katta kompaniyalar va jamoalar uchun korporativ Nothing.',
      features: [
        t.sub_enterprise_f1 || 'Korporativ miqyosdagi ulkan bo‘shliq.',
        t.sub_enterprise_f2 || 'Nol API integratsiya.',
        t.sub_enterprise_f3 || 'Shaxsiy menejer biriktirilmaydi.',
        t.sub_enterprise_f4 || 'Bo‘m-bo‘sh SLA shartnomasi.',
        t.sub_enterprise_f5 || 'Barcha xodimlar uchun cheksiz hech narsa.',
      ],
      btn: t.sub_enterprise_btn || 'Enterprise Nothing olish',
      featured: false,
      badge: t.sub_enterprise_badge || '🏢 Korporativ',
      icon: Flame,
      color: 'from-purple-500/15 to-transparent',
    },
    {
      id: 'diamond',
      category: 'vip' as const,
      name: t.sub_diamond_name || 'DIAMOND NOTHING',
      price: t.sub_diamond_price || '222,222 UZS',
      numPrice: 222222,
      period: isAnnual ? '/yiliga' : '/oyiga',
      desc: t.sub_diamond_desc || 'Elita va boylar uchun olmosli Nothing. Pul sotib olishi mumkin bo‘lgan eng oliy hech narsa.',
      features: [
        t.sub_diamond_f1 || 'Olmos bilan qoplangan sof hech narsa.',
        t.sub_diamond_f2 || 'Nol hashamatli bonus.',
        t.sub_diamond_f3 || 'VIP zonaga ruxsat yo‘q.',
        t.sub_diamond_f4 || 'Shaxsiy konsyerj xizmati yo‘q.',
        t.sub_diamond_f5 || 'Aynan o‘sha hech narsa, olmos narxida.',
      ],
      btn: t.sub_diamond_btn || 'Diamond Nothing olish',
      featured: true,
      badge: t.sub_diamond_badge || '👑 Eksklyuziv',
      icon: Crown,
      color: 'from-amber-400/25 via-emerald-400/15 to-transparent',
    },
    {
      id: 'lifetime',
      category: 'vip' as const,
      name: t.sub_lifetime_name || 'LIFETIME NOTHING',
      price: t.sub_lifetime_price || '555,555 UZS',
      numPrice: 555555,
      period: 'bir martalik',
      desc: t.sub_lifetime_desc || 'Bir marta to‘lang — abadiy hech narsa oling. Meros qilib qoldirish mumkin.',
      features: [
        t.sub_lifetime_f1 || 'Umrbod kafolatlangan hech narsa.',
        t.sub_lifetime_f2 || 'Tugamaydigan nol funksiyalar.',
        t.sub_lifetime_f3 || 'Abadiy koinot bo‘shlig‘i kafolati.',
        t.sub_lifetime_f4 || 'Qaytarib berilmaydi (chunki qaytaradigan narsa yo‘q).',
        t.sub_lifetime_f5 || 'Avloddan avlodga o‘tuvchi Nothing merosi.',
      ],
      btn: t.sub_lifetime_btn || 'Lifetime Nothing olish',
      featured: true,
      badge: t.sub_lifetime_badge || '♾️ Abadiy',
      icon: InfinityIcon,
      color: 'from-emerald-400/25 via-sky-400/20 to-transparent',
    },
  ], [t, isAnnual]);

  const filteredPlans = useMemo(() => {
    if (activeCategory === 'all') return plans;
    return plans.filter((p) => p.category === activeCategory);
  }, [plans, activeCategory]);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan({
      name: plan.name,
      price: plan.price,
      numPrice: plan.numPrice,
    });
    setModalOpen(true);
  };

  return (
    <>
      <section id="subscriptions" className="section-dark py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Background glow ambiance */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-sky-500/5 via-white/[0.02] to-transparent rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Section Header */}
          <motion.div variants={cardVariant} className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400 tracking-widest uppercase mb-4 shadow-lg shadow-sky-500/10">
              <Send size={12} className="text-sky-400" />
              <span>To‘lovlar Telegram @uzouf orqali</span>
            </span>

            <h2 className="text-section font-black mb-4 gradient-heading">
              {t.sub_title}
            </h2>

            <p className="text-subtitle text-zinc-200 max-w-2xl mx-auto font-medium">
              {t.sub_subtitle}
            </p>

            {/* Filter Tabs & Billing toggle */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Category Pills with LayoutGroup */}
              <LayoutGroup id="tariff-categories">
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                  {[
                    { key: 'all', label: 'Barcha tariflar (10)' },
                    { key: 'starter', label: 'Hamyonbop (3)' },
                    { key: 'popular', label: 'Ommabop & Pro (4)' },
                    { key: 'vip', label: 'VIP & Elita (3)' },
                  ].map((tab) => {
                    const isActive = activeCategory === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveCategory(tab.key as Category)}
                        className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer z-10 ${
                          isActive ? 'text-black' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 bg-white rounded-xl shadow-lg -z-10"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70">
                <span className={!isAnnual ? 'text-white font-bold' : 'text-white/50'}>Oylik</span>
                <button
                  type="button"
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isAnnual ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={isAnnual ? 'text-white font-bold' : 'text-white/50'}>
                  Yillik
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  -20%
                </span>
              </div>
            </div>
          </motion.div>

          {/* 10 Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Tilt3DCard key={plan.id} className="h-full">
                  <motion.div
                    variants={cardVariant}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className={`relative rounded-3xl p-6 sm:p-7 border flex flex-col justify-between h-full transition-all ${
                      plan.featured
                        ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] text-white border-white/30 shadow-2xl shadow-white/5 ring-1 ring-white/20'
                        : 'bg-zinc-950/80 text-white border-white/10 hover:border-white/25 hover:bg-zinc-900/90'
                    }`}
                  >
                    {/* Subtle top card glow */}
                    <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${plan.color} rounded-t-3xl pointer-events-none`} />

                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase shadow-lg ${
                          plan.featured
                            ? 'bg-gradient-to-r from-amber-300 to-yellow-400 text-black'
                            : 'bg-zinc-800 text-zinc-100 border border-white/20'
                        }`}>
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Header: Icon & Plan Name */}
                      <div className="flex items-center justify-between mb-4 pt-2">
                        <p className="text-sm font-black tracking-wider text-white uppercase">
                          {plan.name}
                        </p>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          plan.featured ? 'bg-white/20 text-white' : 'bg-white/10 text-white/90'
                        }`}>
                          <Icon size={18} />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                            {plan.price.split(' ')[0]}
                          </span>
                          <span className="text-xs font-bold text-sky-400">
                            UZS
                          </span>
                          <span className="text-[11px] text-zinc-300 ml-1">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-200 mb-6 leading-relaxed min-h-[40px] font-medium">
                        {plan.desc}
                      </p>

                      {/* Features list */}
                      <div className="border-t border-white/10 pt-5 mb-6">
                        <ul className="space-y-2.5">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-xs text-zinc-100 font-medium">
                              <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                          plan.featured
                            ? 'bg-white text-black hover:bg-zinc-200 shadow-white/20 hover:scale-[1.01] active:scale-98'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30'
                        }`}
                      >
                        <Send size={14} className={plan.featured ? 'text-sky-600' : 'text-sky-400'} />
                        <span>{plan.btn}</span>
                        <ArrowRight size={14} />
                      </button>
                      <p className="text-[10px] text-center text-zinc-400 mt-2 font-mono">
                        Telegram @uzouf orqali 1 daqiqada
                      </p>
                    </div>
                  </motion.div>
                </Tilt3DCard>
              );
            })}
          </div>

          {/* Trust Banner Below Tariffs */}
          <motion.div
            variants={cardVariant}
            className="mt-16 p-6 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Shield size={14} />
                <span>100% Shaffof va Xavfsiz</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Maxsus yoki korporativ Nothing taklifi kerakmi?
              </h4>
              <p className="text-xs text-white/50">
                To‘g‘ridan-to‘g‘ri Telegramdagi operatorimiz @uzouf bilan bog‘laning.
              </p>
            </div>

            <button
              onClick={() => {
                const text = encodeURIComponent("Assalomu alaykum @uzouf! Men Nothing.uz bo'yicha maxsus taklif yoki to'lov qilmoqchiman.");
                window.open(`https://t.me/uzouf?text=${text}`, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Send size={15} />
              <span>Operator @uzouf ga yozish</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Payment Modal */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedPlan.name}
        priceStr={selectedPlan.price}
        numPrice={selectedPlan.numPrice}
      />
    </>
  );
}

function CompassIcon(props: { size?: number; className?: string }) {
  return <Rocket {...props} />;
}
