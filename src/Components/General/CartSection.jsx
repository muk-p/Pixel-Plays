"use client"; // 🚀 CRUCIAL: Enables hooks, state modifications, and interaction handlers in Next.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🧭 Next.js native navigation router tool
import { useCart } from '../../Context/CartContext'; // Updated to lowercase directory path

const CartSection = () => {
  const router = useRouter(); // Replaces useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  
  const { items: cartItems, totalPrice, removeItem, clearCart, formatCurrency, updateQuantity } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout'); // Next.js use router.push instead of navigate()
  };

  return (
    <div className="relative inline-block text-left">
      {/* Cart Trigger */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-foreground hover:text-purple-600 transition-all duration-200 focus:outline-none rounded-full"
      >
        <svg xmlns="http://w3.org" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-purple-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-(--surface) shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-(--border)">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-purple-50/50">
              <h3 className="text-lg font-bold text-foreground">Your Cart</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-(--surface-alt) rounded-full transition-colors">
                <svg xmlns="http://w3.org" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                   <p className="text-(--muted) text-sm italic">Your cart is currently empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="group flex justify-between items-center p-4 border-b border-(--border) hover:bg-(--surface)">
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-foreground">{item.name}</span>
                      <span className="text-sm text-purple-600 font-bold">{formatCurrency(item.price)}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mr-4 bg-(--surface-alt) rounded-lg p-1">
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-(--surface) rounded-md shadow-sm hover:text-purple-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-(--surface) rounded-md shadow-sm hover:text-purple-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-(--muted) hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <svg xmlns="http://w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-(--surface-alt) border-t border-(--border)">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-(--muted) uppercase tracking-widest font-bold">Total</p>
                    <p className="text-2xl font-black text-foreground">{formatCurrency(totalPrice)}</p>                
                    </div>
                  <button type="button" onClick={clearCart} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase">Clear All</button>
                </div>
                <button 
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl"
                  onClick={handleCheckout}
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Checkout Button */}
      {cartItems.length > 0 && !isOpen && (
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-150 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-10 rounded-full shadow-[0_20px_50px_rgba(22,163,74,0.4)] transition-all hover:-translate-y-1 active:scale-95 animate-in slide-in-from-right-20 duration-500"
        >
          <span className="uppercase tracking-wider text-sm">Checkout</span>
          <div className="h-6 w-px bg-green-400/50" />
          <span className="text-lg">{formatCurrency(totalPrice)}</span>
          <svg xmlns="http://w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CartSection;
