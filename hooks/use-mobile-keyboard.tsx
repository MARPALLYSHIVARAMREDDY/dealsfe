"use client";

import { useEffect, useState, useRef, RefObject } from "react";

interface MobileKeyboardState {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  isMobile: boolean;
}

interface ScrollOptions {
  offset?: number;
  smooth?: boolean;
  delay?: number;
}

/**
 * Detects if the current device is a mobile device (iOS or Android)
 */
function detectMobile(): boolean {
  if (typeof window === "undefined") return false;

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isMobileViewport = window.innerWidth < 768;

  return isTouchDevice && isMobileUserAgent && isMobileViewport;
}

/**
 * Detects if the current device is iOS
 */
function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Custom hook for detecting mobile keyboard visibility and height
 */
export function useMobileKeyboard(): MobileKeyboardState {
  const [state, setState] = useState<MobileKeyboardState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    isMobile: false,
  });

  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if mobile device
    const isMobile = detectMobile();
    if (!isMobile) {
      setState({ isKeyboardVisible: false, keyboardHeight: 0, isMobile: false });
      return;
    }

    setState((prev) => ({ ...prev, isMobile: true }));

    // Check if Visual Viewport API is supported
    if (!window.visualViewport) {
      return;
    }

    const checkKeyboardVisibility = () => {
      if (!window.visualViewport) return;

      const windowHeight = window.innerHeight;
      const viewportHeight = window.visualViewport.height;
      const heightDifference = windowHeight - viewportHeight;

      // Keyboard is considered visible if viewport height is significantly smaller
      // than window height (threshold: 150px to avoid false positives)
      const isVisible = heightDifference > 150;
      const keyboardHeight = isVisible ? heightDifference : 0;

      setState({
        isKeyboardVisible: isVisible,
        keyboardHeight,
        isMobile: true,
      });
    };

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        checkKeyboardVisibility();
      }, 150);
    };

    // Handle orientation changes
    const handleOrientationChange = () => {
      // Reset keyboard state
      setState((prev) => ({
        ...prev,
        isKeyboardVisible: false,
        keyboardHeight: 0,
      }));

      // Re-check after device settles
      setTimeout(() => {
        checkKeyboardVisibility();
      }, 500);
    };

    // Add event listeners
    window.visualViewport.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Initial check
    checkKeyboardVisibility();

    // Cleanup
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return state;
}

/**
 * Custom hook for auto-scrolling an element into view when keyboard appears
 * @param elementRef - React ref to the element to scroll into view
 * @param options - Scroll options (offset, smooth, delay)
 */
export function useMobileKeyboardScroll(
  elementRef: RefObject<HTMLElement>,
  options: ScrollOptions = {}
): void {
  const { offset = 20, smooth = true, delay } = options;
  const { isKeyboardVisible, isMobile } = useMobileKeyboard();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMobile || !elementRef.current) return;

    const element = elementRef.current;

    const handleFocus = () => {
      // Clear any pending scroll operations
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Determine delay based on platform
      const scrollDelay = delay ?? (isIOSDevice() ? 300 : 100);

      scrollTimeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(() => {
          // Check if element is still focused
          if (document.activeElement === element) {
            element.scrollIntoView({
              behavior: smooth ? "smooth" : "auto",
              block: "center",
              inline: "nearest",
            });
          }
        });
      }, scrollDelay);
    };

    element.addEventListener("focus", handleFocus);

    return () => {
      element.removeEventListener("focus", handleFocus);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [elementRef, isMobile, isKeyboardVisible, offset, smooth, delay]);
}
