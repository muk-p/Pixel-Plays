"use client";

import React, { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/Context/AuthContext';
import { CartProvider } from '@/Context/CartContext';
import Navbar from '@/Components/General/Navbar';
import Footer from '@/Components/General/footer';
import LoginTab from '@/Components/Auth/Login';
import SignupTab from '@/Components/Auth/Signup';

const ShopStateContext = createContext(null);

export default function ClientAppShell({ children }) {
  const pathname = usePathname();
  const isCheckoutPage = pathname === '/checkout';

  const [isGaming, setIsGaming] = useState(false);
  const [search, setSearch] = useState('');
  const [authMode, setAuthMode] = useState(null);

  const sharedState = { isGaming, setIsGaming, search, setSearch, authMode, setAuthMode };

  return (
    <AuthProvider>
      <CartProvider>
        <ShopStateContext.Provider value={sharedState}>
          <Navbar
            search={search}
            setSearch={setSearch}
            isGaming={isGaming}
            setAuthMode={setAuthMode}
          />

          <div className="grow">{children}</div>

          {authMode === 'login' && <LoginTab setAuthMode={setAuthMode} />}
          {authMode === 'signup' && <SignupTab setAuthMode={setAuthMode} />}

          {!isCheckoutPage && <Footer />}
        </ShopStateContext.Provider>
      </CartProvider>
    </AuthProvider>
  );
}

export function useShopState() {
  const context = useContext(ShopStateContext);
  if (!context) {
    throw new Error('useShopState must be used within RootLayout');
  }
  return context;
}
