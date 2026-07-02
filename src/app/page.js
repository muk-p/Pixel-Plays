"use client";

import HeroSection from '@/Components/General/HeroSection';
import SectionToggle from '@/Components/General/SectionToggle';
import CategorySection from '@/Components/General/CategorySection';
import ContactStrip from '@/Components/General/Contact';
import GamingSection from '@/Components/Shopping/GamingSection';
import ShoppingSection from '@/Components/Shopping/ShoppingSection';
import { useShopState } from './ClientAppShell';

export default function HomePage() {
  // Pull existing context data globally instead of instantiating isolated static copies
  const { isGaming, setIsGaming, search, setAuthMode } = useShopState();

  return (
    <>
      <main className="w-full mx-auto">
        <ContactStrip />
        <CategorySection />
        <HeroSection />
        
      <div className="max-w-7xl mx-auto px-1 py-2">
        <SectionToggle isGaming={isGaming} setIsGaming={setIsGaming} />
        <header className="flex flex-col px-2 mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {isGaming ? (
              <>Digital Vault: <span className="text-indigo-600">Game Codes Kenya</span></>
            ) : (
              <>Console Store: <span className="text-indigo-600">Your One-Stop Kenyan Store</span></>
            )}
          </h1>
          <div className="h-1 w-20 bg-indigo-600 mt-2 rounded-full" />
          <p className="mt-4 text-gray-600 max-w-2xl">
            {isGaming 
              ? "Instant delivery on PSN, Xbox, and PC digital codes. Trusted in Nairobi." 
              : "Shop the latest PlayStation, Xbox, and Nintendo consoles with door-to-door delivery."}
          </p>
        </header>
      </div>

      <section className="w-full py-4">
        {isGaming ? (
          <GamingSection searchQuery={search} setAuthMode={setAuthMode} />
        ) : (
          <ShoppingSection searchQuery={search} />
        )}
      </section>
      
      {/* DUPLICATE FOOTER REMOVED - Managed systematically via root layout */}
    </main>
    </>
  );
}
