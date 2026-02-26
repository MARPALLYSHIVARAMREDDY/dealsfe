import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { MobileDrawer, AccountDropdown } from "./header-menus";
import { MobileBackButton } from "./mobile-back-button";
import { CountryPickerMobile } from "@/components/country-picker/country-picker-mobile";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background border-border xs:block md:hidden">
      <div className="mx-auto h-14 max-w-screen-2xl px-4 lg:px-6">
        <div className="flex h-full items-center justify-between">
          {/* LEFT: Back button + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Back button (hidden on home page) */}
            <Suspense fallback={null}>
              <MobileBackButton />
            </Suspense>

            {/* Logo */}
            <Link href="/">
              <Image
                src="/images/dealslogo.png"
                alt="Deals Mocktail"
                height={28}
                width={120}
                className="h-7 w-auto"
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Country Picker + Account + Mobile menu */}
          <div className="flex items-center gap-2 shrink-0">
            <CountryPickerMobile />
            <AccountDropdown />
            <MobileDrawer />

          </div>
        </div>
      </div>
    </header>
  );
}
