"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import Image from 'next/image';
import localImageLoader, { isRemoteImageSource } from '../../config/ImageLoader';

const HeroSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPauseUntil, setAutoPauseUntil] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Tracking states for touch coordinates
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // SAFE MOUNT TRACKER
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // FETCH HERO DATA
  useEffect(() => {
    const fetchHeroOffers = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.SHOPPING.HERO);
        setOffers(res.data.products || []);
      } catch (err) {
        console.error('Hero Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroOffers();
  }, []);

  // AUTOMATIC SLIDER TIMER
  useEffect(() => {
    if (offers.length <= 1) return;

    const timer = setInterval(() => {
      if (Date.now() < autoPauseUntil) return;
      setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [offers.length, autoPauseUntil]);

  const pauseAutoAdvance = () => {
    setAutoPauseUntil(Date.now() + 10000);
  };

  // Directional navigation methods
  const handlePrev = () => {
    pauseAutoAdvance();
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    pauseAutoAdvance();
    setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
  };

  // TOUCH / SWIPE LIFECYCLE HANDLERS
  const minSwipeDistance = 50; // Minimum swipe movement required in pixels

  const handleTouchStart = (e) => {
    pauseAutoAdvance();
    setTouchEnd(null); // Reset before tracking new swipe
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // HIGH PERFORMANCE SKELETON PLACEHOLDER
  if (!hasMounted || loading) {
    return (
      <div className="w-full h-[50vh] min-h-[400px] bg-slate-100 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-12 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-1/2 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) return null;

  const current = offers[currentIndex];

  return (
    <section 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-(--surface-alt) border-b border-(--border) group/section select-none touch-pan-y"
    >
      
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {offers.map((product, index) => {
          const isCurrent = index === currentIndex;
          
          if (Math.abs(index - currentIndex) > 1 && index !== offers.length - 1 && index !== 0) {
            return null;
          }

          const resolvedImageSrc = getImageUrl(product.image_url);
          const useUnoptimizedImage = isRemoteImageSource(resolvedImageSrc);

          return (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu will-change-transform ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div 
                className="absolute inset-0 md:left-1/3 h-full w-full md:w-2/3 ml-auto [clip-path:none] md:[clip-path:polygon(15%_0,_100%_0,_100%_100%,_0%_100%)]"
              >
                <Image
                  loader={localImageLoader}
                  src={resolvedImageSrc}
                  alt={product.name}
                  fill 
                  sizes="(max-w-768px) 100vw, 66vw" 
                  priority={index === 0} 
                  fetchpriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  unoptimized={useUnoptimizedImage}
                  className="object-cover" 
                />                
                <div className="md:hidden absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center pointer-events-none">
        <div className="w-full md:w-1/2 text-left pointer-events-auto">
          <div className="animate-fadeIn">
            <span className="block font-bold tracking-widest uppercase text-[10px] md:text-xs mb-2 text-indigo-600">
              New arrivals
            </span>
            
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black leading-tight mb-2 text-(--muted)">
              {current.name}
            </h1>

            <div className="flex items-center justify-start gap-3 mb-6">
              <span className="text-2xl md:text-3xl font-black text-indigo-600">
                KES {Number(current.price).toLocaleString()}
              </span>
              {current.old_price && (
                <span className="text-lg text-slate-400 line-through">
                  KES {Number(current.old_price).toLocaleString()}
                </span>
              )}
              {current.old_price > current.price && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  {Math.round(((current.old_price - current.price) / current.old_price) * 100)}% Off
                </span>
              )}
            </div>

            <div className="flex flex-row gap-3 justify-start">
              <Link
                href={`/product/${current.slug || current.id}`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base hover:bg-indigo-700 transition-all shadow-md"
              >
                VIEW NOW
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECTIONAL NAV BUTTONS (Hidden on mobile screens to prevent touch dead zones) */}
      {offers.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm opacity-0 group-hover/section:opacity-100 transition-all active:scale-95 duration-300"
            aria-label="Previous slide"
          >
            <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm opacity-0 group-hover/section:opacity-100 transition-all active:scale-95 duration-300"
            aria-label="Next slide"
          >
            <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* PROGRESS INDICATORS */}
      <div className="absolute bottom-4 left-1/2 md:left-6 -translate-x-1/2 md:translate-x-0 z-30 flex gap-1.5">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              pauseAutoAdvance();
              setCurrentIndex(index);
            }}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentIndex ? 'w-8 bg-indigo-500' : 'w-3 bg-slate-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
