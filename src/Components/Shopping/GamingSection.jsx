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
      <div className="text-center py-8">
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
          <div className="bg-(--surface) rounded-2xl p-3 md:p-4 border border-(--border) hover:border-indigo-500 transition-all shadow-sm group relative cursor-pointer">

            {/* Card Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] bg-(--surface-alt) px-1.5 py-0.5 rounded font-bold text-(--muted) uppercase">
                {product.region}
              </span>
              <span className="text-[9px] text-indigo-600 font-bold uppercase">
                {product.platform}
              </span>
            </div>

            {/* Product Info */}
            <h3 className="text-xs md:text-sm font-bold text-foreground leading-tight h-10 line-clamp-2">
              {product.name}
            </h3>

            {/* Stock indicator */}
            <div className="mb-2 flex items-center justify-between">
              {product.stock <= 5 && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                    product.stock === 0 
                      ? "bg-red-50 text-red-600" 
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left`}
                </span>
              )}
              <span className="ml-auto text-xs text-(--muted)">
                Tap for details
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-base md:text-lg font-black text-gray-900">
                KES {product.price.toLocaleString()}
              </span>

              {/* Dynamic Button Overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents link navigation click-throughs
                  handlePurchase(product);
                }}
                disabled={product.stock === 0}
                className={`transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-1
                  ${product.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : user
                      ? 'bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700'
                      : 'bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase border border-purple-100 hover:bg-purple-100'
                  }`}
              >
                {product.stock === 0 ? (
                  <span className="text-[10px]">Out of Stock</span>
                ) : user ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>

            {/* Hover Tooltip for Guests (Desktop Only) */}
            {!user && product.stock > 0 && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                <span className="bg-gray-800 text-white text-[8px] px-2 py-1 rounded shadow-lg">Login to Buy</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GamingSection;
