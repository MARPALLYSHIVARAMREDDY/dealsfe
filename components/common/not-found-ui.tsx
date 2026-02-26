"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Home, ShoppingBag, AlertCircle } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface NotFoundUIProps {
  title?: string;
  message?: string;
  showSearch?: boolean;
}

export default function NotFoundUI({
  title = "Oops! Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showSearch = true,
}: NotFoundUIProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Icon */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <AlertCircle className="relative w-32 h-32 mx-auto text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`mt-8 text-4xl md:text-6xl font-bold tracking-tight transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {title}
        </h1>

        {/* Message */}
        <p
          className={`mt-4 text-lg text-muted-foreground max-w-md mx-auto transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {message}
        </p>

        {/* Search Input (Optional) */}
        {showSearch && (
          <div
            className={`mt-8 max-w-md mx-auto transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products or deals..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link href="/">
            <InteractiveHoverButton className="flex flex-row items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                  
                    <p>Back to Home</p>
                 
              </div>
           

            </InteractiveHoverButton>
          </Link>

          <Link href="/active-sales">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted/50 transition-all">
              <ShoppingBag className="w-4 h-4" />
              Browse Deals
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}
