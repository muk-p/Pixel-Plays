"use client"; // Retain state logic for your search queries and toggles

import React, { useState } from 'react';
import HeroSection from "@/Components/General/HeroSection"; 
import CategorySection from "@/Components/General/CategorySection";
import SectionToggle from "@/Components/General/SectionToggle";
import GamingSection from "@/Components/shopping/GamingSection";
import ShoppingSection from "@/Components/Shopping/ShoppingSection"; 

// 🎯 FIXED: Accept properties from ShopLayout's cloneElement pipeline just like ProductPage does!
export default function HomePage({ isGaming, setIsGaming, search, setAuthMode }) {
  // ❌ REMOVED: Isolated local state definitions that were intercepting the Navbar's controls.
  // The layout wrapper's state now drives this component cleanly.

  return (
    <>
      <CategorySection />
      <HeroSection />
      
      <main className="w-full mx-auto px-1 py-2 ">
        <div className="max-w-7xl mx-auto">
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

        <section className="w-full  dark:bg-gray-950">
          {isGaming ? (
            <GamingSection searchQuery={search} setAuthMode={setAuthMode} />
          ) : (
            <ShoppingSection searchQuery={search} />
          )}
        </section>
      </main>
    </>
  );
}
