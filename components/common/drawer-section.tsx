"use client";

import React, { ReactNode, createContext, useContext, useState, useEffect, useRef } from "react";
import { X, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

// Context to allow children to close the drawer/dropdown
const DrawerContext = createContext<{
  setOpen: (open: boolean) => void;
} | null>(null);

export const useDrawer = () => useContext(DrawerContext);

// This is the main component - super flexible, accepts any children
interface DrawerWrapperProps {
  trigger: ReactNode;
  children: ReactNode;
  direction?: "left" | "right" | "top" | "bottom" | "dropdown";
  width?: string;
  height?: string;
  className?: string;
  contentClassName?: string;
}

export function DrawerWrapper({
  trigger,
  children,
  direction = "left",
  width = "280px",
  height = "100vh",
  className = "",
  contentClassName = "",
}: DrawerWrapperProps) {
  const [open, setOpen] = useState(false);

  if (!direction || direction === "dropdown") {
    // Popover dropdown mode
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
      if (!open) return;
      function handleClick(e: MouseEvent) {
        if (
          triggerRef.current?.contains(e.target as Node) ||
          contentRef.current?.contains(e.target as Node)
        ) {
          return;
        }
        setOpen(false);
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Positioning: below the trigger
    return (
      <DrawerContext.Provider value={{ setOpen }}>
        <div className="relative inline-block">
          <div ref={triggerRef} onClick={() => setOpen((v) => !v)} className="cursor-pointer">
            {trigger}
          </div>
          {open && (
            <div
              ref={contentRef}
              className={`absolute z-50 left-0 mt-2 ${className}`}
              style={{ minWidth: width, width: width, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)", borderRadius: 8, background: "var(--background, #fff)" }}
              data-vaul-drawer-direction="dropdown"
            >
              <div className={contentClassName}>
                {children}
              </div>
            </div>
          )}
        </div>
      </DrawerContext.Provider>
    );
  }

  // Drawer mode (left, right, top, bottom)
  const getPositionClass = () => {
    switch (direction) {
      case "left":
        return "left-0 top-0";
      case "right":
        return "right-0 top-0";
      case "top":
        return "top-0 left-0 right-0";
      case "bottom":
        return "bottom-0 left-0 right-0";
      default:
        return "left-0 top-0";
    }
  };

  const getSizeStyle = () => {
    if (direction === "left" || direction === "right") {
      return { width, height };
    }
    return { height, width: "100%" };
  };

  return (
    <DrawerContext.Provider value={{ setOpen }}>
      <Drawer direction={direction} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className="cursor-pointer">{trigger}</div>
        </DrawerTrigger>
        <DrawerContent
          className={`p-0 ${getPositionClass()} max-w-[80vw] ${className}`}
          style={getSizeStyle()}
          data-vaul-drawer-direction={direction}
        >
          {children}
        </DrawerContent>
      </Drawer>
    </DrawerContext.Provider>
  );
}


interface DrawerHeaderSectionProps {
  title: string;
  showCloseButton?: boolean;
  titleClassName?: string;
  headerClassName?: string;
  closeIconSize?: number;
}

export function DrawerHeaderSection({
  title,
  showCloseButton = true,
  titleClassName = "text-lg",
  headerClassName = "",
  closeIconSize = 16,
}: DrawerHeaderSectionProps) {
  return (
    <DrawerHeader className={`p-4 border-b border-border ${headerClassName}`}>
      <DrawerTitle className={`text-left ${titleClassName}`}>{title}</DrawerTitle>
      {showCloseButton && (
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 rounded-full border-2 border-primary bg-background w-6 h-6 flex items-center justify-center hover:bg-muted transition"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <X style={{ width: closeIconSize, height: closeIconSize }} />
          </Button>
        </DrawerClose>
      )}
    </DrawerHeader>
  );
}


export interface MenuItem {
  icon?: LucideIcon;
  label: string;
  path: string;
}

interface DrawerMenuItemsProps {
  items: MenuItem[];
  activePath?: string;
  iconSize?: number;
  textSize?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  itemClassName?: string;
  containerClassName?: string;
  gap?: string;
  padding?: string;
  showActiveIndicator?: boolean;
  onItemClick?: (path: string) => void;
}

export function DrawerMenuItems({
  items,
  activePath,
  iconSize = 20,
  textSize = "text-sm",
  activeClassName = "bg-primary/10 text-primary  ",
  inactiveClassName = "text-foreground",
  itemClassName = "",
  containerClassName = "",
  gap = "gap-3",
  padding = "px-4 py-3",
  showActiveIndicator = true,
  onItemClick,
}: DrawerMenuItemsProps) {
  const { setOpen } = useDrawer() || {};

  return (
    <div className={containerClassName}>
      {items.map((item) => {
        const isActive = activePath === item.path;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => {
              onItemClick?.(item.path);
              setOpen?.(false);
            }}
            className={`flex items-center ${gap} ${padding} ${textSize} transition-colors rounded-md relative cursor-pointer ${
              isActive ? activeClassName : inactiveClassName
            } ${itemClassName}`}
          >
            {IconComponent && (
              <IconComponent
                className="shrink-0"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
            {item.label}
            {isActive && showActiveIndicator && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-0.5 bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}


interface DrawerSectionDividerProps {
  title?: string;
  titleClassName?: string;
  className?: string;
  marginY?: string;
  paddingY?: string;
}

export function DrawerSectionDivider({
  title,
  titleClassName = "text-xs",
  className = "",
  marginY = "my-1",
  paddingY = "",
}: DrawerSectionDividerProps) {
  return (
    <div className={`border-t border-border ${marginY} ${paddingY} ${className}`}>
      {title && (
        <div
          className={`px-4 py-2 ${titleClassName} font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer`}
        >
          {title}
        </div>
      )}
    </div>
  );
}


interface DrawerNavContainerProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  gap?: string;
}

export function DrawerNavContainer({
  children,
  className = "",
  padding = "py-2",
  gap = "",
}: DrawerNavContainerProps) {
  return (
    <nav className={`flex flex-col ${padding} ${gap} overflow-y-auto h-full ${className}`}>
      {children}
    </nav>
  );
}


export default DrawerWrapper;
