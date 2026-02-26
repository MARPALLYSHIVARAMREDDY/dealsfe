'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/auth-store';
import type { UserProfile } from '@/types/profile.types';

interface ProfileInitializerProps {
  profileData: UserProfile | null;
}

/**
 * Client component that initializes the Redux auth store with profile data
 * This runs once when the app loads with server-fetched profile data
 */
export default function ProfileInitializer({ profileData }: ProfileInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only set user if profileData exists AND is not stale
    // This prevents setting stale cached data after logout
    if (profileData) {
      console.log('[ProfileInitializer] Setting user:', profileData.id);
      dispatch(setUser(profileData));
    } else {
      console.log('[ProfileInitializer] No profile data, user logged out');
      // Explicitly set null to ensure store is cleared
      dispatch(setUser(null));
    }
  }, [profileData, dispatch]);

  return null;
}
