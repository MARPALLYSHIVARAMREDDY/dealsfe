"use client";

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
interface NativeAdProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'promo-banner';
}

export default function NativeAd({ className = '', variant = 'horizontal' }: NativeAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Google Ads Code - Commented out
  // useEffect(() => {
  //   // Initialize ad script here if needed
  //   // For example, Google AdSense or other ad networks
  //   if (adRef.current && typeof window !== 'undefined') {
  //     try {
  //       // @ts-ignore
  //       (window.adsbygoogle = window.adsbygoogle || []).push({});
  //       setAdLoaded(true);
  //     } catch (err) {
  //       console.error('Ad loading error:', err);
  //     }
  //   }
  // }, []);

  if (variant === 'promo-banner') {
    return (
      <div className={cn('bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground', className)}>
        <h3 className="text-lg font-bold mb-1">Tech Week Deals</h3>
        <p className="text-sm opacity-90 mb-3">Up to 60% off top electronics brands</p>
        <button className="bg-background text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-background/90 transition-colors">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`native-ad-container ${className}`}>
      {/* Visible placeholder/fallback */}
       <div className={cn('bg-muted/30 border border-border/50 rounded-xl p-4 flex items-center gap-4', className)}>
        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
          <span className="text-muted-foreground/40 text-xs">AD</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Sponsored</span>
          <h4 className="font-medium text-foreground text-sm mt-1 line-clamp-1">Sponsored Product</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            Check out this amazing deal from our partners
          </p>
        </div>

      </div>

      {/* Google AdSense - hidden initially, will overlay when loaded */}
      {/* <ins
        className="adsbygoogle"
        style={{ display: adLoaded ? 'block' : 'none' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
      /> */}
    </div>
  );
}
