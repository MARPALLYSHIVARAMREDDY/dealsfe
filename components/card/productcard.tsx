"use client";

import { Share2, Heart, Gift } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  store: string;
  brand?: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  affiliateUrl?: string;
  badges?: string[];
  badgeColor?: string;
  badgeTextColor?: string;
  isTrending?: boolean;
  isHot?: boolean;
  postedAt?: string;
  variant?: 'compact' | 'horizontal';
  className?: string;
  onPreviewClick?: () => void;
}

export default function ProductCard({
  id,
  title,
  description,
  category,
  store,
  brand,
  imageUrl,
  originalPrice,
  salePrice,
  discountPercent,
  affiliateUrl,
  badges = [],
  badgeColor,
  badgeTextColor,
  isTrending = false,
  isHot = false,
  postedAt,
  variant = 'compact',
  className,
  onPreviewClick,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    // On desktop (md and above), open preview modal if onPreviewClick is provided
    if (onPreviewClick && window.innerWidth >= 768) {
      onPreviewClick();
    } else if (affiliateUrl) {
      // On mobile or if no preview handler, open affiliate link
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality placeholder
  };

  const getBadgeClass = (badge: string) => {
    // Use dynamic colors if provided
    if (badgeColor && badgeTextColor) {
      const bgClass = `bg-${badgeColor}`;
      const textClass = `text-${badgeTextColor}`;

      return `${bgClass} ${textClass}`;
    }

    switch (badge) {
      case 'hot':
        return 'bg-red-500 text-white';
      case 'trending':
        return 'bg-purple-500 text-white';
      case 'new':
        return 'bg-green-500 text-white';
      case 'flash':
        return 'bg-yellow-400 text-white rounded-full';
      case 'limited':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getExtraInfo = () => {
    const infos = ['Free shipping', 'Free Buds included', 'Extra 10% off', 'Limited stock', 'Prime eligible'];
    return infos[Math.floor(Math.random() * infos.length)];
  };
  const extraInfo = badges.includes('flash') ? 'Free shipping' : getExtraInfo();

  const isHotDeal = isHot || badges?.includes('hot');

  // Compact Card View (Grid)
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "card-deal cursor-pointer group h-full  bg-card rounded-md shadow-none border border-border overflow-hidden hover:scale-102  transition-transform duration-200",
          isHotDeal ? 'card-deal-hot' : '',
          className
        )}
        onClick={handleCardClick}
      >
        <div className="relative aspect-square overflow-hidden">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex flex-wrap gap-1">
              {badges.slice(0, 1).map(badge => (
                <span
                  key={badge}
                  className={`deal-badge text-[9px] md:text-xs px-1.5 py-0.5 rounded-[10px] ${getBadgeClass(badge)}`}
                >
                  {badge === 'hot' ? '🔥' : ''} {badge.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          {discountPercent > 0 && (
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-primary text-primary-foreground text-[9px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded">
              {discountPercent}%
            </div>
          )}
        </div>
        <div className="p-2 md:p-3">
          {/* Store name */}
          <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5">{store}</p>
          <h3 className="text-[11px] md:text-sm font-semibold text-foreground line-clamp-2 mb-1 transition-colors leading-tight">
            {title}
          </h3>
          {/* Price and Social actions in same line */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1 md:gap-1.5">
              <span className="text-sm md:text-base font-bold text-primary">${salePrice.toFixed(2)}</span>
              {originalPrice > salePrice && (
                <span className="text-[9px] md:text-xs text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="p-1 hover:bg-accent rounded-full transition-colors"
                aria-label="Share deal"
              >
                <Share2 className="h-3 w-3 text-muted-foreground" />
              </button>
              <button
                onClick={handleFavoriteClick}
                className="p-1 hover:bg-accent rounded-full transition-colors"
                aria-label="Add to favorites"
              >
                <Heart
                  className={cn(
                    "h-3 w-3",
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the primary deal tag to display
  const getDealTag = () => {
    // Use dynamic colors if provided
    const dynamicClass = badgeColor && badgeTextColor
      ? `bg-${badgeColor} text-${badgeTextColor}`
      : '';

    if (isHot || badges?.includes('hot')) return {
      label: '🔥 HOT',
      class: dynamicClass || 'bg-red-500 text-white'
    };
    if (badges?.includes('trending')) return {
      label: '📈 TRENDING',
      class: dynamicClass || 'bg-purple-500 text-white'
    };
    if (badges?.includes('new')) return {
      label: '✨ NEW',
      class: dynamicClass || 'bg-green-500 text-white'
    };
    if (badges?.includes('flash')) return {
      label: '⚡ FLASH',
      class: dynamicClass || 'bg-yellow-400 text-gray-900'
    };
    if (badges?.includes('limited')) return {
      label: 'LIMITED',
      class: dynamicClass || 'bg-red-100 text-red-700'
    };
    if (discountPercent >= 50) return {
      label: '🏆 BEST SELLER',
      class: 'bg-purple-500 text-white'
    };
    if (badges?.length > 0) return {
      label: badges[0].toUpperCase(),
      class: dynamicClass || 'bg-gray-500 text-white'
    };
    return null;
  };
  const dealTag = getDealTag();

  // Horizontal Card View (List)
  return (
    <div
      className={cn(
        "card-deal cursor-pointer group flex bg-card rounded-none border border-border overflow-hidden",
        isHotDeal ? 'card-deal-hot' : '',
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative w-32 md:w-40 h-32 md:h-40 shrink-0 overflow-hidden items-center justify-center bg-muted/30 flex flex-col my-[20px] py-px pt-0 mx-0 pl-[10px]">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
            No Image
          </div>
        )}
        {dealTag && (
          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-md ${dealTag.class}`}>
            {dealTag.label}
          </div>
        )}
      </div>
      <div className="p-3 md:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Store + Extra Info */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground">{store}</span>
            <span className="text-xs text-primary flex items-center gap-1">
              <Gift className="h-3 w-3" />
              {extraInfo}
            </span>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm md:text-base mb-2 transition-colors">
            {title}
          </h3>
        </div>
        <div>
          {/* Price and Social actions in same line */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold text-primary">${salePrice.toFixed(2)}</span>
              {originalPrice > salePrice && (
                <span className="text-xs md:text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-accent rounded-full transition-colors"
                aria-label="Share deal"
              >
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={handleFavoriteClick}
                className="p-1.5 hover:bg-accent rounded-full transition-colors"
                aria-label="Add to favorites"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
