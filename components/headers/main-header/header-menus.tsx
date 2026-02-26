"use client";

import { Menu, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DrawerWrapper,
  DrawerHeaderSection,
  DrawerMenuItems,
  DrawerSectionDivider,
  DrawerNavContainer,
} from "@/components/common/drawer-section";
import { useLogout } from "@/hooks/useLogout";
import { menuItems, accountItems, authItems } from "./header-constants";
import { useAppSelector } from "@/store/hooks";
import { NoiseBackground } from "@/components/ui/noise-background";
import Link from "next/link";

// ========== COMPOSABLE MENU COMPONENT ==========
// Pure component - no hooks, just props
// Shared by both MobileDrawer and AccountDropdown

interface AccountMenuContentProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  iconSize: number;
  textSize: string;
  gap: string;
  padding: string;
  itemClassName: string;
  inactiveClassName: string;
  showActiveIndicator: boolean;
}

function AccountMenuContent({
  isAuthenticated,
  onLogout,
  iconSize,
  textSize,
  gap,
  padding,
  itemClassName,
  inactiveClassName,
  showActiveIndicator,
}: AccountMenuContentProps) {
  return (
    <>
      <DrawerMenuItems
        items={accountItems}
        iconSize={iconSize}
        textSize={textSize}
        gap={gap}
        padding={padding}
        itemClassName={itemClassName}
        inactiveClassName={inactiveClassName}
        showActiveIndicator={showActiveIndicator}
      />
      <DrawerSectionDivider marginY="my-1" className="h-px bg-border" />
      {isAuthenticated ? (
        <LogoutMenuItem
          onLogout={onLogout}
          iconSize={iconSize}
          textSize={textSize}
          gap={gap}
          padding={padding}
          itemClassName={itemClassName}
          inactiveClassName={inactiveClassName}
        />
      ) : (
        <DrawerMenuItems
          items={authItems}
          iconSize={iconSize}
          textSize={textSize}
          gap={gap}
          padding={padding}
          itemClassName={itemClassName}
          inactiveClassName={inactiveClassName}
          showActiveIndicator={showActiveIndicator}
        />
      )}
    </>
  );
}

// ========== CLIENT ISLAND #1: MOBILE DRAWER ==========

export function MobileDrawer() {
  const handleLogout = useLogout();
  const isAuthenticated = useAppSelector(
    (state) => state.newAuth.isAuthenticated
  );


  return (
    <DrawerWrapper
      trigger={<MobileDrawerTrigger />}
      direction="left"
      width="280px"
      height="100vh"
      className="h-screen"
    >
      <DrawerHeaderSection title="Menu" />
      <DrawerNavContainer>
        <DrawerMenuItems
          items={menuItems}
          iconSize={20}
          textSize="text-sm"
          gap="gap-3"
          padding="px-4 py-3"
        />
        <DrawerSectionDivider title="My Account" />
        <AccountMenuContent
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          iconSize={20}
          textSize="text-sm"
          gap="gap-3"
          padding="px-4 py-2"
          itemClassName="font-medium hover:bg-muted"
          inactiveClassName="text-foreground"
          showActiveIndicator={false}
        />
      </DrawerNavContainer>
    </DrawerWrapper>
  );
}

// ========== CLIENT ISLAND #2: ACCOUNT DROPDOWN ==========

export function AccountDropdown() {
  const handleLogout = useLogout();
  const isAuthenticated = useAppSelector(
    (state) => state.newAuth.isAuthenticated
  );

  if (!isAuthenticated) {
    return (
      <Link href="/auth" className="flex h-10 items-center justify-center">
        <NoiseBackground
          containerClassName="h-full rounded-full px-1 flex items-center"
          gradientColors={[
            "rgb(255, 100, 150)",
            "rgb(100, 150, 255)",
            "rgb(255, 200, 100)",
          ]}
        >
          <button className="h-8 cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] font-sm">
            Login
          </button>
        </NoiseBackground>
      </Link>
    );
  }
  

  return (
    <DrawerWrapper
      trigger={<AccountDropdownTrigger />}
      direction="dropdown"
      width="192px"
      height="147px"
      className="w-48 mr-12 h-[147px] shadow py-1 bg-background dark:bg-zinc-900 rounded-lg"
    >
      <AccountMenuContent
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        iconSize={16}
        textSize="text-sm"
        gap="gap-2"
        padding="mx-1 px-2 py-1.5"
        itemClassName="hover:bg-muted cursor-pointer"
        inactiveClassName="text-foreground"
        showActiveIndicator={false}
      />
    </DrawerWrapper>
  );
}

// ========== HELPER COMPONENTS ==========

function MobileDrawerTrigger() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden shrink-0 h-9 w-9 flex items-center justify-center"
      aria-label="Open menu"
    >
      <Menu size={24} />
    </Button>
  );
}

function AccountDropdownTrigger() {
  return (
    <Button
      variant="ghost"
      className="hidden md:flex items-center gap-1 h-9 px-3 border-none border-0! shadow-none focus:ring-0 focus:border-0! focus-visible:border-0! cursor-pointer"
      style={{ border: "none", boxShadow: "none" }}
    >
      <User className="h-5 w-5" />
      <span className="text-sm text-foreground">My Account</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}

interface LogoutMenuItemProps {
  onLogout: () => void;
  iconSize: number;
  textSize: string;
  gap: string;
  padding: string;
  itemClassName: string;
  inactiveClassName: string;
}

function LogoutMenuItem({
  onLogout,
  iconSize,
  textSize,
  gap,
  padding,
  itemClassName,
  inactiveClassName,
}: LogoutMenuItemProps) {
  return (
    <div
      onClick={onLogout}
      className={`flex items-center ${gap} ${padding} ${itemClassName} ${inactiveClassName} rounded-md cursor-pointer`}
    >
      <LogOut size={iconSize} />
      <span className={textSize}>Logout</span>
    </div>
  );
}
