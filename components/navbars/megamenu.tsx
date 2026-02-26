"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  LucideIcon,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  Zap,
  Percent,
  Gift,
  ChevronDown,
} from "lucide-react";

export interface SubCategory {
  label: string;
  path: string;
}

export interface Category {
  icon: LucideIcon;
  label: string;
  path: string;
  subcategories: SubCategory[];
}

export interface QuickLink {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface MegaMenuData {
  categories: Category[];
  quickLinks: QuickLink[];
}

interface MegaMenuProps {
  data?: MegaMenuData;
  onClose?: () => void;
  itemLabel?: string;
}

const defaultData: MegaMenuData = {
  categories: [
    {
      icon: Smartphone,
      label: "Electronics",
      path: "/categories/electronics",
      subcategories: [
        { label: "Smartphones", path: "/categories/electronics/smartphones" },
        { label: "Laptops", path: "/categories/electronics/laptops" },
        {
          label: "TVs & Displays",
          path: "/categories/electronics/tvs-displays",
        },
        {
          label: "Audio & Headphones",
          path: "/categories/electronics/audio-headphones",
        },
        { label: "Cameras", path: "/categories/electronics/cameras" },
      ],
    },
    {
      icon: Shirt,
      label: "Fashion",
      path: "/categories/fashion",
      subcategories: [
        { label: "Men's Clothing", path: "/categories/fashion/mens-clothing" },
        {
          label: "Women's Clothing",
          path: "/categories/fashion/womens-clothing",
        },
        { label: "Shoes", path: "/categories/fashion/shoes" },
        { label: "Accessories", path: "/categories/fashion/accessories" },
      ],
    },
    {
      icon: HomeIcon,
      label: "Home & Kitchen",
      path: "/categories/home-kitchen",
      subcategories: [
        { label: "Furniture", path: "/categories/home-kitchen/furniture" },
        {
          label: "Kitchen Appliances",
          path: "/categories/home-kitchen/kitchen-appliances",
        },
        { label: "Home Decor", path: "/categories/home-kitchen/home-decor" },
        { label: "Bedding", path: "/categories/home-kitchen/bedding" },
      ],
    },
    {
      icon: Sparkles,
      label: "Beauty & Health",
      path: "/categories/beauty-health",
      subcategories: [
        { label: "Skincare", path: "/categories/beauty-health/skincare" },
        { label: "Makeup", path: "/categories/beauty-health/makeup" },
        { label: "Hair Care", path: "/categories/beauty-health/hair-care" },
        { label: "Wellness", path: "/categories/beauty-health/wellness" },
      ],
    },
    {
      icon: Dumbbell,
      label: "Sports & Outdoors",
      path: "/categories/sports-outdoors",
      subcategories: [
        {
          label: "Fitness Equipment",
          path: "/categories/sports-outdoors/fitness-equipment",
        },
        {
          label: "Outdoor Gear",
          path: "/categories/sports-outdoors/outdoor-gear",
        },
        {
          label: "Sports Wear",
          path: "/categories/sports-outdoors/sports-wear",
        },
      ],
    },
  ],
  quickLinks: [
    {
      icon: Zap,
      label: "Today's Best Deals",
      path: "/deals/today",
    },
    {
      icon: Percent,
      label: "Coupons & Promo Codes",
      path: "/coupons",
    },
    {
      icon: Gift,
      label: "Gift Ideas",
      path: "/gift-ideas",
    },
  ],
};

export function useMegaMenu() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 120);
  };

  return {
    isMegaMenuOpen,
    setIsMegaMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
  };
}

function MegaMenuContent({
  data = defaultData,
  onClose,
}: {
  data?: MegaMenuData;
  onClose?: () => void;
}) {
  const { categories, quickLinks } = data;

  return (
    <div className="fixed inset-x-0  w-screen  border-b border-border  bg-card  animate-fade-in pt-1 z-50 mt-2.5">
      <div className="mx-auto max-w-7xl  py-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Categories Section */}
          <div className="col-span-9">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              SHOP BY CATEGORY
            </h3>
            <div className="grid grid-cols-5 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.label} className="space-y-3">
                    <Link
                      href={category.path}
                      className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors mb-3"
                      onClick={onClose}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{category.label}</span>
                    </Link>
                    <ul className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.path}>
                          <Link
                            href={sub.path}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={onClose}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-span-3 border-l border-border pl-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              QUICK LINKS
            </h3>
            <div className="space-y-4 ">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MegaMenu({
  data = defaultData,
  onClose,
  itemLabel = "Categories",
}: MegaMenuProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="flex items-center gap-1 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          {itemLabel}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isMegaMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isMegaMenuOpen && <div className="absolute h-3 top-full" />}
      </div>

      {isMegaMenuOpen && (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <MegaMenuContent data={data} onClose={onClose} />
        </div>
      )}
    </>
  );
}
