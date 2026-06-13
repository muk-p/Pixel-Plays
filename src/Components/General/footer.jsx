"use client";

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-(--surface) border-t border-(--border) pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid Structure */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column (Spans 2 columns on mobile for readable layout) */}
          <div className="col-span-2">
            <span className="text-xl font-black text-indigo-600 uppercase tracking-tight">
              Pixel<span className="text-foreground">Plays</span>
            </span>
            <p className="mt-4 text-sm text-(--muted) leading-relaxed max-w-sm">
              Your Ultimate Gateway to Gaming in Kenya. Providing premium consoles, authentic video games, and high-performance gaming gear to players nationwide.
            </p>
          </div>

          {/* Gaming Catalog Links */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Shop Gaming</h4>
            <ul className="space-y-2.5 text-sm text-(--muted)">
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">PlayStation</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Xbox Consoles</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Nintendo Switch</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">PC Components</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Gaming Accessories</li>
            </ul>
          </div>

          {/* Quick Support Links */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Help & Info</h4>
            <ul className="space-y-2.5 text-sm text-(--muted)">
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Delivery Areas</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Warranty Policy</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Order Tracking</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Repair Services</li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Verified Contact Details Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Hotlines</h4>
            <ul className="space-y-3 text-sm text-(--muted)">
              <li>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-indigo-500">Support</span>
                <a href="tel:+254794966733" className="hover:text-indigo-600 transition-colors font-medium">
                  +254 794 966 733
                </a>
              </li>
              <li>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-indigo-500">Sales Desk</span>
                <a href="tel:+254795040185" className="hover:text-indigo-600 transition-colors font-medium">
                  +254 795 040 185
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Trust Indicators & Legalities */}
        <div className="pt-8 border-t border-(--border) flex flex-col sm:flex-row justify-between items-center gap-6">
          
          {/* Copyright notice */}
          <div className="text-xs text-(--muted) text-center sm:text-left order-2 sm:order-1">
            <p>© {year} Pixel Plays Kenya. All rights reserved.</p>
            <div className="flex justify-center sm:justify-start gap-4 mt-2 font-medium">
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>

          {/* Localized Trust Badges (M-PESA checkout reassurance matches user base conversion habits) */}
          <div className="flex flex-col items-center sm:items-end gap-2 order-1 sm:order-2">
            <span className="text-[10px] uppercase font-bold text-(--muted) tracking-widest">Secure Payments Via</span>
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700/50">
              <span className="text-xs font-black text-emerald-600 tracking-tight">M-PESA</span>
            </div>
          </div>

        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
