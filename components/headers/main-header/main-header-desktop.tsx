import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbars/navbar";
import {  AccountDropdown } from "./header-menus";
import { SearchBar } from "@/components/search-bar";
import AdvertiseWithUS from "@/components/advertise-with-us/advertise-with-us";
import { CountryPicker } from "@/components/country-picker/country-picker";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background  hidden md:block">
      <div className="mx-auto h-14 max-w-screen-2xl px-4 lg:px-14">
        <div className="relative flex h-full items-center gap-4">
          
          {/* Left group */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="hidden md:block shrink-0">
              <Image
                src="/images/dealslogo.png"
                alt="Deals Mocktail"
                height={30}
                width={120}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <Navbar locale={locale}/>
          </div>

          {/* Search takes remaining space */}
          <div className="flex-1 max-w-[700px]">
            <SearchBar />
          </div>

          {/* Right group */}
          <div className="flex items-center gap-3 shrink-0">
            <AdvertiseWithUS />
            <CountryPicker />
            <AccountDropdown />
          </div>

          {/* Mobile centered logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:hidden"
          >
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
      </div>
    </header>
  );
}

