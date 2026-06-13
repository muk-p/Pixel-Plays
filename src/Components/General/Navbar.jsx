"use client"; 

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; 
import { usePathname, useRouter } from 'next/navigation'; 
import CartSection from './CartSection';
import BuyerOrdersAside from './BuyerOrdersAside';
import { useAuth } from '../../Context/AuthContext';
import { API_BASE_URL } from '../../config/api';

const Logo = '/Logo1.png';

const Navbar = ({ search, setSearch, isGaming, setAuthMode }) => {
  const pathname = usePathname(); 
  const router = useRouter(); 
  const { user, logout } = useAuth();
  const [isBuyerDrawerOpen, setIsBuyerDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [buyerSearch, setBuyerSearch] = useState('');
  const [buyerResult, setBuyerResult] = useState(null);
  const [buyerFeedback, setBuyerFeedback] = useState('');
  const mobileSearchInputRef = useRef(null);

  const isProductPage = pathname.includes('/product') || pathname.includes('/gaming-code');
  const isCheckOutPage = pathname === '/checkout';
  const isManagerPage = pathname.includes('/manager');
  const showBackButton = isProductPage || isCheckOutPage || isManagerPage;

  const showSearchBar = !isProductPage && !isCheckOutPage;

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleLogout = () => {
    logout();
    router.push('/'); 
  };

  const handleBuyerSearch = async (e) => {
    e.preventDefault();
    const term = buyerSearch.trim();

    if (!term) {
      setBuyerFeedback('Enter the checkout ID shown after checkout to look up the status.');
      setBuyerResult(null);
      return;
    }

    setBuyerFeedback('Looking up order by checkout ID...');
    setBuyerResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/shopping/order/${encodeURIComponent(term)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to find that order.');
      }

      const order = data.order || {};
      const firstItem = data.items?.[0];
      const itemLabel = firstItem?.item_name
        ? `${firstItem.item_name}${data.items.length > 1 ? ` +${data.items.length - 1} more` : ''}`
        : 'Order details loaded from the orders table.';

      setBuyerResult({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        itemName: itemLabel,
        totalAmount: order.total_amount,
        customerName: order.customer_name,
        paymentMethod: order.payment_method,
        address: order.address,
      });
      setBuyerFeedback(`Order found: ${order.order_number || order.id}`);
    } catch (error) {
      console.error('Buyer order lookup failed:', error);
      setBuyerResult(null);
      setBuyerFeedback(error.message || 'No matching order was found.');
    }
  };

  return (
    <nav className="w-full bg-(--surface) border-b border-(--border) sticky top-0 z-40">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4 md:gap-4 md:py-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {showBackButton ? (
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800 transition-all group p-1 z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs md:text-sm font-black uppercase tracking-tight">Back</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsBuyerDrawerOpen(true)}
                className="rounded-lg border border-(--border) bg-(--surface-alt) p-2 text-foreground transition-all hover:bg-(--surface) shrink-0"
                aria-label="Open buyer orders panel"
              >
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {showSearchBar && (
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--surface-alt) text-foreground transition hover:bg-(--surface) md:hidden shrink-0"
                  aria-label="Search products"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:flex-1 md:flex md:justify-center">
            <span className="text-sm md:text-base font-black text-indigo-600 uppercase tracking-tighter truncate">
              Pixel<span className="text-foreground">Plays</span>
            </span>
        </div>

        {showSearchBar && (
          <div className="relative hidden flex-1 max-w-xs md:max-w-96 mx-1 md:mx-4 md:block">
            <input
              type="text"
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isManagerPage ? 'Search...' : `Search ${isGaming ? 'codes...' : 'consoles...'}`}
              className="w-full bg-(--surface-alt) border border-(--border) dark:border-(--border-dark) rounded-xl md:rounded-2xl py-1.5 md:py-2.5 pl-9 md:pl-11 pr-3 text-xs md:text-sm text-foreground placeholder:text-(--muted) focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <svg className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-2.5 md:left-3.5 md:top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        {/* Right Section: Mobile Utility Links */}
        <div className="flex items-center gap-2 shrink-0 md:hidden">
          {!isCheckOutPage && <CartSection />}
          <button 
            onClick={() => {
              if (setAuthMode) setAuthMode('login');
              
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-login-modal'));
              }
            }}
            className="group flex items-center gap-3 bg-(--surface-alt) hover:bg-(--surface) p-1.5 pr-4 rounded-2xl transition-all border border-(--border)"
          >
            {/* 🎯 FIXED: Replaced misleading hamburger icon with a clear Account User profile icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Right Section: Desktop Utility Links */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {user && user.role === 'manager' && !isManagerPage && (
            <Link 
              href="/manager/products" 
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800"
            >
              Dashboard
            </Link>
          )}

          <div className="flex items-center gap-4">
            {!isCheckOutPage && !isManagerPage && <CartSection />}
            
            <button 
              onClick={() => user ? handleLogout() : setAuthMode('login')}
              className="group flex items-center gap-3 bg-(--surface-alt) hover:bg-(--surface) p-1.5 pr-4 rounded-2xl transition-all border border-(--border)"
            >
              <div className="bg-(--surface) p-2 rounded-xl shadow-sm text-foreground">
                {/* Clean, descriptive icon matrix matching desktop specs */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-(--muted) uppercase leading-none">
                  {user ? 'Account' : 'Welcome'}
                </p>
                <p className="text-xs font-bold text-foreground whitespace-nowrap">
                  {user ? `${user.name} (Logout)` : 'Sign In'}
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {showSearchBar && (
        <div className={`px-3 pb-2 md:hidden ${isMobileSearchOpen ? 'block' : 'hidden'}`}>
          <div className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isManagerPage ? 'Search...' : `Search ${isGaming ? 'codes...' : 'consoles...'}`}
              className="w-full rounded-2xl border border-(--border) bg-(--surface-alt) py-2.5 pl-10 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-(--muted)"
              aria-label="Close search"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <BuyerOrdersAside
        isOpen={isBuyerDrawerOpen}
        onClose={() => setIsBuyerDrawerOpen(false)}
        buyerSearch={buyerSearch}
        setBuyerSearch={setBuyerSearch}
        buyerResult={buyerResult}
        buyerFeedback={buyerFeedback}
        onSearch={handleBuyerSearch}
      />
    </nav>
  );
};

export default Navbar;
