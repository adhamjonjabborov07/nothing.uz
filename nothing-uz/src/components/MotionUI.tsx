import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import { Sparkles, Move, Send, X } from 'lucide-react';

/* =========================================================================
   1. SCROLL PROGRESS BAR (with useScroll & useSpring)
   ========================================================================= */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = useTransform(scaleX, (value) => Math.round(value * 100));
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    return percentage.on('change', (latest) => {
      setDisplayPercent(latest);
    });
  }, [percentage]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <motion.div
        className="h-1 bg-gradient-to-r from-sky-500 via-white to-emerald-400 origin-left shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ scaleX }}
      />
      {/* Floating indicator */}
      <div className="absolute right-4 top-2 text-[10px] font-mono font-bold text-white/50 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hidden sm:block">
        <span>Nothing: {displayPercent}%</span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. INFINITE MOTION TICKER (<Ticker>)
   ========================================================================= */
export function Ticker({ items }: { items?: string[] }) {
  const defaultItems = [
    'MUTLAQO HECH NARSA',
    '0% FUNKSIYA',
    '100% KAFOLATLANGAN BO‘SHLIQ',
    'TELEGRAM @UZOUF',
    '10 TA EKSKLYUZIV TARIF',
    'ZERO GUARANTEES',
    'DOING ABSOLUTELY NOTHING',
    'SOTIB OLING VA HECH NARSA OLING',
  ];

  const list = items || defaultItems;
  const repeated = [...list, ...list, ...list];

  return (
    <div className="relative w-full overflow-hidden py-3 bg-zinc-950 border-y border-white/10 flex items-center select-none">
      <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 22,
        }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {repeated.map((text, i) => (
          <div key={i} className="flex items-center gap-8 text-xs font-black tracking-widest text-zinc-300 uppercase">
            <span>{text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-sm shadow-emerald-400" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* =========================================================================
   3. SCRAMBLE TEXT / TYPEWRITER EFFECT
   ========================================================================= */
export function ScrambleText({ phrases }: { phrases?: string[] }) {
  const defaultPhrases = [
    'Biz hech narsa bermaymiz.',
    'Siz hech narsa olmaysiz.',
    '100% kafolatlangan sof bo‘shliq.',
    'Telegram @uzouf orqali to‘lov qiling.',
    '0 ta funksiya, 100% rohat.',
  ];

  const list = phrases || defaultPhrases;
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = list[index % list.length];
    const speed = isDeleting ? 30 : 65;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => prev + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, list]);

  return (
    <span className="inline-flex items-center font-mono font-bold text-sky-400 min-h-[1.5em]">
      <span>{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-1 inline-block w-2 h-4 sm:h-5 bg-white"
      />
    </span>
  );
}

/* =========================================================================
   4. 3D TILT CARD (Interactive perspective tilt with useMotionValue)
   ========================================================================= */
export function Tilt3DCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`transition-shadow ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
}

/* =========================================================================
   5. DRAGGABLE NOTHING 3D FLOATING WIDGET
   ========================================================================= */
export function DraggableNothingWidget({
  onOpenPayment,
}: {
  onOpenPayment?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [clicks, setClicks] = useState(0);

  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: -300, right: 300, top: -400, bottom: 200 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-zinc-950/90 border border-white/20 backdrop-blur-2xl shadow-2xl text-white max-w-[280px] cursor-grab select-none"
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Move size={13} className="text-sky-400" />
          <span>Ko‘chma Nothing 3D</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/40 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      <div className="text-center py-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-dashed border-sky-400/60 flex items-center justify-center mx-auto mb-2 text-white/80"
        >
          <Sparkles size={18} />
        </motion.div>
        <p className="text-[11px] text-zinc-300 leading-tight mb-2">
          Bu interaktiv Nothing obyekti. Uni xohlagan joyingizga surib ko‘ring.
        </p>
        <button
          onClick={() => setClicks((c) => c + 1)}
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-emerald-400 transition-colors cursor-pointer mb-2"
        >
          Bosildi: {clicks} marta (0 natija)
        </button>
      </div>

      <button
        onClick={onOpenPayment}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
      >
        <Send size={11} />
        <span>To‘lov qilish (@uzouf)</span>
      </button>
    </motion.div>
  );
}

/* =========================================================================
   6. CUSTOM MOTION CURSOR (Reacts smoothly to mouse movements)
   ========================================================================= */
export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer (desktop with mouse)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('input'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 2.2 : 1,
          opacity: isHovered ? 0.8 : 0.45,
        }}
        transition={{ duration: 0.15 }}
        className="w-6 h-6 rounded-full border border-white bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
    </motion.div>
  );
}
