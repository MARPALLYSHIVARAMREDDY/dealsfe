"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { useMobileKeyboard } from "@/hooks/use-mobile-keyboard";

interface MobileKeyboardContextValue {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  isMobile: boolean;
}

const MobileKeyboardContext = createContext<MobileKeyboardContextValue>({
  isKeyboardVisible: false,
  keyboardHeight: 0,
  isMobile: false,
});

export function useMobileKeyboardContext() {
  return useContext(MobileKeyboardContext);
}

interface MobileKeyboardProviderProps {
  children: ReactNode;
}

/**
 * Detects if the current device is iOS
 */
function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function MobileKeyboardProvider({
  children,
}: MobileKeyboardProviderProps) {
  const keyboardState = useMobileKeyboard();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  // Update CSS custom properties and body class
  useEffect(() => {
    if (!keyboardState.isMobile) return;

    const root = document.documentElement;
    const body = document.body;

    // Set CSS custom property for keyboard height
    root.style.setProperty(
      "--keyboard-height",
      `${keyboardState.keyboardHeight}px`
    );

    // Add/remove keyboard-visible class on body
    if (keyboardState.isKeyboardVisible) {
      body.classList.add("keyboard-visible");
    } else {
      body.classList.remove("keyboard-visible");
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty("--keyboard-height");
      body.classList.remove("keyboard-visible");
    };
  }, [keyboardState.isKeyboardVisible, keyboardState.keyboardHeight, keyboardState.isMobile]);

  // Global focus handler for all inputs
  useEffect(() => {
    if (!keyboardState.isMobile) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      // Check if the focused element is an input, textarea, or contenteditable
      const isInputElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (!isInputElement) return;

      // Clear any pending scroll operations
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Determine delay based on platform
      // iOS needs longer delay for keyboard animation
      const scrollDelay = isIOSDevice() ? 300 : 100;

      scrollTimeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(() => {
          // Check if element is still focused
          if (document.activeElement === target) {
            // Get the element's position relative to viewport
            const rect = target.getBoundingClientRect();
            const viewportHeight = window.visualViewport?.height || window.innerHeight;

            // If element is in bottom half or below viewport, scroll it into view
            if (rect.bottom > viewportHeight / 2) {
              target.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          }
        });
      }, scrollDelay);
    };

    // Add global focus listener with capture phase
    document.addEventListener("focusin", handleFocusIn, true);

    return () => {
      document.removeEventListener("focusin", handleFocusIn, true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [keyboardState.isMobile]);

  return (
    <MobileKeyboardContext.Provider value={keyboardState}>
      {children}
    </MobileKeyboardContext.Provider>
  );
}
