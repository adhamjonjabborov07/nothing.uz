import { useState, useEffect, useRef, useTransition } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { getDonationStats, recordDonation, type DonationStats, type DonationItem } from '../utils/donationState';
import { Heart, Users, Sparkles, TrendingUp, CircleOff, CheckCircle2, X, CreditCard, ArrowRight, Send } from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Hozirgina';
  if (diff < 3600) return `${Math.floor(diff / 60)}m oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}soat oldin`;
  return `${Math.floor(diff / 86400)}k oldin`;
}

const CONFETTI_DATA = [
  { x: -180, y: -450, color: '#ffffff', size: 8, rotate: 120, isCircle: true },
  { x: 120, y: -380, color: '#a1a1aa', size: 10, rotate: 340, isCircle: false },
  { x: -50, y: -520, color: '#ffffff', size: 6, rotate: 45, isCircle: false },
  { x: 220, y: -410, color: '#71717a', size: 7, rotate: 180, isCircle: true },
  { x: -310, y: -350, color: '#f4f4f5', size: 9, rotate: 270, isCircle: false },
  { x: 80, y: -490, color: '#ffffff', size: 5, rotate: 90, isCircle: true },
  { x: -120, y: -320, color: '#a1a1aa', size: 8, rotate: 15, isCircle: false },
  { x: 290, y: -460, color: '#ffffff', size: 11, rotate: 210, isCircle: true },
  { x: -250, y: -510, color: '#71717a', size: 6, rotate: 330, isCircle: false },
  { x: 160, y: -390, color: '#f4f4f5', size: 7, rotate: 80, isCircle: true },
  { x: -70, y: -430, color: '#ffffff', size: 9, rotate: 140, isCircle: false },
  { x: 40, y: -360, color: '#a1a1aa', size: 6, rotate: 300, isCircle: true },
  { x: -200, y: -480, color: '#ffffff', size: 10, rotate: 60, isCircle: false },
  { x: 260, y: -330, color: '#71717a', size: 8, rotate: 220, isCircle: true },
  { x: -140, y: -540, color: '#f4f4f5', size: 5, rotate: 190, isCircle: false },
  { x: 190, y: -470, color: '#ffffff', size: 8, rotate: 25, isCircle: true },
  { x: -280, y: -400, color: '#a1a1aa', size: 7, rotate: 160, isCircle: false },
  { x: 100, y: -550, color: '#ffffff', size: 6, rotate: 310, isCircle: true },
  { x: -30, y: -340, color: '#71717a', size: 9, rotate: 115, isCircle: false },
  { x: 320, y: -500, color: '#f4f4f5', size: 8, rotate: 75, isCircle: true },
];

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] overflow-hidden">
      {CONFETTI_DATA.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: window.innerWidth / 2 + p.x,
            y: window.innerHeight / 2 + p.y,
            scale: [0, 1.2, 0.6],
            rotate: p.rotate,
          }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function Donations() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [stats, setStats] = useState<DonationStats>(getDonationStats);
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(22222);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'telegram' | 'payme' | 'click' | 'uzum' | 'card'>('telegram');
  const [modalSuccess, setModalSuccess] = useState<DonationItem | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [, startTransition] = useTransition();

  const presets = [
    { label: '5,000 UZS', value: 5000, desc: 'Kichik Hech Narsa' },
    { label: '11,111 UZS', value: 11111, desc: 'Oddiy Nothing' },
    { label: '22,222 UZS', value: 22222, desc: 'Ommabop Nothing' },
    { label: '50,000 UZS', value: 50000, desc: 'Saxovatli Nothing' },
    { label: '100,000 UZS', value: 100000, desc: 'Qirollik Nothing' },
  ];

  // Listen for updates from other components
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DonationStats>;
      if (customEvent.detail) {
        startTransition(() => {
          setStats(customEvent.detail);
        });
      }
    };
    window.addEventListener('nothing-donation-updated', handleUpdate);
    return () => window.removeEventListener('nothing-donation-updated', handleUpdate);
  }, []);

  const effectiveAmount = selectedPreset === 'custom'
    ? (parseInt(customAmount.replace(/\D/g, ''), 10) || 0)
    : selectedPreset;

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 1000) {
      alert('Minimal xayriya miqdori 1,000 UZS');
      return;
    }

    const updated = recordDonation(effectiveAmount, donorName, donorMessage);
    setStats(updated);
    setModalSuccess(updated.recentDonations[0]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);

    // Reset inputs
    setDonorName('');
    setDonorMessage('');
    if (selectedPreset === 'custom') setCustomAmount('');
  };

  const avgDonation = stats.donorCount > 0 ? Math.round(stats.totalAmount / stats.donorCount) : 0;

  return (
    <>
      <ConfettiBurst active={showConfetti} />

      <section id="donations" className="section-dark py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden border-t border-white/[0.08]">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="max-w-6xl mx-auto relative z-10"
        >
          {/* Header */}
          <motion.div variants={cardVariant} className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/90 tracking-widest uppercase mb-4">
              <Sparkles size={12} className="text-emerald-400" />
              {t.donations_badge || '100% Real Nothing'}
            </span>
            <h2 className="text-section font-black mb-4 tracking-tight gradient-heading">
              {t.donations_title || 'Foydalanuvchilar Nothing-ga qancha to‘ladi?'}
            </h2>
            <p className="text-subtitle text-zinc-300 max-w-2xl mx-auto font-medium">
              {t.donations_subtitle || 'Hozircha hisoblagich 0 holatida. Birinchi bo‘lib Telegram @uzouf orqali to‘lov qiling va jonli ro‘yxatda paydo bo‘ling!'}
            </p>
          </motion.div>

          {/* 4 Key Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {/* 1. Total Donated */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/[0.05] border border-white/15 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  {t.donations_total_label || 'Jami to‘langan mablag‘'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Heart size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatCurrency(stats.totalAmount)}
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-emerald-400">
                UZS · So‘m
              </span>
            </motion.div>

            {/* 2. Donors count */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/[0.04] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  {t.donations_donors_label || 'Saxovatli homiylar'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-2">
                {stats.donorCount.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-300 font-medium">Hozircha 0 ta · Birinchi bo‘ling!</p>
            </motion.div>

            {/* 3. Features Delivered */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/[0.04] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  {t.donations_features_label || 'Taqdim etilgan funksiyalar'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80">
                  <CircleOff size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-2">
                0
              </div>
              <p className="text-xs text-zinc-300 font-medium">100% kafolatlangan hech narsa</p>
            </motion.div>

            {/* 4. Average Donation */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/[0.04] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
                  {t.donations_avg_label || 'O‘rtacha to‘lov'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-2">
                {formatCurrency(avgDonation)}
              </div>
              <p className="text-xs text-zinc-300 font-medium">UZS har bir foydalanuvchiga</p>
            </motion.div>
          </div>

          {/* Interactive Donation Form + Recent Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Donation Form (7 cols) */}
            <motion.div
              variants={cardVariant}
              className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/15 backdrop-blur-xl shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                {t.donations_cta_title || 'Nothing-ga to‘lov qiling'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6 font-medium">
                {t.donations_cta_subtitle || 'Nothing-ni qo‘llab-quvvatlash uchun miqdorni tanlang. Mahsulot yo‘q, xizmat yo‘q — faqat sof rohat.'}
              </p>

              <form onSubmit={handleDonate} className="space-y-6">
                {/* Presets */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                    Xayriya miqdorini tanlang:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setSelectedPreset(preset.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPreset === preset.value
                            ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-bold'
                            : 'bg-white/5 text-white border-white/10 hover:border-white/25 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm font-bold">{preset.label}</div>
                        <div className={`text-[11px] ${selectedPreset === preset.value ? 'text-black/70' : 'text-zinc-400'}`}>
                          {preset.desc}
                        </div>
                      </button>
                    ))}

                    {/* Custom button */}
                    <button
                      type="button"
                      onClick={() => setSelectedPreset('custom')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPreset === 'custom'
                          ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-bold'
                          : 'bg-white/5 text-white border-white/10 hover:border-white/25 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm font-bold">{t.donations_quick_custom || 'Boshqa summa'}</div>
                      <div className={`text-[11px] ${selectedPreset === 'custom' ? 'text-black/70' : 'text-zinc-400'}`}>
                        Ixtiyoriy miqdor
                      </div>
                    </button>
                  </div>
                </div>

                {/* Custom Amount Field */}
                {selectedPreset === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      {t.donations_custom_amount || 'Boshqa summa (UZS)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="Masalan: 77,777"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-400 outline-none focus:border-white font-mono text-sm"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-300 font-mono">
                        UZS
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Donor details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      {t.donations_your_name || 'Ismingiz yoki taxallusingiz'}
                    </label>
                    <input
                      type="text"
                      placeholder="Anonim saxovatpesha"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none focus:border-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      {t.donations_optional_msg || 'Telegram username yoki xabar'}
                    </label>
                    <input
                      type="text"
                      placeholder="@username yoki tilaklar"
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none focus:border-white font-medium"
                    />
                  </div>
                </div>

                {/* Payment method selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    {t.donations_payment_method || 'To‘lov usuli'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('telegram')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'telegram'
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20 col-span-2 sm:col-span-1'
                          : 'bg-sky-500/10 text-sky-400 border-sky-500/25 hover:bg-sky-500/20 col-span-2 sm:col-span-1'
                      }`}
                    >
                      <Send size={12} />
                      @uzouf
                    </button>
                    {(['payme', 'click', 'uzum', 'card'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-white/20 text-white border-white'
                            : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <CreditCard size={12} />
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-base font-extrabold flex items-center justify-center gap-2 group cursor-pointer shadow-xl shadow-white/10"
                >
                  <span>
                    {formatCurrency(effectiveAmount)} UZS — {t.donations_btn || 'Nothing-ga to‘lov qilish'}
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Recent Donors Feed (5 cols) */}
            <motion.div
              variants={cardVariant}
              className="lg:col-span-5 rounded-3xl p-6 bg-zinc-950 border border-white/15 flex flex-col h-full shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
                    {t.donations_recent_title || 'Jonli to‘lovlar oqimi'}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-zinc-400">Jonli oqim</span>
              </div>

              {/* List or Empty State */}
              <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                {stats.recentDonations.length === 0 ? (
                  <div className="py-14 px-4 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
                      <Heart size={24} className="text-white/60" />
                    </div>
                    <p className="text-base font-bold text-white mb-1.5">
                      Hali hech kim to‘lamadi
                    </p>
                    <p className="text-xs text-zinc-300 max-w-xs mb-5 leading-relaxed font-normal">
                      Nothing tarixida birinchi saxovatpesha bo‘ling! Telegram <strong className="text-sky-400">@uzouf</strong> orqali to‘lov qiling va bir zumda 100% hech narsaga ega bo‘ling.
                    </p>
                    <a
                      href={`https://t.me/uzouf?text=${encodeURIComponent("Assalomu alaykum @uzouf! Men Nothing.uz ga birinchi bo'lib to'lov qilmoqchiman.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                    >
                      <Send size={13} />
                      <span>Birinchi to‘lovni amalga oshirish (@uzouf)</span>
                    </a>
                  </div>
                ) : (
                  stats.recentDonations.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={item.isNew ? { opacity: 0, scale: 0.9, y: -10 } : false}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {item.name}
                          </span>
                          {item.isNew && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white text-black">
                              Yangi
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          +{formatCurrency(item.amount)} UZS
                        </span>
                      </div>

                      {item.message && (
                        <p className="text-xs text-zinc-300 italic mb-1.5 font-medium">
                          "{item.message}"
                        </p>
                      )}

                      <span className="text-[10px] text-zinc-400 font-mono">
                        {timeAgo(item.timestamp)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {modalSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setModalSuccess(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-zinc-950 border border-white/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl text-white"
            >
              <button
                onClick={() => setModalSuccess(null)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                {t.donations_modal_title || 'To‘lov qayd etildi!'}
              </h3>
              <p className="text-zinc-300 text-sm mb-4 font-medium">
                {t.donations_modal_desc1 || 'Siz Mutlaqo Hech Narsaga rasman to‘lov qildingiz.'}
              </p>

              {/* Satirical Receipt */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-zinc-400 border-b border-white/10 pb-2 mb-2 font-bold">
                  <span>KVITANSIYA / RECEIPT</span>
                  <span>#000001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Summa:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(modalSuccess.amount)} UZS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Yetkazilgan tovarlar:</span>
                  <span className="text-white font-bold">0 dona (Hech Narsa)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Ko‘rsatilgan xizmatlar:</span>
                  <span className="text-white font-bold">Yo‘q (0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Foydalanuvchi hissi:</span>
                  <span className="text-white font-bold">100% Qoniqish</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-6 font-medium">
                {t.donations_modal_desc2 || 'To‘lovingiz Nothing xazinasida qayd etildi. Telegram @uzouf orqali tasdiqlang!'}
              </p>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://t.me/uzouf?text=${encodeURIComponent(`Assalomu alaykum @uzouf! Men Nothing.uz ga ${formatCurrency(modalSuccess.amount)} UZS to'lov qildim.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                >
                  <Send size={14} />
                  <span>Telegram @uzouf ga chek yuborish</span>
                </a>

                <button
                  onClick={() => setModalSuccess(null)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {t.donations_modal_btn || 'Yopish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
