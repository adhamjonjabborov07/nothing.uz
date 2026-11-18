import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface PaymentBannerProps {
  onOpenPayment: (planName?: string, price?: string) => void;
}

export default function PaymentBanner({ onOpenPayment }: PaymentBannerProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleTelegramClick = () => {
    const text = encodeURIComponent("Salom! Men Nothing.uz saytidan to'lov qilmoqchiman. Tariflar bo'yicha ma'lumot bersangiz.");
    window.open(`https://t.me/uzouf?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[60] bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-b border-white/10 px-4 py-2.5 text-xs sm:text-sm text-white shadow-2xl backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left badge & message */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.payment_banner_badge || 'JONLI TO‘LOV'}
            </span>

            <div className="flex items-center gap-1.5 text-white/90 font-medium">
              <span className="hidden sm:inline font-bold text-white">
                {t.payment_banner_title || '🔥 Rasmiy to‘lovlar ochildi:'}
              </span>
              <span className="text-white/80">
                {t.payment_banner_desc || 'Istalgan Nothing tarifini Telegram orqali 1 daqiqada oling'}
              </span>
              <button
                onClick={handleTelegramClick}
                className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors ml-1"
              >
                <span>@uzouf</span>
              </button>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPayment('PREMIUM NOTHING', '22,222 UZS')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md hover:shadow-white/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send size={12} className="text-sky-600" />
              <span>{t.payment_banner_btn || 'To‘lov (@uzouf)'}</span>
              <ArrowRight size={12} />
            </button>

            <button
              onClick={() => {
                document.getElementById('subscriptions')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles size={12} />
              <span>10 ta tarif</span>
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer ml-1"
              title="Yopish"
              aria-label="Yopish"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
