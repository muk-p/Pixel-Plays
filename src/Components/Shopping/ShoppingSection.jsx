"use client"; // Required for useState, useEffect, useRef, and search query parameters

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link'; // <--- THIS SCRIPT FIXES THE REFERENCE ERROR
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

const ShoppingSection = ({ searchQuery = "" }) => {
  const searchParams = useSearchParams(); 
  const activeCategory = searchParams.get('category');
  
  // State variables optimized for low-footprint mobile memory loops
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  
  const previousCategoryRef = useRef(activeCategory);
  const sectionRootRef = useRef(null); 
  const observerTargetRef = useRef(null); // Tracks mobile scrolling viewport intersecting positions

  // 1. INITIAL LOAD ENGINE: Fetches a lean batch of 8 items to maximize mobile Time-To-Interactive
  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      try {
        const res = await rateLimitedRequest(() => 
          axios.get(`${API_ENDPOINTS.SHOPPING.PRODUCTS}?page=1&limit=8`)
        );
        setProducts(res.data.products || []);
        setPage(1);
        setHasMore(1 < (res.data.pagination?.pages || 1));
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialProducts();
  }, []);

  // 2. INFINITE STREAM ROUTINE: Fetches subsequent light records safely without locking up browser cycles
  const loadMoreProducts = useCallback(async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    const nextPage = page + 1;

    try {
      const res = await rateLimitedRequest(() => 
        axios.get(`${API_ENDPOINTS.SHOPPING.PRODUCTS}?page=${nextPage}&limit=8`)
      );
      
      const newProducts = res.data.products || [];
      if (newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts]); 
        setPage(nextPage);
        setHasMore(nextPage < (res.data.pagination?.pages || 1));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching more items:", err);
    } finally {
      setFetchingMore(false);
    }
  }, [page, fetchingMore, hasMore]);

  // 3. EVENT TRACKER APIS: Monitors infinite layout bounds via highly efficient boundary margins
  useEffect(() => {
    const observerElement = observerTargetRef.current;
    if (!observerElement || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetchingMore) {
          loadMoreProducts();
        }
      },
      { 
        rootMargin: '250px 0px', // Requests the next dataset 250px early to support frictionless scrolling
        threshold: 0.01 
      } 
    );

    observer.observe(observerElement);
    return () => {
      if (observerElement) observer.unobserve(observerElement);
    };
  }, [hasMore, loading, fetchingMore, loadMoreProducts]);

  // 4. MEMOIZED DICTIONARY CACHE: Prevents rendering layout stutter by freezing processed category arrays
  const sortedCategoryEntries = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();
    const productArray = Array.isArray(products) ? products : [];

    const filtered = productArray.filter(p => {
      const name = p.name || "";
      return name.toLowerCase().includes(query);
    });

    const grouped = filtered.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => {
      if (a === 'Console') return -1;
      if (b === 'Console') return 1;
      return a.localeCompare(b);
    });
  }, [products, searchQuery]);

  // EFFECT 1: Instantly repositions display grids on clean keyword tracking executions
  useEffect(() => {
    if (loading || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      if (sectionRootRef.current) {
        sectionRootRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [searchQuery, loading]);

  // EFFECT 2: Seamlessly glides users to chosen menu headers across dynamic mobile viewports
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

  // Rendering fallback loaders 
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
          /* PERFORMANCE FIX 1: Modern CSS Layout Containment
             Tells the browser engine to skip layout & paint calculations for this whole category
             block when it is outside the viewport bounds, drastically lowering TBT. */
          <div 
            key={category} 
            id={sectionId} 
            className="w-full space-y-2 px-4 will-change-[content-visibility]"
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 340px' // Reserves an estimated height block to stop scrollbar jumping
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-border">
              <h2 className={`text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                isHighlighted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-foreground'
              }`}>
                {category}
              </h2>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full dark:bg-surface-alt dark:text-muted">
                {items.length} items
              </span>
            </div>
            
            <div className="w-full flex overflow-x-auto gap-4 md:gap-5 pb-5 scrollbar-hide scroll-smooth touch-pan-x select-none snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
              {items.map((item, itemIndex) => (
                <div key={item.id} className="group flex flex-col shrink-0 w-[calc(50%-8px)] md:w-52 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 overflow-hidden snap-start dark:bg-surface dark:border-border dark:hover:border-zinc-800 dark:shadow-none">
                  
                  <Link href={`/product/${item.id}`} className="block relative">
                    <div className="relative aspect-4/3 w-full bg-slate-50/50 flex items-center justify-center overflow-hidden dark:bg-black">
                      
                      {/* PERFORMANCE FIX 2: Fixed Image Loading Strategy
                          - Replaced 'priority={true}' with conditional priority (only the absolute first card of the first row gets loaded immediately).
                          - Removed 'unoptimized' to let Next.js compress assets to modern WebP formats.
                          - Added blur placeholders to maintain visual fluidity on slower mobile networks. */}
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

      {/* INFINITE SCROLL LOADER ANCHOR TARGET */}
      <div ref={observerTargetRef} className="w-full py-6 flex justify-center items-center">
        {fetchingMore && (
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Loading More Gear...</span>
          </div>
        )}
        {!fetchingMore && !hasMore && (
          <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Done
          </p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ShoppingSection;