import { useState, useEffect, useRef, useCallback } from 'react';
import type { UserProfile } from '@/types/profile.types';
import {
  loadTimerData,
  saveDismissTimestamp,
  saveProfileExitTimestamp,
  clearTimerData,
  isDismissCooldownActive,
  isProfileCooldownActive,
  isOtpLoginCooldownActive,
} from '@/lib/preference-timer-storage';

interface UsePreferenceTimerReturn {
  canShow: boolean;
  handleDismiss: () => void;
  handleSuccess: () => void;
}

/**
 * Custom hook to manage preference popup timer logic
 *
 * @param user - Current user profile from Redux
 * @param pathname - Current route pathname
 * @returns Object with canShow state and handler functions
 */
export function usePreferenceTimer(
  user: UserProfile | null,
  pathname: string
): UsePreferenceTimerReturn {
  const [canShow, setCanShow] = useState(false);
  const previousPathnameRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check if current route is excluded from showing popup
   */
  const isExcludedRoute = useCallback((path: string): boolean => {
    return path.startsWith('/profile') || path.startsWith('/auth');
  }, []);

  /**
   * Evaluate all conditions to determine if popup should show
   */
  const evaluateConditions = useCallback((): boolean => {
    // User must be logged in
    if (!user) {
      return false;
    }

    
    // User must not have selected preferences yet

    if(!user.profileCompleted){
      return false
    }
    if (user.preferencesSelected) {
      return false;
    }

    // Route must not be excluded
    if (isExcludedRoute(pathname)) {
      return false;
    }

    // Check OTP login cooldown (5 minutes)
    if (isOtpLoginCooldownActive()) {
      return false;
    }

    // Check dismiss cooldown (5 minutes)
    if (isDismissCooldownActive()) {
      return false;
    }

    // Check profile cooldown (30 seconds)
    if (isProfileCooldownActive()) {
      return false;
    }

    // All conditions passed
    return true;
  }, [user, pathname, isExcludedRoute]);

  /**
   * Track profile route exits
   */
  useEffect(() => {
    const previousPathname = previousPathnameRef.current;

    if (previousPathname !== null) {
      const wasOnProfile = previousPathname.startsWith('/profile');
      const isOnProfile = pathname.startsWith('/profile');

      // User just left profile route
      if (wasOnProfile && !isOnProfile) {
        saveProfileExitTimestamp();
      }
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  /**
   * Set up interval to check conditions every second
   */
  useEffect(() => {
    // Initial check
    setCanShow(evaluateConditions());

    // Check every second
    intervalRef.current = setInterval(() => {
      const shouldShow = evaluateConditions();
      setCanShow(shouldShow);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [evaluateConditions]);

  /**
   * Listen for storage events (multi-tab sync)
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preference_popup_timer') {
        // Another tab updated timer data - re-evaluate conditions
        setCanShow(evaluateConditions());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [evaluateConditions]);

  /**
   * Handle popup dismissal (user closes without saving)
   */
  const handleDismiss = useCallback(() => {
    saveDismissTimestamp();
    setCanShow(false);
  }, []);

  /**
   * Handle successful preference save
   */
  const handleSuccess = useCallback(() => {
    clearTimerData();
    setCanShow(false);
  }, []);

  return {
    canShow,
    handleDismiss,
    handleSuccess,
  };
}
