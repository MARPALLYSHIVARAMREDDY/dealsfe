"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LOCALES } from "@/lib/locale-utils";

export function MobileBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is home (/{locale} or /{locale}/)
  const isHomePage = () => {
    // Extract locale from pathname
    const pathSegments = pathname.split('/').filter(Boolean);

    // If only one segment and it's a valid locale, we're on home page
    if (pathSegments.length === 1) {
      const potentialLocale = pathSegments[0];
      return potentialLocale in SUPPORTED_LOCALES;
    }

    return false;
  };

  // Don't render on home page
  if (isHomePage()) {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="shrink-0 h-9 w-9 flex items-center justify-center"
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </Button>
  );
}
