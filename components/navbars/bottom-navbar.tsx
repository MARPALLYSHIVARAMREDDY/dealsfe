"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Tag, Search, Bell, User } from "lucide-react";

interface BottomNavbarProps {
  locale: string;
}

interface NavItem {
  label: string;
  icon: typeof Home;
  path: (locale: string) => string;
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, path: (locale: string) => `/${locale}` },
  { label: "Deals", icon: Tag, path: (locale: string) => `/${locale}/all-deals` },
  { label: "Search", icon: Search, path: (locale: string) => `/${locale}/search` },
  { label: "Alerts", icon: Bell, path: (locale: string) => `/${locale}/alerts` },
  { label: "Profile", icon: User, path: (locale: string) => `/${locale}/profile` },
];

export default function BottomNavbar({ locale }: BottomNavbarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    const itemPath = item.path(locale);

    if (item.label === "Home") {
      // Exact match for home page
      const pathSegments = pathname.split('/').filter(Boolean);
      return pathSegments.length === 1 && pathSegments[0] === locale;
    }

    // StartsWith for other pages
    return pathname.startsWith(itemPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-background/95 backdrop-blur-sm border-t border-border h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around w-full h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.path(locale)}
              href={item.path(locale)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 py-2 transition-colors"
            >
              <Icon
                size={22}
                className={active ? "text-primary" : "text-muted-foreground"}
              />
              <span className={`text-xs ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
