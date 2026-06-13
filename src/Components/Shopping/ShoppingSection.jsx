"use client"; // Required for useState, useEffect, useRef, and search query parameters

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Replaces react-router-dom Link
import { useSearchParams } from 'next/navigation'; // Replaces react-router-dom useSearchParams
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import Image from 'next/image'; 
import localImageLoader from '@/config/ImageLoader'; // Custom loader to handle local backend image paths

const formatCategoryId = (categoryId) =>
  String(categoryId || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const ShoppingSection = ({ searchQuery = "" }) => {
  const searchParams = useSearchParams(); 
  const activeCategory = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const previousCategoryRef = useRef(activeCategory);
  const sectionRootRef = useRef(null); // Ref added to handle the search scroll target anchor

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.SHOPPING.PRODUCTS);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = (Array.isArray(products) ? products : []).filter(p => {
    const name = p.name || "";
    const query = searchQuery || "";
    return name.toLowerCase().includes(query.toLowerCase());
  });

  const groupedByCategory = filtered.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const sortedCategoryEntries = Object.entries(groupedByCategory).sort(([a], [b]) => {
    if (a === 'Console') return -1;
    if (b === 'Console') return 1;
    return a.localeCompare(b);
  });

  // EFFECT 1: Scroll to view when Search Query updates
  useEffect(() => {
    if (loading || !searchQuery.trim()) return;

    // Small delay ensures filtered cards are calculated and mounted in the DOM layout
    const timer = setTimeout(() => {
      if (sectionRootRef.current) {
        sectionRootRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' // Aligns top of container with top of window view
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery, loading]);

  // EFFECT 2: Scroll to view when URL Query Category selection updates
  useEffect(() => {
    if (loading) return;
    const hasCategoryChanged = previousCategoryRef.current !== activeCategory;
    previousCategoryRef.current = activeCategory;

    if (!hasCategoryChanged || !activeCategory) return;

    const targetId = `category-${formatCategoryId(activeCategory)}`;
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [activeCategory, loading]);

if (loading) {
  /* FIXED: Added a matching dark:bg-black background and an indigo-400 glow state to the loading layout */
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-3 transition-colors duration-300 dark:bg-black">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin dark:border-indigo-400 dark:border-t-transparent"></div>
      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">Updating Catalog</p>
    </div>
  );
}

return (
  <div 
    id="shopping-section-root" 
    ref={sectionRootRef} /* Attached Ref hook anchor here */
    /* FIXED: Using clean background variables so it syncs perfectly with your global black template */
    className="w-full max-w-full space-y-14 py-8 overflow-visible bg-slate-50/30 scroll-mt-16 transition-colors duration-300 dark:bg-background" 
  >
    {sortedCategoryEntries.map(([category, items]) => {
      const sectionId = `category-${formatCategoryId(category)}`;
      const isHighlighted = activeCategory && String(activeCategory).toLowerCase() === String(category).toLowerCase();

      return (
        <div key={category} id={sectionId} className="w-full space-y-2 px-4">
          {/* FIXED: Uses your exact Tailwind v4 --border value for perfectly thin, crisp separation borders */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-border">
            <h2 className={`text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
              isHighlighted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-foreground'
            }`}>
              {category}
            </h2>
            {/* FIXED: Replaced static text colors with your custom theme variables */}
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full dark:bg-surface-alt dark:text-muted">
              {items.length} items
            </span>
          </div>
          
          <div className="w-full flex overflow-x-auto gap-4 md:gap-5 pb-5 scrollbar-hide scroll-smooth touch-pan-x select-none snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
            {items.map((item) => (
              /* FIXED: Cards now leverage your custom CSS `--surface` (#0a0a0a) to float beautifully on pure black */
              <div key={item.id} className="group flex flex-col shrink-0 w-[calc(50%-8px)] md:w-52 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 overflow-hidden snap-start dark:bg-surface dark:border-border dark:hover:border-zinc-800 dark:shadow-none">
                
                <Link href={`/product/${item.id}`} className="block relative">
                  {/* FIXED: Inner image card background sets up a clean canvas using an ultra-dark tint */}
                  <div className="relative aspect-4/3 w-full bg-slate-50/50 flex items-center justify-center overflow-hidden dark:bg-black">
                    <Image 
                      loader={localImageLoader}
                        src={getImageUrl(item.image_url)} 
                        alt={item.name}
                        fill 
                        sizes="(max-w-768px) 50vw, 208px" 
                        priority={true} 
                        unoptimized
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-104"
                      />
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center z-10 dark:bg-black/60">
                        <span className="text-[9px] font-extrabold text-white tracking-widest uppercase bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/20 dark:bg-zinc-900/90">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 md:p-3.5 space-y-1">
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">{item.brand || 'Generic'}</p>
                    <h3 className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors dark:text-foreground dark:group-hover:text-indigo-400">
                      {item.name}
                    </h3>
                    <p className="text-xs md:text-sm font-black text-slate-900 pt-0.5 md:pt-1 dark:text-foreground">
                      KES {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </Link>

                <div className="p-3 md:p-3.5 pt-0 mt-auto">
                  <Link
                    href={`/product/${item.id}`}
                    className={`block w-full py-2 rounded-xl text-center text-[11px] md:text-xs font-bold tracking-wide transition-all active:scale-98 border ${
                      item.stock > 0
                        ? 'bg-slate-900 border-slate-900 text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-sm shadow-slate-200 dark:bg-white dark:border-white dark:text-black dark:hover:bg-zinc-200 dark:shadow-none'
                        : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-zinc-900/50 dark:border-border dark:text-zinc-600'
                    }`}
                  >
                    View in Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
    <style dangerouslySetInnerHTML={{__html: `
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}} />
  </div>
);
};

export default ShoppingSection;