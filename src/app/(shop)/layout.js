"use client";

import React, { useState, createContext, useContext } from "react"; 
import { usePathname } from "next/navigation";

// 1. Core State Communication Bus
const ShopStateContext = createContext(null);

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const isCheckoutPage = pathname === "/checkout";

  const [isGaming, setIsGaming] = useState(false);
  const [search, setSearch] = useState("");
  const [authMode, setAuthMode] = useState(null); // Managed globally here

  // Packed with explicit object variable references
  const sharedState = { isGaming, setIsGaming, search, setSearch, authMode, setAuthMode };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      
      <div className="grow">
        <ShopStateContext.Provider value={sharedState}>
          {children}
        </ShopStateContext.Provider>
      </div>

    </div>
  );
}

export function useShopState() {
  const context = useContext(ShopStateContext);
  if (!context) {
    throw new Error("useShopState must be used within a ShopLayout");
  }
  return context;
}
