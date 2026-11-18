import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  X,
  Send,
  CreditCard,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Radio,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Copy,
  Users
} from 'lucide-react';
import { getDonationStats, recordDonation, resetDonations, type DonationStats } from '../utils/donationState';

interface FounderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderProfileModal({ isOpen, onClose }: FounderProfileModalProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nothing_founder_auth') === 'true';
    }
    return false;
  });

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Live Stats
  const [stats, setStats] = useState<DonationStats>(getDonationStats);

  // Founder Controls
  const [customDonorName, setCustomDonorName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [broadcastText, setBroadcastText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nothing_broadcast_msg') || '';
    }
    return '';
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [successActionMsg, setSuccessActionMsg] = useState<string | null>(null);

  // God Mode / Aura
  const [godMode, setGodMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nothing_god_mode') === 'true';
    }
    return false;
  });

  // Operator status
  const [operatorStatus, setOperatorStatus] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nothing_operator_status') || '24/7 Onlayn';
    }
    return '24/7 Onlayn';
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DonationStats>;
      if (customEvent.detail) {
        setStats(customEvent.detail);
      }
    };
    window.addEventListener('nothing-donation-updated', handleUpdate);
    return () => window.removeEventListener('nothing-donation-updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    // Passphrase or PIN for founder
    if (clean === 'uzouf' || clean === 'uzouf2026' || clean === '7777') {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem('nothing_founder_auth', 'true');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nothing_founder_auth');
  };

  const handleAddManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(customAmount.replace(/\D/g, ''), 10);
    if (!amt || amt <= 0) return;

    recordDonation(
      amt,
      customDonorName || 'Telegram Xaridor',
      customMessage || "@uzouf orqali qo'lda tasdiqlangan to'lov"
    );

    setCustomAmount('');
    setCustomDonorName('');
    setCustomMessage('');
    setSuccessActionMsg(`✅ Yangi to'lov (${amt.toLocaleString()} UZS) muvaffaqiyatli kiritildi!`);
    setTimeout(() => setSuccessActionMsg(null), 3000);
  };

  const handleResetCounters = () => {
    if (window.confirm("Barcha hisoblagichlarni 0 UZS holatiga tushirishni tasdiqlaysizmi?")) {
      resetDonations();
      setSuccessActionMsg("🔄 Hisoblagichlar 0 UZS ga tushirildi!");
      setTimeout(() => setSuccessActionMsg(null), 3000);
    }
  };

  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = broadcastText.trim();
    if (clean) {
      localStorage.setItem('nothing_broadcast_msg', clean);
      window.dispatchEvent(new CustomEvent('nothing-broadcast-updated', { detail: clean }));
      setSuccessActionMsg("📢 Yangi xabar jonli satrga (Ticker) uzatildi!");
    } else {
      localStorage.removeItem('nothing_broadcast_msg');
      window.dispatchEvent(new CustomEvent('nothing-broadcast-updated', { detail: null }));
      setSuccessActionMsg("Satr xabari tozalandi.");
    }
    setTimeout(() => setSuccessActionMsg(null), 3000);
  };

  const handleToggleGodMode = () => {
    const next = !godMode;
    setGodMode(next);
    localStorage.setItem('nothing_god_mode', next ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('nothing-god-mode-change', { detail: next }));
  };

  const handleOperatorStatusChange = (status: string) => {
    setOperatorStatus(status);
    localStorage.setItem('nothing_operator_status', status);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://t.me/uzouf');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-zinc-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 my-8 overflow-hidden backdrop-blur-2xl"
        >
          {/* Ambient Golden/Royal Glow for Founder */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
            title="Yopish"
          >
            <X size={18} />
          </button>

          {!isAuthenticated ? (
            /* ========================================================
               1. GATEWAY: AUTHENTICATION ("Faqat man uchun")
               ======================================================== */
            <div className="py-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-xl shadow-amber-500/10">
                <Crown size={32} />
              </div>

              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                ASOSCHI PROFILI
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6">
                Ushbu bo‘lim faqat Nothing.uz egasi va boshqaruvchisi <strong className="text-amber-400 font-bold">@uzouf</strong> uchun maxsus himoyalangan.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Maxfiy kalit yoki PIN..."
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-center font-mono text-sm tracking-widest"
                  />
                  {authError && (
                    <p className="text-xs text-red-400 mt-2 font-medium">
                      Maxfiy kalit noto‘g‘ri.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Unlock size={16} />
                  <span>Tasdiqlash va kirish</span>
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================
               2. EXCLUSIVE FOUNDER DASHBOARD (@uzouf)
               ======================================================== */
            <div className="space-y-6">
              {/* Founder Header Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-white/[0.04] to-red-500/10 border border-amber-500/25">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-amber-500/25">
                      <Crown size={30} className="text-black" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-xl font-black text-white">@uzouf</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30 uppercase tracking-wider">
                        ASOSCHI & EGA
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5 font-medium">
                      Nothing.uz mutlaq egasi va bosh direktori
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <a
                        href="https://t.me/uzouf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 hover:underline font-bold"
                      >
                        <Send size={11} />
                        <span>t.me/uzouf</span>
                      </a>
                      <span className="text-white/20">·</span>
                      <button
                        onClick={handleCopyLink}
                        className="text-zinc-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLink ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedLink ? 'Nusxalandi' : 'Havolani nusxalash'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  title="Qulflash"
                >
                  <Lock size={12} />
                  <span>Qulflash</span>
                </button>
              </div>

              {/* Action feedback toast */}
              <AnimatePresence>
                {successActionMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center"
                  >
                    {successActionMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live Real-time Revenue & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
                    <span>Jami Tushum</span>
                    <TrendingUp size={13} className="text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">
                    {stats.totalAmount.toLocaleString()} UZS
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
                    <span>Homiylar / Xaridorlar</span>
                    <Users size={13} className="text-sky-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">
                    {stats.donorCount} ta
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
                    <span>Hisob Raqam</span>
                    <CreditCard size={13} className="text-amber-400" />
                  </div>
                  <div className="text-xs font-mono font-bold text-white truncate">
                    8600 4904 1234 5678
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Nothing Corp (Uzcard)</div>
                </div>
              </div>

              {/* Founder Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Manual Payment Injection (Founder can add real/test payments) */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                    <PlusCircle size={14} />
                    <span>Yangi to‘lov kiritish (Jonli Tickerga)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Mijoz to‘lov qilganda bu yerga kiritishingiz mumkin, saytdagi barcha hisoblagichlar darhol yangilanadi.
                  </p>

                  <form onSubmit={handleAddManualPayment} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Xaridor ismi (masalan: Jasur B.)"
                      value={customDonorName}
                      onChange={(e) => setCustomDonorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="number"
                      placeholder="Summa (UZS), masalan: 50000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Qo‘shimcha izoh (ixtiyoriy)"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle size={13} />
                        <span>To‘lovni kiritish</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetCounters}
                        className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="0 UZS ga tushirish"
                      >
                        <RefreshCw size={13} />
                        <span>Nollash</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Live Ticker Broadcaster */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400">
                    <Radio size={14} />
                    <span>Jonli satrga xabar chiqarish (Ticker)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Sayt bo‘ylab aylanayotgan lenta satriga o‘zingizning maxsus murojaatingizni qo‘ying.
                  </p>

                  <form onSubmit={handleSaveBroadcast} className="space-y-2.5">
                    <textarea
                      rows={2}
                      placeholder="Xabarni yozing (masalan: Bugun Nothing.uz da maxsus aksiya!)..."
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400 resize-none"
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Radio size={13} />
                        <span>Efirga uzatish</span>
                      </button>

                      {broadcastText && (
                        <button
                          type="button"
                          onClick={() => {
                            setBroadcastText('');
                            localStorage.removeItem('nothing_broadcast_msg');
                            window.dispatchEvent(new CustomEvent('nothing-broadcast-updated', { detail: null }));
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 text-xs font-bold transition-colors cursor-pointer"
                        >
                          O‘chirish
                        </button>
                      )}
                    </div>
                  </form>

                  {/* 3. Operator Status & God Mode */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-bold">Operator Holati:</span>
                      <div className="flex gap-1.5 mt-1">
                        {['24/7 Onlayn', 'Dam olyapti', 'Oflayn'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleOperatorStatusChange(status)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                              operatorStatus === status
                                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleGodMode}
                      className={`px-3 py-2 rounded-xl border text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        godMode
                          ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Sparkles size={12} />
                      <span>{godMode ? '👑 God Mode: YOQIK' : 'God Mode'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Telegram direct contact card */}
              <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Send size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Rasmiy Telegramingiz: @uzouf</p>
                    <p className="text-[11px] text-zinc-400">Mijozlar buyurtmalari to‘g‘ridan-to‘g‘ri shu yerga keladi</p>
                  </div>
                </div>

                <a
                  href="https://t.me/uzouf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Send size={13} />
                  <span>Telegramni ochish</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
