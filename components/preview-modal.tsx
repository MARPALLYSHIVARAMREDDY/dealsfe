"use client";

import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight, Copy, Check, Ticket, ExternalLink } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closePreview, goToNext, goToPrev } from '@/store/preview-store';
import { toast } from '@/hooks/use-toast';
import { PreviewModalContent } from './preview-modal/preview-modal-content';
import { PreviewModalFooter } from './preview-modal/preview-modal-footer';
import { Button } from './ui/button';

export default function PreviewModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOpen, data, allProducts, currentIndex } = useAppSelector((state) => state.preview);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setCurrentImageIndex(0);
      setCopiedCode(false);
      setShowCouponPopup(false);
    }
  }, [data?.id]);

  if (!isOpen || !data) return null;

  const hasPrevDeal = currentIndex > 0;
  const hasNextDeal = currentIndex < allProducts.length - 1;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && hasNextDeal) dispatch(goToNext());
      else if (diff < 0 && hasPrevDeal) dispatch(goToPrev());
    }
  };

  const handleCopyCode = async () => {
    if (!data.couponCode) return;

    try {
      await navigator.clipboard.writeText(data.couponCode);
      setCopiedCode(true);
      toast({
        title: "Copied!",
        description: `Code "${data.couponCode}" copied`
      });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleGrabDeal = () => {
    if (data.couponCode) {
      setShowCouponPopup(true);
    } else if (data.affiliateUrl) {
      window.open(data.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = () => {
    const url = data.detailUrl || `/products/${data.id}`;
    dispatch(closePreview());
    router.push(url);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
        onClick={() => dispatch(closePreview())}
      />

      {/* Deal navigation */}
      {hasPrevDeal && (
        <button
          onClick={() => dispatch(goToPrev())}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-9 h-9 rounded-full bg-card/90 flex items-center justify-center hover:bg-card shadow-lg border border-border"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {hasNextDeal && (
        <button
          onClick={() => dispatch(goToNext())}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-9 h-9 rounded-full bg-card/90 flex items-center justify-center hover:bg-card shadow-lg border border-border"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Modal */}
      <div
        className="relative bg-card rounded-2xl shadow-popup w-[90%] max-w-md max-h-[90vh] overflow-hidden animate-scale-in mx-4 flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-3 py-2 border-b border-border">
          <Button
            onClick={() => dispatch(closePreview())}
            className="w-7 h-7 rounded-full bg-background text-black cursor-pointer  flex items-center justify-center hover:bg-primary hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Presentation Component */}
        <PreviewModalContent
          data={data}
          currentImageIndex={currentImageIndex}
          copiedCode={copiedCode}
          onPrevImage={() => {
            const images = data.image ? [data.image] : [];
            setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
          }}
          onNextImage={() => {
            const images = data.image ? [data.image] : [];
            setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
          }}
          onCopyCode={handleCopyCode}
          onImageDotClick={setCurrentImageIndex}
        />

        {/* Footer - Client Component */}
        <PreviewModalFooter
          couponCode={data.couponCode}
          affiliateUrl={data.affiliateUrl}
          onGrabDeal={handleGrabDeal}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Coupon Popup */}
      {showCouponPopup && data.couponCode && (
        <div className="fixed inset-0 z-70 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setShowCouponPopup(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-popup w-[85%] max-w-sm p-5 animate-scale-in">
            <button
              onClick={() => setShowCouponPopup(false)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">Available Coupon</h3>
              <p className="text-xs text-muted-foreground">Copy the code before you go!</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-between px-3 py-3 bg-accent border-2 border-dashed border-primary rounded-lg mb-3"
            >
              <span className="font-mono text-base font-bold text-primary">{data.couponCode}</span>
              <div className="flex items-center gap-1 text-xs">
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Copy</span>
                  </>
                )}
              </div>
            </button>
            <button
              className="w-full h-10 text-sm bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-1 hover:bg-primary/90"
              onClick={() => {
                if (data.affiliateUrl) {
                  window.open(data.affiliateUrl, '_blank');
                }
                setShowCouponPopup(false);
              }}
            >
              Continue to Deal <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
