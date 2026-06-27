"use client";

import React from 'react';

const ProductOverview = ({ product, quantity, setQuantity, handleAddToCart, formatCurrency }) => {
  if (!product) return null;

  return (
    <>
      {/* Brand Header */}
      <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2 block">
        {product.brand || 'Pixel Plays'}
      </span>
      
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
        {product.name}
      </h1>

      {/* Description Layout */}
      <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 p-5 box-border mb-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 flex-shrink-0">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
            Product Overview
          </h3>
        </div>

        <div className="max-h-48 md:max-h-56 overflow-y-auto pr-2 scrollbar-thin text-gray-700 text-xs md:text-sm leading-relaxed space-y-3">
          {product.description?.split('\n').filter((paragraph) => paragraph.trim() !== '').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {!product.description && (
            <p className="text-gray-400 italic text-xs">No description layout provided for this product.</p>
          )}
        </div>
      </div>

      {/* Key Features List */}
      {Array.isArray(product.features) && product.features.length > 0 && (
        <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 p-5 box-border mb-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              Key Features
            </h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-700 list-inside list-disc">
            {product.features.map((feature, idx) => (
              <li key={idx} className="leading-relaxed">{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications Grid */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 p-5 box-border mb-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              Technical Specifications
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500 font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="text-gray-900 font-bold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Information */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-3xl font-black text-gray-900">
          {formatCurrency(product.price)}
        </span>
        {product.old_price && (
          <>
            <span className="text-lg text-gray-400 line-through font-bold">
              {formatCurrency(product.old_price)}
            </span>
            {Number(product.old_price) > Number(product.price) && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% Off
              </span>
            )}
          </>
        )}
      </div>

      {/* Cart Control Interface Block */}
      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center font-bold text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              <svg xmlns="http://w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            <span className="w-14 text-center font-black text-xl text-gray-900">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center font-bold text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              <svg xmlns="http://w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Price</span>
            <span className="text-2xl font-black text-indigo-600">
              {formatCurrency(product.price * quantity)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
            product.stock > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              : 'bg-white text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
          }`}
        >
          {product.stock > 0 ? (
            <>
              <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Shopping Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </>
  );
};

export default ProductOverview;
