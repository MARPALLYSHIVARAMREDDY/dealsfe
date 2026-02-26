"use client";

import { useProductDetailStore } from "@/store/product-detail-store";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function ProductDetailSheet() {
  const { isOpen, product, closeProductDetail } = useProductDetailStore();

  if (!product) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Let the animation complete before updating store
      setTimeout(() => {
        closeProductDetail();
      }, 300); // Match the drawer animation duration
    }
  };

  return (
    <div className="md:hidden">
      <Drawer
        open={isOpen}
        onOpenChange={handleOpenChange}
        dismissible={true}
      >
        <DrawerContent className="h-[70vh]">
          {/* Hidden title for accessibility */}
          <DrawerTitle className="sr-only">
            {product.title}
          </DrawerTitle>

          {/* Close Button */}
          <DrawerClose asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>

          {/* Content */}
          <div className="h-full overflow-y-auto pb-20 px-4 pt-2">
            {/* Product Image */}
            <div className="w-full h-48 bg-chart-2 rounded-xl flex items-center justify-center text-background mb-4">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-sm">Product Image</span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-bold text-accent-foreground mb-3">
              {product.title}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                  {product.discount && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {product.discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Product Details</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Additional Info Section */}
            <div className="space-y-4 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High quality product</li>
                  <li>• Fast delivery available</li>
                  <li>• Easy returns within 7 days</li>
                  <li>• Authentic guarantee</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fixed Bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <button className="w-full py-3 bg-ring text-background rounded-xl text-base font-semibold hover:opacity-90 transition-opacity">
              {product.cta || "Add to Cart"}
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
