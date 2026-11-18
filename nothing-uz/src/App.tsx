import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './theme/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import PaymentBanner from './components/PaymentBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Subscriptions from './components/Subscriptions';
import WhatIsNothing from './components/WhatIsNothing';
import Donations from './components/Donations';
import Interactive from './components/Interactive';
import Disclaimer from './components/Disclaimer';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import {
  ScrollProgressBar,
  Ticker,
  DraggableNothingWidget,
  CustomCursor,
} from './components/MotionUI';

export default function App() {
  const [globalPaymentModalOpen, setGlobalPaymentModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState({
    name: 'PREMIUM NOTHING',
    price: '22,222 UZS',
    numPrice: 22222,
  });

  const handleOpenPayment = (planName = 'PREMIUM NOTHING', price = '22,222 UZS') => {
    setModalPlan({
      name: planName,
      price: price,
      numPrice: parseInt(price.replace(/\D/g, ''), 10) || 22222,
    });
    setGlobalPaymentModalOpen(true);
  };

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-[var(--color-bg-primary,#0D111A)] text-zinc-100 selection:bg-white/20 selection:text-white overflow-x-hidden">
          {/* Soothing eye-pleasing ambient background gradient orbs (no pitch-black voids!) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-sky-500/[0.08] via-indigo-500/[0.05] to-transparent blur-[140px]" />
            <div className="absolute top-[35%] -left-[10%] w-[800px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/[0.06] via-sky-500/[0.03] to-transparent blur-[160px]" />
            <div className="absolute top-[65%] -right-[10%] w-[800px] h-[600px] rounded-full bg-gradient-to-tl from-emerald-500/[0.05] via-indigo-500/[0.03] to-transparent blur-[160px]" />
          </div>

          {/* Motion UI 1: Top Scroll Progress Bar */}
          <ScrollProgressBar />

          {/* Motion UI 2: Custom Mouse Cursor for Desktop */}
          <CustomCursor />

          {/* Theme Quick Floating Switcher (3 user behaviors) */}
          <ThemeSelector variant="floating" />

          {/* 1. Prominent Top Notification / Payment Banner */}
          <PaymentBanner onOpenPayment={handleOpenPayment} />

        {/* 2. Sleek Sticky Navbar with Payment & Telegram buttons */}
        <Navbar onOpenPayment={handleOpenPayment} />

        <main>
          {/* 3. Hero with 3D animation, ScrambleText & Telegram @uzouf payment triggers */}
          <Hero onOpenPayment={handleOpenPayment} />

          {/* Motion UI 3: Continuous Ticker */}
          <Ticker />

          {/* 4. Subscriptions / 10 Tariff Plans with 3D Tilt & LayoutGroup */}
          <Subscriptions />

          {/* Motion UI 4: Feature Ticker */}
          <Ticker
            items={[
              '0% DASTURIY TA’MINOT',
              '100% HECH NARSA KAFOLATI',
              'TELEGRAM OPERATOR: @UZOUF',
              'REVOLYUTSION BO‘SHLIQ',
              'ENG QIMMAT HECH NARSA',
              '24/7 HECH NARSA QILMAYMIZ',
            ]}
          />

          {/* 5. What Is Nothing satirical philosophy */}
          <WhatIsNothing />

          {/* 6. Live Donations & Altruistic Payment tracker */}
          <Donations />

          {/* 7. Interactive experiences */}
          <Interactive />

          {/* 8. Disclaimer */}
          <Disclaimer />

          {/* 9. FAQ */}
          <FAQ />
        </main>

        {/* 10. Footer with Telegram @uzouf */}
        <Footer />

        {/* Motion UI 5: Floating Draggable 3D Nothing Widget */}
        <DraggableNothingWidget onOpenPayment={() => handleOpenPayment('PREMIUM NOTHING', '22,222 UZS')} />

        {/* Global Payment Modal (invoked from Banner, Navbar, Hero, Widget, etc.) */}
        <PaymentModal
          isOpen={globalPaymentModalOpen}
          onClose={() => setGlobalPaymentModalOpen(false)}
          planName={modalPlan.name}
          priceStr={modalPlan.price}
          numPrice={modalPlan.numPrice}
        />
      </div>
    </MotionConfig>
  </ThemeProvider>
  );
}
