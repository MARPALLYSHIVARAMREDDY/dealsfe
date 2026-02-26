import { ChevronLeft, ChevronRight, Copy, Check, Store as StoreIcon, Ticket, TrendingDown } from 'lucide-react';
import { PreviewData } from '@/store/preview-store';

interface PreviewModalContentProps {
  data: PreviewData;
  currentImageIndex: number;
  copiedCode: boolean;
  onPrevImage: () => void;
  onNextImage: () => void;
  onCopyCode: () => void;
  onImageDotClick: (index: number) => void;
}

export function PreviewModalContent({
  data,
  currentImageIndex,
  copiedCode,
  onPrevImage,
  onNextImage,
  onCopyCode,
  onImageDotClick
}: PreviewModalContentProps) {
  const images = data.image ? [data.image] : data.imageUrl ? [data.imageUrl] : data.images || [];
  const salePrice = typeof data.salePrice === 'number' ? data.salePrice :
                   typeof data.price === 'number' ? data.price :
                   parseFloat(String(data.price || 0));
  const originalPrice = data.originalPrice || 0;
  const savings = originalPrice > salePrice ? originalPrice - salePrice : 0;
  const discountPercent = data.discountPercent || data.discount || 0;
  const badges = data.badges || [];

  console.log({data})

  return (
    <div className="overflow-y-auto flex-1">
      {/* Image */}
      <div className="relative bg-primary-foreground">
        <div className="aspect-[4/3] relative overflow-hidden">
          {images.length > 0 && (
            <img
              src={images[currentImageIndex]}
              alt={data.title}
              className="w-full h-full object-contain"
            />
          )}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </div>
          )}
        </div>
        {images.length > 1 && (
          <>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onImageDotClick(idx)}
                  className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-foreground/30'}`}
                />
              ))}
            </div>
            <button
              onClick={onPrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card/80 flex items-center justify-center"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card/80 flex items-center justify-center"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {badges.map(badge => (
              <span
                key={badge}
                className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  badge === 'hot' ? 'deal-badge-hot' :
                  badge === 'trending' ? 'deal-badge-trending' :
                  badge === 'new' ? 'deal-badge-new' :
                  'deal-badge-discount'
                }`}
              >
                {badge.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-sm font-bold text-foreground mb-1 line-clamp-2">{data.title}</h2>

        {/* Store */}
        {data.store && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded bg-accent flex items-center justify-center">
              <StoreIcon className="h-2.5 w-2.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">{data.store}</span>
          </div>
        )}

        {/* Coupon Code */}
        {data.couponCode && (
          <button
            onClick={onCopyCode}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-primary/10 border border-dashed border-primary/40 rounded-lg hover:border-primary/60 mb-2"
          >
            <div className="flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-xs font-semibold text-primary">{data.couponCode}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </div>
          </button>
        )}

        {/* Price */}
        <div className="bg-primary-foreground rounded-lg p-2 mb-2">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-lg font-bold text-primary">${salePrice.toFixed(2)}</span>
            {originalPrice > salePrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-primary">
              <TrendingDown className="h-3 w-3" />
              <span>You save ${savings.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
