import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsNothing from './components/WhatIsNothing';
import Subscriptions from './components/Subscriptions';
import Donations from './components/Donations';
import Interactive from './components/Interactive';
import Disclaimer from './components/Disclaimer';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <WhatIsNothing />
        <Subscriptions />
        <Donations />
        <Interactive />
        <Disclaimer />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
