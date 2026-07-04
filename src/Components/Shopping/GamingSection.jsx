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
          <div key={i} className="bg-surface-alt rounded-2xl p-3 md:p-4 animate-pulse">
            <div className="h-4 bg-surface/80 rounded mb-2"></div>
            <div className="h-3 bg-surface/80 rounded mb-1"></div>
            <div className="h-6 bg-surface/80 rounded"></div>
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
          <div className="group relative overflow-hidden rounded-[28px] border border-border bg-surface p-4 shadow-(--shadow) transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)] md:p-5 cursor-pointer">

            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-accent/15 to-transparent" />

            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="rounded-full border border-border bg-surface-alt/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-muted shadow-sm">
                {product.region}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-accent">
                {product.platform}
              </span>
            </div>

            {/* Product Info */}
            <h3 className="mb-4 h-14 text-sm font-bold leading-tight text-foreground line-clamp-2 md:text-base">
              {product.name}
            </h3>

            {/* Stock indicator */}
            <div className="mb-4 flex items-center justify-between gap-3">
              {product.stock <= 5 ? (
                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase ${
                    product.stock === 0
                      ? 'border-danger/20 bg-danger/10 text-danger'
                      : 'border-accent/20 bg-accent/10 text-accent'
                  }`}>
                  {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
                  Ready to play
                </span>
              )}
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Tap for details
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.24em] text-muted">Starting at</p>
                <span className="text-lg font-black text-foreground md:text-xl">
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
                className={`flex items-center justify-center gap-2 whitespace-nowrap shadow-lg transition-all duration-200 active:scale-[0.98] ${
                  product.stock === 0
                    ? 'cursor-not-allowed border border-border bg-surface-alt px-4 py-3 text-muted rounded-2xl'
                    : user
                      ? 'rounded-2xl border border-accent bg-accent px-4 py-3 text-white hover:bg-accent/90'
                      : 'rounded-2xl border border-border bg-surface-alt px-4 py-3 font-bold text-[10px] uppercase text-accent hover:bg-surface'
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
                <span className="rounded-full bg-foreground px-2 py-1 text-[9px] text-surface shadow-lg">Login to Buy</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GamingSection;
