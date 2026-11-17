import { useState, useEffect, useRef, useTransition } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../i18n';
import { getDonationStats, recordDonation, type DonationStats, type DonationItem } from '../utils/donationState';
import { Heart, Users, Sparkles, TrendingUp, CircleOff, CheckCircle2, X, CreditCard, ArrowRight } from 'lucide-react';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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

// Confetti burst component
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [stats, setStats] = useState<DonationStats>(getDonationStats);
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(22222);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'payme' | 'uzum' | 'card'>('payme');
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

      <section id="donations" className="section-dark py-32 px-6 relative overflow-hidden border-t border-white/[0.04]">
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
          <motion.div variants={cardVariant} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium text-white/70 tracking-widest uppercase mb-4">
              <Sparkles size={12} className="text-white/60" />
              {t.donations_badge || '100% Real Nothing'}
            </span>
            <h2 className="text-section font-extrabold text-white mb-4">
              {t.donations_title || 'How Much Have Users Donated to Nothing?'}
            </h2>
            <p className="text-subtitle text-white/40 max-w-2xl mx-auto">
              {t.donations_subtitle || 'Users from all over the world are donating real money for absolutely nothing in return. Here are the live statistics.'}
            </p>
          </motion.div>

          {/* 4 Key Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* 1. Total Donated */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.09] to-white/[0.03] border border-white/20 shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  {t.donations_total_label || 'Total Donated'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Heart size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {formatCurrency(stats.totalAmount)}
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                UZS · So‘m
              </span>
            </motion.div>

            {/* 2. Donors count */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  {t.donations_donors_label || 'Generous Donors'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
                {stats.donorCount.toLocaleString()}
              </div>
              <p className="text-xs text-white/40">Dunyo bo‘ylab saxiy foydalanuvchilar</p>
            </motion.div>

            {/* 3. Features Delivered */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  {t.donations_features_label || 'Features Delivered'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <CircleOff size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
                0
              </div>
              <p className="text-xs text-white/40">100% kafolatlangan hech narsa</p>
            </motion.div>

            {/* 4. Average Donation */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  {t.donations_avg_label || 'Average Donation'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
                {formatCurrency(avgDonation)}
              </div>
              <p className="text-xs text-white/40">UZS har bir foydalanuvchiga</p>
            </motion.div>
          </div>

          {/* Interactive Donation Form + Recent Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Donation Form (7 cols) */}
            <motion.div
              variants={cardVariant}
              className="lg:col-span-7 rounded-3xl p-8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {t.donations_cta_title || 'Donate to Nothing'}
              </h3>
              <p className="text-sm text-white/50 mb-6">
                {t.donations_cta_subtitle || 'Choose an amount to support Nothing. No goods, no services, just pure altruistic absurdity.'}
              </p>

              <form onSubmit={handleDonate} className="space-y-6">
                {/* Presets */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                    Xayriya miqdorini tanlang:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setSelectedPreset(preset.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedPreset === preset.value
                            ? 'bg-white text-nothing-black border-white shadow-lg shadow-white/10 font-bold'
                            : 'bg-white/5 text-white border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm">{preset.label}</div>
                        <div className={`text-[11px] ${selectedPreset === preset.value ? 'text-black/60' : 'text-white/40'}`}>
                          {preset.desc}
                        </div>
                      </button>
                    ))}

                    {/* Custom button */}
                    <button
                      type="button"
                      onClick={() => setSelectedPreset('custom')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedPreset === 'custom'
                          ? 'bg-white text-nothing-black border-white shadow-lg shadow-white/10 font-bold'
                          : 'bg-white/5 text-white border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm">{t.donations_quick_custom || 'Boshqa summa'}</div>
                      <div className={`text-[11px] ${selectedPreset === 'custom' ? 'text-black/60' : 'text-white/40'}`}>
                        Ixtiyoriy
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
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                      {t.donations_custom_amount || 'Custom amount (UZS)'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="Masalan: 77,777"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-white/40 transition-colors font-mono"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/40 font-mono">
                        UZS
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Donor details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                      {t.donations_your_name || 'Your Name or Nickname'}
                    </label>
                    <input
                      type="text"
                      placeholder="Anonim saxovatpesha"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                      {t.donations_optional_msg || 'Leave a note (optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Hech narsa uchun rahmat!"
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Payment method selector */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    {t.donations_payment_method || 'To‘lov usuli'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['payme', 'click', 'uzum', 'card'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          paymentMethod === method
                            ? 'bg-white/15 text-white border-white/40'
                            : 'bg-white/[0.02] text-white/40 border-white/5 hover:border-white/15'
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
                  className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 group"
                >
                  <span>
                    {formatCurrency(effectiveAmount)} UZS — {t.donations_btn || 'Send Donation to Nothing'}
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Recent Donors Feed (5 cols) */}
            <motion.div
              variants={cardVariant}
              className="lg:col-span-5 rounded-3xl p-6 bg-white/[0.03] border border-white/10 flex flex-col h-full"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                    {t.donations_recent_title || 'Recent Generous Donors'}
                  </h4>
                </div>
                <span className="text-xs text-white/40">Jonli oqim</span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                {stats.recentDonations.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={item.isNew ? { opacity: 0, scale: 0.9, y: -10 } : false}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {item.name}
                        </span>
                        {item.isNew && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white text-nothing-black">
                            Yangi
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-white/90">
                        +{formatCurrency(item.amount)} UZS
                      </span>
                    </div>

                    {item.message && (
                      <p className="text-xs text-white/50 italic mb-1.5">
                        "{item.message}"
                      </p>
                    )}

                    <span className="text-[10px] text-white/30">
                      {timeAgo(item.timestamp)}
                    </span>
                  </motion.div>
                ))}
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
            className="fixed inset-0 z-[250] flex items-center justify-center p-6"
            onClick={() => setModalSuccess(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-nothing-dark border border-white/20 rounded-3xl p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setModalSuccess(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 text-white">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {t.donations_modal_title || 'Xayriya qabul qilindi!'}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {t.donations_modal_desc1 || 'Siz Mutlaqo Hech Narsaga rasman xayriya qildingiz.'}
              </p>

              {/* Satirical Receipt */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-white/50 border-b border-white/10 pb-2 mb-2">
                  <span>KVITANSIYA / RECEIPT</span>
                  <span>#000000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Xayriya summasi:</span>
                  <span className="text-white font-bold">{formatCurrency(modalSuccess.amount)} UZS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Yetkazilgan tovarlar:</span>
                  <span className="text-white">0 dona</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Ko‘rsatilgan xizmatlar:</span>
                  <span className="text-white">Yo‘q (0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Foydalanuvchi hissi:</span>
                  <span className="text-white font-bold">100% Qoniqish</span>
                </div>
              </div>

              <p className="text-xs text-white/40 mb-6">
                {t.donations_modal_desc2 || 'Mablag‘ingiz Nothing xazinasida qayd etildi. Saxovatingiz uchun tashakkur!'}
              </p>

              <button
                onClick={() => setModalSuccess(null)}
                className="btn-primary w-full"
              >
                {t.donations_modal_btn || 'Faxr bilan yakunlash'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
