"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import Image from 'next/image'; 
import { rateLimitedRequest } from '@/utils/rateLimiter';
import localImageLoader from '@/config/ImageLoader'; 

const formatCategoryId = (categoryId) =>
  String(categoryId || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

// Internal component to safely isolate and read client URL search parameters
const ShoppingCatalog = ({ searchQuery }) => {
  const searchParams = useSearchParams(); 
  const activeCategory = searchParams.get('category');
  
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const previousCategoryRef = useRef(activeCategory);
  const sectionRootRef = useRef(null); 

  // INITIAL LOAD ENGINE: Pulls grouped categories from the backend database
  useEffect(() => {
    const fetchGroupedCatalog = async () => {
      setLoading(true);
      try {
        const res = await rateLimitedRequest(() => 
          axios.get(`${API_ENDPOINTS.SHOPPING.PRODUCTS}`)
        );
        setCatalog(res.data.catalog || []);
      } catch (err) {
        console.error("Error loading optimized catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupedCatalog();
  }, []);

  // SEARCH FILTER & DICTIONARY WEIGHT SORT ENGINE
  const sortedCategoryEntries = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();
    
    // Explicit priority dictionary matching your desired visual order
    const categorySortOrder = {
      'Console': 1,
      'Accessories': 2,
      'Phones': 3,
      'TVs': 4,
      'Digital': 5,
      'Pre-owned': 6,
      'VR Gear': 7,
      'Merch': 8
    };

    let processedCatalog = [...catalog];

    // Filter cards dynamically if a global search string is passed down
    if (query) {
      processedCatalog = catalog
        .map(([category, items]) => {
          const filteredItems = items.filter(item => 
            (item.name || "").toLowerCase().includes(query) ||
            (item.brand || "").toLowerCase().includes(query)
          );
          return [category, filteredItems];
        })
        .filter(([_, items]) => items.length > 0);
    }

    // Sort entries based on dictionary weight
    return processedCatalog.sort(([a], [b]) => {
      const orderA = categorySortOrder[a] || 99;
      const orderB = categorySortOrder[b] || 99;
      return orderA - orderB;
    });
  }, [catalog, searchQuery]);

  // Snap window focus down to grid layout root upon search query updates
  useEffect(() => {
    if (loading || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      if (sectionRootRef.current) {
        sectionRootRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [searchQuery, loading]);

  // Smooth scroll target alignment when a filter parameter mounts
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

  // ANIMATED BRAND LOADING SCREEN
  if (loading) {
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
      ref={sectionRootRef}
      className="w-full max-w-full space-y-14 py-8 overflow-visible bg-slate-50/30 scroll-mt-16 transition-colors duration-300 dark:bg-background" 
    >
      {sortedCategoryEntries.map(([category, items], categoryIndex) => {
        const sectionId = `category-${formatCategoryId(category)}`;
        const isHighlighted = activeCategory && String(activeCategory).toLowerCase() === String(category).toLowerCase();

        return (
          <div 
            key={category} 
            id={sectionId} 
            className="w-full space-y-2 px-4 will-change-[content-visibility]"
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 340px' 
            }}
          >
            {/* CATEGORY HEADER INTERFACE BAR */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-(--border)">
              <h2 className={`text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                isHighlighted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-foreground'
              }`}>
                {category}
              </h2>
              
              {/* CLICK INTERCEPTOR WRAPPER: Selecting this updates parameters and isolates layout smoothly */}
              <Link 
                href={`/shop?category=${category}`} 
                scroll={false} 
                className="inline-block transition-transform hover:scale-105 active:scale-95"
              >
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full dark:bg-(--surface-alt) dark:text-(--muted) hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  {items.length} items
                </span>
              </Link>
            </div>
            
            {/* HORIZONTAL TOUCH RUNNER SCROLL ROW */}
            <div className="w-full flex overflow-x-auto gap-4 md:gap-5 pb-5 scrollbar-hide scroll-smooth touch-pan-x select-none snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
              {items.map((item, itemIndex) => (
                <div 
                  key={item.id} 
                  className="group flex flex-col shrink-0 w-[calc(50%-8px)] md:w-52 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 overflow-hidden snap-start dark:bg-(--surface) dark:border-(--border) dark:hover:border-zinc-800 dark:shadow-none"
                >
                  <Link href={`/product/${item.id}`} className="block relative">
                    {/* ASSET CANVAS CONTAINER CONTAINER */}
                    <div className="relative aspect-[4/3] w-full bg-slate-50/50 flex items-center justify-center overflow-hidden dark:bg-black">
                      <Image 
                        loader={localImageLoader}
                        src={getImageUrl(item.image_url)} 
                        alt={item.name}
                        fill 
                        sizes="(max-w-768px) 50vw, 208px" 
                        priority={categoryIndex === 0 && itemIndex < 2} 
                        loading={categoryIndex === 0 && itemIndex < 2 ? undefined : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgNCAzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4="
                        decoding="async"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      
                      {/* STOCK DEPLETION MASK BADGE */}
                      {item.stock === 0 && (
                        <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center z-10 dark:bg-black/60">
                          <span className="text-[9px] font-extrabold text-white tracking-widest uppercase bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/20 dark:bg-zinc-900/90">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* SPEC CARD SUMMARY TYPOGRAPHY BLOCK */}
                    <div className="p-3 md:p-3.5 space-y-1">
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                        {item.brand || 'Generic'}
                      </p>
                      <h3 className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors dark:text-foreground dark:group-hover:text-indigo-400">
                        {item.name}
                      </h3>
                      <p className="text-xs md:text-sm font-black text-slate-900 pt-0.5 md:pt-1 dark:text-foreground">
                        KES {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  {/* BOTTOM CTAS HOVER INTERACTIVE ACTIONS BLOCK */}
                  <div className="p-3 md:p-3.5 pt-0 mt-auto">
                    <Link
                      href={`/product/${item.id}`}
                      className={`block w-full py-2 rounded-xl text-center text-[11px] md:text-xs font-bold tracking-wide transition-all active:scale-98 border ${
                        item.stock > 0
                          ? 'bg-slate-900 border-slate-900 text-white hover:bg-indigo-600 hover:border-indigo-600 shadow-sm shadow-slate-200 dark:bg-white dark:border-white dark:text-black dark:hover:bg-zinc-200 dark:shadow-none'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-zinc-900/50 dark:border-(--border) dark:text-zinc-600'
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

      {/* RAW INLINE BUNDLER SCROLLBAR STRIPPER INJECTION */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// Main Module Export wrapping our tracking selectors cleanly inside Suspense
export default function ShoppingSection({ searchQuery = "" }) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 space-y-3 dark:bg-black">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin dark:border-indigo-400"></div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Loading Shell...</p>
      </div>
    }>
      <ShoppingCatalog searchQuery={searchQuery} />
    </Suspense>
  );
}
