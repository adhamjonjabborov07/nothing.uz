import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Clock,
  Lock
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { recordDonation } from '../utils/donationState';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  priceStr: string;
  numPrice?: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  priceStr,
  numPrice = 22222,
}: PaymentModalProps) {
  const { t } = useLanguage();
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'telegram' | 'card'>('telegram');
  const [isSuccess, setIsSuccess] = useState(false);

  const telegramUsername = 'uzouf';
  const cardNumber = '8600 4904 1234 5678';
  const cardHolder = 'NOTHING CORP (UZOUF)';

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(`@${telegramUsername}`);
    setCopiedUsername(true);
    setTimeout(() => setCopiedUsername(false), 2000);
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleOpenTelegram = () => {
    // Record this purchase in live donation ticker for fun & social proof
    recordDonation(numPrice, `${planName} Xaridori`, `@uzouf orqali ${planName} tarifiga to'lov qildi`);

    const msg = encodeURIComponent(
      `Assalomu alaykum @${telegramUsername}!\n\nMen Nothing.uz saytidan quyidagi tarifga to'lov qilmoqchiman:\n📦 Tarif: ${planName}\n💰 Narxi: ${priceStr}\n\nTo'lov rekvizitlarini yuborsangiz!`
    );
    window.open(`https://t.me/${telegramUsername}?text=${msg}`, '_blank', 'noopener,noreferrer');
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 my-8 overflow-hidden"
        >
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-white/15 flex items-center justify-center text-sky-400">
                  <Send size={22} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {t.payment_title || 'To‘lovni amalga oshirish'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60">
                    Telegram rasmiy operator: <span className="text-sky-400 font-bold">@{telegramUsername}</span>
                  </p>
                </div>
              </div>

              {/* Selected Plan Card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                    {t.payment_selected_plan || 'Tanlangan tarif'}
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{planName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                      100% Nothing
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                    {t.payment_total || 'Jami to‘lov'}
                  </div>
                  <div className="text-xl font-extrabold font-mono text-emerald-400">
                    {priceStr}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentTab('telegram')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentTab === 'telegram'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Send size={15} />
                  <span>Telegram @uzouf</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">Tezkor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentTab === 'card'
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <CreditCard size={15} />
                  <span>Karta / Payme / Click</span>
                </button>
              </div>

              {/* Tab 1: Telegram Payment (Recommended) */}
              {paymentTab === 'telegram' ? (
                <div className="space-y-4 mb-6">
                  {/* Step by step */}
                  <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 space-y-2.5 text-xs text-white/80">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </div>
                      <p>
                        Quyidagi tugmani bosing va Telegram orqali <strong className="text-sky-300">@{telegramUsername}</strong> profiliga kiring.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </div>
                      <p>
                        Tanlangan <strong>{planName}</strong> tarifi uchun rekvizitlarni oling (Payme, Click, Uzum yoki Karta).
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </div>
                      <p>
                        To‘lovni amalga oshiring va darhol rasman <strong>100% sof Hech Narsaga</strong> ega bo‘ling!
                      </p>
                    </div>
                  </div>

                  {/* Username Quick Copy Strip */}
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-sky-400" />
                      <span className="text-white/60">Rasmiy Telegram:</span>
                      <span className="font-mono font-bold text-white text-sm">@{telegramUsername}</span>
                    </div>
                    <button
                      onClick={handleCopyUsername}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      {copiedUsername ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Nusxalandi!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Nusxalash</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 text-[11px] text-white/50 px-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Operator @{telegramUsername} hozir onlayn · O‘rtacha javob vaqti: 1-3 daqiqa</span>
                  </div>

                  {/* Big Action Button */}
                  <button
                    onClick={handleOpenTelegram}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                  >
                    <Send size={18} />
                    <span>Telegram @{telegramUsername} orqali to‘lash</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              ) : (
                /* Tab 2: Direct Card / Click / Payme info */
                <div className="space-y-4 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/15 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-white/50 text-[11px] border-b border-white/10 pb-2">
                      <span>RASMIY HISOB RAQAM</span>
                      <span className="text-emerald-400 font-bold">Faol / Uzcard</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-white/40 mb-1">KARTA RAQAMI:</div>
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold text-white tracking-widest">
                          {cardNumber}
                        </span>
                        <button
                          onClick={handleCopyCard}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCard ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                          <span>{copiedCard ? 'Olingan' : 'Nusxa'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-white/50">Qabul qiluvchi:</span>
                      <span className="text-white font-bold">{cardHolder}</span>
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/50">Summa:</span>
                      <span className="text-emerald-400 font-bold">{priceStr}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 bg-white/5 p-3 rounded-xl border border-white/10">
                    💡 To‘lovni amalga oshirgach, chek skrinshotini Telegram orqali{' '}
                    <strong className="text-sky-400">@{telegramUsername}</strong> ga yuboring. Tarif bir zumda faollashtiriladi!
                  </p>

                  <button
                    onClick={handleOpenTelegram}
                    className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg shadow-white/10"
                  >
                    <Send size={16} className="text-sky-600" />
                    <span>Chekni @{telegramUsername} ga yuborish</span>
                  </button>
                </div>
              )}

              {/* Guarantees Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <Lock size={12} className="text-emerald-400" />
                  <span>256-bit xavfsiz to‘lov</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-sky-400" />
                  <span>100% Hech narsa kafolati</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-white/40" />
                  <span>24/7 Yordam: @{telegramUsername}</span>
                </span>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400"
              >
                <CheckCircle2 size={36} />
              </motion.div>

              <h3 className="text-2xl font-black text-white mb-2">
                Telegram ochildi!
              </h3>
              <p className="text-sm text-white/70 mb-4 max-w-sm mx-auto">
                Siz <strong>{planName}</strong> tarifi uchun Telegramdagi operatorimiz <strong className="text-sky-400">@{telegramUsername}</strong> ga yo‘naltirildingiz.
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/60 mb-6 font-mono text-left space-y-1.5">
                <div className="text-white/40 font-bold border-b border-white/10 pb-1 mb-2">
                  BUYURTMA TAFSILOTLARI:
                </div>
                <div>Tarif: <span className="text-white font-bold">{planName}</span></div>
                <div>Summa: <span className="text-emerald-400 font-bold">{priceStr}</span></div>
                <div>Operator: <span className="text-sky-400 font-bold">@{telegramUsername}</span></div>
                <div>Yetkaziladigan tovar: <span className="text-white">0 ta (Mutlaqo Hech Narsa)</span></div>
                <div>Holat: <span className="text-emerald-400 font-bold">Kutilmoqda (Operator onlayn)</span></div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleOpenTelegram}
                  className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  <span>Qayta ochish (@{telegramUsername})</span>
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
