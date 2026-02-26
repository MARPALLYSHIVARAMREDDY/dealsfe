// Server-Side Authentication Data Fetching
// SSR/RSC data loading for profile and preferences
// Server-only operations (not for client components)

import 'server-only'
import { cacheLife, cacheTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import type { UserProfile } from '@/types/profile.types';
import { CACHE_KEYS } from '@/app/cache-keys';
import { getSessionToken, getUserFromToken } from '@/lib/auth.utils';

/**
 * Check if the user is authenticated based on session cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionToken();
  return !!session;
}

/**
 * Fetch user profile (cached implementation)
 * Internal function with 'use cache' directive
 */
async function fetchProfileData(sessionToken: string, tokenName: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookie': `${tokenName}=${sessionToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('- API Error:', response.status, errorText);
      if (response.status === 401) {
        console.log('Unauthorized - session invalid');
      }
      return null;
    }

    const data = await response.json();

    return data?.data?.user ?? null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Get user profile (server-side)
 * GET /api/v1/profile
 *
 * Retrieves session from cookies and fetches cached profile data
 */
export async function getProfile(): Promise<UserProfile | null> {
  const session = await getSessionToken();

  if (!session) return null;

  return fetchProfileData(session.token, session.tokenName);
}

/**
 * Get user profile from JWT token (fast, no API call)
 * Returns cached user data from JWT without hitting the API
 *
 * Use this when:
 * - You need fast access to user data
 * - Slightly stale data is acceptable
 * - You want to reduce API load
 *
 * Use getProfile() when:
 * - You need guaranteed fresh data
 * - You're displaying critical user information
 *
 * @returns User profile from JWT or null if token invalid
 */
export async function getProfileFromToken(): Promise<UserProfile | null> {
  const userData = await getUserFromToken();

  if (!userData) {
    return null;
  }

  // Map JWT payload to UserProfile type
  // JWT has all fields that UserProfile needs
  return {
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    name: userData.name,
    email: userData.email,
    emailVerified: userData.emailVerified,
    phone: userData.phoneNumber,
    phoneNumber: userData.phoneNumber,
    phoneNumberVerified: userData.phoneNumberVerified,
    countryCode: '', // Not in JWT, would need separate source
    country: '', // Not in JWT, would need separate source
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    gender: userData.gender,
    status: userData.status,
    detailsVerified: userData.detailsVerified,
    profileCompleted: userData.profileCompleted,
    isActive: userData.isActive,
    termsAccepted: userData.termsAccepted,
    preferencesSelected: userData.preferencesSelected,
    mobileNotifications: userData.mobileNotifications,
    newsletterSubscription: userData.newsletterSubscription,
    isDeleted: userData.isDeleted,
    preferences: userData.preferences,
  } as UserProfile;
}

/**
 * Get user profile with JWT fallback strategy
 * Tries JWT first for speed, falls back to API if JWT unavailable
 *
 * This provides best-of-both-worlds:
 * - Fast when JWT is available
 * - Reliable fallback to API
 *
 * @returns User profile from JWT or API
 */
export async function getProfileHybrid(): Promise<UserProfile | null> {
  // Try JWT first (fast path)
  const jwtProfile = await getProfileFromToken();
  if (jwtProfile) {
    return jwtProfile;
  }

  // Fallback to API (slow but reliable)
  console.log('JWT unavailable, falling back to API');
  return getProfile();
}

