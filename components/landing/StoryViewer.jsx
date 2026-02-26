'use client'

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * StoryViewer Component - Displays products in a story format
 *
 * Expected data structure from API:
 * stores = [{
 *   id: string,
 *   name: string,
 *   icon: string (emoji or icon),
 *   imageUrl: string,
 *   timeAgo: string (e.g., "2h", "1d"),
 *   products: [{
 *     id: string,
 *     title: string,
 *     description: string,
 *     price: string (formatted, e.g., "$99.99"),
 *     originalPrice: string (formatted, e.g., "$199.99"),
 *     discount: number (e.g., 50),
 *     badges: [{ type: 'hot' | 'new', label: string }]
 *   }]
 * }]
 */
const StoryViewer = ({ stores, initialStoreIndex, onClose }) => {
  const [currentStoreIndex, setCurrentStoreIndex] = useState(initialStoreIndex);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStore = stores[currentStoreIndex];
  const currentProduct = currentStore?.products[currentProductIndex];
  const totalProducts = currentStore?.products.length || 0;

  // Navigate to next product/store
  const goToNext = useCallback(() => {
    if (currentProductIndex < totalProducts - 1) {
      setCurrentProductIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoreIndex < stores.length - 1) {
      setCurrentStoreIndex(prev => prev + 1);
      setCurrentProductIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentProductIndex, totalProducts, currentStoreIndex, stores.length, onClose]);

  // Navigate to previous product/store
  const goToPrev = useCallback(() => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoreIndex > 0) {
      setCurrentStoreIndex(prev => prev - 1);
      setCurrentProductIndex(stores[currentStoreIndex - 1].products.length - 1);
      setProgress(0);
    }
  }, [currentProductIndex, currentStoreIndex, stores]);

  // Auto-progress timer (5 seconds per story)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 2; // 100 / 50 = 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  // Lock body scroll and hide mobile navigation
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const mobileNav = document.querySelector('[data-mobile-nav]');
    const stickyFilters = document.querySelectorAll('[data-sticky-filter]');

    if (mobileNav) mobileNav.style.display = 'none';
    stickyFilters.forEach(el => el.style.display = 'none');

    return () => {
      document.body.style.overflow = '';
      if (mobileNav) mobileNav.style.display = '';
      stickyFilters.forEach(el => el.style.display = '');
    };
  }, []);

  if (!currentProduct || !currentStore) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Story Card Container */}
      <div className="relative w-full max-w-[380px] mx-4 h-[90vh] max-h-[750px] rounded-3xl overflow-hidden shadow-2xl bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentStore.imageUrl}
            alt={currentStore.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {currentStore.products.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentProductIndex
                    ? '100%'
                    : index === currentProductIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header - Store info */}
        <div className="absolute top-7 left-3 right-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base shadow-lg">
              {currentStore.icon}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm drop-shadow-lg">
                {currentStore.name}
              </span>
              {currentStore.timeAgo && (
                <span className="text-white/70 text-xs">{currentStore.timeAgo}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white rounded-lg px-4 py-2 shadow-xl">
            <span className="text-[10px] text-muted-foreground block text-center uppercase tracking-wide">
              ONLY
            </span>
            <span className="text-2xl font-bold text-foreground">
              {currentProduct.price}
            </span>
          </div>
        </div>

        {/* Navigation Areas (tap zones) */}
        <div className="absolute inset-0 flex z-10">
          <button
            className="w-1/3 h-full cursor-pointer"
            onClick={goToPrev}
            aria-label="Previous story"
          />
          <div className="w-1/3" />
          <button
            className="w-1/3 h-full cursor-pointer"
            onClick={goToNext}
            aria-label="Next story"
          />
        </div>

        {/* Bottom Deal Card */}
        <div className="absolute bottom-4 left-3 right-3 z-20">
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            {/* Badges and Store */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {currentProduct.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      badge.type === 'hot'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground text-[11px]">
                Sold by {currentStore.name}
              </span>
            </div>

            {/* Product Name */}
            <h4 className="text-foreground text-sm font-semibold line-clamp-2 mb-1">
              {currentProduct.title}
            </h4>

            {/* Description */}
            <p className="text-muted-foreground text-xs mb-3 line-clamp-1">
              {currentProduct.description}
            </p>

            {/* Price Row with Discount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold text-lg">
                  {currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    {currentProduct.originalPrice}
                  </span>
                )}
                {currentProduct.discount && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {currentProduct.discount}% OFF
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-4 h-9 text-sm font-medium"
                onClick={() => {
                  // TODO: Add navigation to product detail page
                }}
              >
                View Deal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop only) */}
      <button
        onClick={goToPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-colors z-20 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentStoreIndex === 0 && currentProductIndex === 0}
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-colors z-20"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Store Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {stores.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentStoreIndex(index);
              setCurrentProductIndex(0);
              setProgress(0);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStoreIndex
                ? 'w-5 bg-white'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to store ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryViewer;
