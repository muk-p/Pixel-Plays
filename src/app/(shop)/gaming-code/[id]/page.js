"use client"; // Required for hooks (useState, useEffect, use)

import React, { useState, useEffect, use } from 'react'; // Added use hook to unwrap params
import Link from 'next/link'; // Replaces react-router-dom Link
import axios from 'axios';
import { useCart } from '@/Context/CartContext';
import { API_ENDPOINTS } from '@/config/api';

const GamingCodePage = ({ params }) => {
  // Unwraps dynamic URL properties inside Next.js App Router layout trees
  const { id } = use(params);
  const { addToCart } = useCart();

  const [gamingCode, setGamingCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGamingCode = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_ENDPOINTS.GAMING.GET_CODE(id));
        setGamingCode(response.data);
      } catch (err) {
        console.error('Error fetching gaming code:', err);
        setError('Failed to load gaming code details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchGamingCode();
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-black text-gray-300">Loading Gaming Code...</div>
      </div>
    );
  }

  if (error || !gamingCode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error || 'Gaming Code Not Found'}</h2>
        <Link href="/" className="text-indigo-600 font-bold underline">Back to Store</Link>
      </div>
    );
  }

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amt);

  const handleAddToCart = () => {
    addToCart(gamingCode);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-indigo-600">Store</Link> /
        <Link href="/" className="ml-2 hover:text-indigo-600">Gaming Codes</Link> /
        <span className="ml-2 text-gray-900 font-semibold">{gamingCode.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">

        {/* Left: Gaming Code Visual */}
        <div className="relative w-full h-100px lg:h-full min-h-75 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-50 to-purple-50 border border-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{gamingCode.name}</h3>
            <div className="flex justify-center gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold uppercase">
                {gamingCode.region}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold uppercase">
                {gamingCode.platform}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Gaming Code Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
              Gaming Code
            </span>
            {gamingCode.stock === 0 ? (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Out of Stock
              </span>
            ) : gamingCode.stock <= 5 ? (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Only {gamingCode.stock} Left
              </span>
            ) : (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                In Stock
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            {gamingCode.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black text-gray-900">
              {formatCurrency(gamingCode.price)}
            </span>
          </div>

          {/* Description */}
          {gamingCode.description && (
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {gamingCode.description}
              </p>
            </div>
          )}

          {/* Key Details */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Code Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Region</span>
                <p className="font-bold text-gray-900">{gamingCode.region}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Platform</span>
                <p className="font-bold text-gray-900">{gamingCode.platform}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Available Stock</span>
                <p className="font-bold text-gray-900">{gamingCode.stock}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Delivery</span>
                <p className="font-bold text-green-600">Instant Email</p>
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Ready to Purchase?</h3>
              <p className="text-sm text-gray-600">
                This gaming code will be delivered instantly to your email after purchase.
                Make sure your account is verified to receive the code.
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={gamingCode.stock === 0}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3
                ${gamingCode.stock > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              {gamingCode.stock > 0 ? (
                <>
                  <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Shopping Cart
                </>
              ) : "Out of Stock"}
            </button>
          </div>

          {/* Back to Store */}
          <Link
            href="/"
            className="text-indigo-600 font-bold underline hover:no-underline text-center"
          >
            ← Back to Store
          </Link>
        </div>
      </main>
    </div>
  );
};

export default GamingCodePage;
