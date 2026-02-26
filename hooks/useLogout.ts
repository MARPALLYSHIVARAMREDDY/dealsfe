import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/auth-store';

/**
 * Shared logout hook used across all components
 * Handles the complete logout flow:
 * 1. Calls API route to clear browser cookies
 * 2. Calls Redux signOut thunk to invalidate cache and redirect
 */
export function useLogout() {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(async () => {
    try {
      console.log("[useLogout] Starting logout");

      // STEP 1: Call API route to clear cookies
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        const result = await response.json();

        if (!result.success) {
          console.error("[useLogout] API logout failed:", result.error);
        } else {
          console.log("[useLogout] API logout successful");
        }
      } catch (apiError) {
        console.error("[useLogout] API call error:", apiError);
      }

      // STEP 2: Call Redux signOut thunk
      await dispatch(signOut()).unwrap();
    } catch (error: any) {
      if (!error.message?.includes('NEXT_REDIRECT')) {
        console.error("[useLogout] Unexpected error, forcing navigation:", error);
        window.location.href = `/?ts=${Date.now()}`;
      }
    }
  }, [dispatch]);

  return handleLogout;
}
