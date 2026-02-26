"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogItem } from "@/types/common.types.ts";

export default function ProductDetailClient({ item }: { item: CatalogItem }) {
  // Normalize and validate image URLs to avoid runtime errors
  const rawImages = item.imageUrl ? [item.imageUrl] : [];
  const sanitizeUrl = (u: string): string | null => {
    const trimmed = u.trim().replace(/[)]+$/, "");
    try {
      const parsed = new URL(trimmed);
      return parsed.href;
    } catch {
      return null;
    }
  };
  const images = rawImages.map(sanitizeUrl).filter(Boolean) as string[];
  const placeholders = Array.from({ length: 4 }, (_, i) => i);
  const [active, setActive] = React.useState(0);
  const [size, setSize] = React.useState<string | null>("S");
  const [colorIdx, setColorIdx] = React.useState<number>(0);
  const [qty, setQty] = React.useState<number>(1);

  const colorTokens = ["bg-accent", "bg-muted"] as const;

  const nextImage = () => setActive((a) => (a + 1) % (images.length || 4));
  const prevImage = () => setActive((a) => (a - 1 + (images.length || 4)) % (images.length || 4));

  const hasImageAt = (idx: number) => Boolean(images[idx]);

  return (
    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* Main image or fallback background */}
          {hasImageAt(active) ? (
            <Image
              src={images[active]!}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-muted">
              <span className="text-sm text-muted-foreground">No image available</span>
            </div>
          )}

          {/* Nav arrows */}
          <button
            className="group absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border bg-card/80 backdrop-blur transition hover:scale-105"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>
          <button
            className="group absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border bg-card/80 backdrop-blur transition hover:scale-105"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-3">
          {placeholders.map((_, i) => (
            <button
              key={i}
              className={`relative aspect-square overflow-hidden rounded-lg border transition hover:scale-[1.02] ${
                active === i ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
              }`}
              onClick={() => setActive(i)}
              aria-label={`Open image ${i + 1}`}
            >
              {hasImageAt(i) ? (
                <Image src={images[i]!} alt={`${item.title} thumbnail ${i + 1}`} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? "text-accent" : "text-muted-foreground"}`}
                fill="currentColor"
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">(4.9)</span>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold">₹{item.price.toLocaleString("en-IN")}</span>
          <span className="text-sm text-muted-foreground">Inclusive of taxes</span>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Available Size</p>
          <div className="flex gap-2">
            {["S", "M", "L"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-10 w-10 rounded-md border text-sm font-medium transition hover:translate-y-[-1px] ${
                  size === s ? "bg-secondary" : "bg-card"
                }`}
                aria-pressed={size === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Available Color</p>
          <div className="flex items-center gap-3">
            {colorTokens.map((token, i) => (
              <button
                key={token}
                onClick={() => setColorIdx(i)}
                className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                  colorIdx === i ? "ring-2 ring-ring" : ""
                }`}
                aria-label={`Select color ${i + 1}`}
              >
                <span className={`block h-4 w-4 rounded-full ${token}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <p className="text-sm text-destructive">
          <span className="font-semibold">Last 1 left</span> – make it yours!
        </p>

        {/* Quantity + Add to cart */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border bg-card shadow-sm">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-9 w-9 place-items-center transition hover:bg-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="px-3 text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-9 w-9 place-items-center transition hover:bg-secondary"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <button className="group flex items-center gap-2 rounded-lg border bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:shadow-md active:scale-[0.98]">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}