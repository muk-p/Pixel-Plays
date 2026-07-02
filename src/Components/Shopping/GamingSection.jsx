"use client"; // Required for state management, hooks, and active client events

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Replaces react-router-dom Link
import axios from 'axios';
import { useCart } from '@/Context/CartContext';
import { useAuth } from '@/Context/AuthContext';
import { API_ENDPOINTS } from '@/config/api';

const GamingSection = ({ searchQuery, setAuthMode }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [gamingCodes, setGamingCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gaming codes from API
  useEffect(() => {
    const fetchGamingCodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_ENDPOINTS.GAMING.CODES);
        setGamingCodes(response.data);
      } catch (err) {
        console.error('Error fetching gaming codes:', err);
        setError('Failed to load gaming codes');
        // Fallback to empty array
        setGamingCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGamingCodes();
  }, []);

  const handlePurchase = (product) => {
    if (!user) {
      setAuthMode('login');
      return;
    }
    addToCart(product);
  };

  const filtered = gamingCodes.filter(code =>
    code.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-(--surface-alt) rounded-2xl p-3 md:p-4 animate-pulse">
            <div className="h-4 bg-(--surface)/80 rounded mb-2"></div>
            <div className="h-3 bg-(--surface)/80 rounded mb-1"></div>
            <div className="h-6 bg-(--surface)/80 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-in fade-in duration-500">
      {filtered.map(product => (
        <Link
          key={product.slug || product.id}
          href={`/gaming-code/${product.slug || product.id}`} // Updated routing syntax
          className="block"
        >
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-[28px] p-4 md:p-5 border border-slate-200/80 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] hover:shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)] transition-all duration-300 group relative overflow-hidden cursor-pointer">

            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-indigo-100/70 to-transparent pointer-events-none" />

            {/* Card Header */}
            <div className="flex justify-between items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 bg-white/80 border border-slate-200 rounded-full px-2 py-1 shadow-sm">
                {product.region}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-indigo-700">
                {product.platform}
              </span>
            </div>

            {/* Product Info */}
            <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight h-14 line-clamp-2 mb-4">
              {product.name}
            </h3>

            {/* Stock indicator */}
            <div className="mb-4 flex items-center justify-between gap-3">
              {product.stock <= 5 ? (
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${
                    product.stock === 0
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                  {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Ready to play
                </span>
              )}
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                Tap for details
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-[0.24em] mb-1">Starting at</p>
                <span className="text-lg md:text-xl font-black text-slate-900">
                  KES {product.price.toLocaleString()}
                </span>
              </div>

              {/* Dynamic Button Overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents link navigation click-throughs
                  handlePurchase(product);
                }}
                disabled={product.stock === 0}
                className={`transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 whitespace-nowrap ${
                  product.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                    : user
                      ? 'bg-indigo-600 text-white px-4 py-3 rounded-2xl hover:bg-indigo-700 border border-indigo-600'
                      : 'bg-white text-purple-700 px-4 py-3 rounded-2xl font-bold text-[10px] uppercase border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {product.stock === 0 ? (
                  <span className="text-[10px]">Out of Stock</span>
                ) : user ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>

            {/* Hover Tooltip for Guests (Desktop Only) */}
            {!user && product.stock > 0 && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                <span className="bg-slate-900 text-white text-[9px] px-2 py-1 rounded-full shadow-lg">Login to Buy</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GamingSection;
