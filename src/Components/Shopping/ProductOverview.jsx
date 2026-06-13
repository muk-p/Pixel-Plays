"use client"; // Required for handling button click mutations and parent state callbacks

import React from 'react';

const ProductOverview = ({ product, quantity, setQuantity, handleAddToCart, formatCurrency }) => {
  return (
    <>
      <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
        {product.brand}
      </span>
      <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight mb-4">
        {product.name}
      </h1>

      <div className="w-full bg-(--surface-alt) rounded-2xl border border-(--border) p-5 box-border mb-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[rgba(148,163,184,0.24)] flex-shrink-0">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          <h3 className="font-bold text-foreground uppercase text-xs tracking-wider">
            Product Overview
          </h3>
        </div>

        <div className="max-h-48 md:max-h-56 overflow-y-auto pr-2 scrollbar-thin text-foreground text-xs md:text-sm leading-relaxed space-y-3">
          {product.description?.split('\n').filter((paragraph) => paragraph.trim() !== '').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {!product.description && (
            <p className="text-(--muted) italic text-xs">No description layout provided for this product.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-3xl font-black text-gray-900">
          {formatCurrency(product.price)}
        </span>
        {product.old_price && (
          <>
            <span className="text-lg text-gray-400 line-through font-bold">
              {formatCurrency(product.old_price)}
            </span>
            {product.old_price > product.price && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% Off
              </span>
            )}
          </>
        )}
      </div>

      <div className="bg-(--surface-alt) rounded-3xl p-6 border border-(--border) mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-(--surface) border border-(--border) rounded-2xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center font-bold text-foreground hover:bg-(--surface-alt) rounded-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            <span className="w-14 text-center font-black text-xl text-foreground">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center font-bold text-foreground hover:bg-(--surface-alt) rounded-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-(--muted) font-black uppercase tracking-widest">Total Price</span>
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
              : 'bg-(--surface) text-(--muted) cursor-not-allowed shadow-none'
          }`}
        >
          {product.stock > 0 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
