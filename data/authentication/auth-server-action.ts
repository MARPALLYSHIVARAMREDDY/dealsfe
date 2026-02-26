"use server";

// Server Actions for Authentication Mutations
// Handles profile and preference updates with cache invalidation
// Server-only operations with revalidatePath() and revalidateTag()

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { UserProfile, ProfileUpdatePayload } from "@/types/profile.types";
import type { CompleteProfileRequest, UpdatePreferencesRequest } from "./types";
import { getSessionToken, getUserFromToken } from "@/lib/auth.utils";
import { CACHE_KEYS } from "@/app/cache-keys";

/**
 * Shared fetch utility for mutations
 * Handles authentication, error handling, and response parsing
 */
async function profileFetch<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  body?: any
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const session = await getSessionToken();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: `${session.tokenName}=${session.token}`,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data?.user || data.data,
      message: data.message,
    };
  } catch (error: any) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

/**
 * Update user profile (name, gender, etc.)
 * PUT /api/v1/profile
 *
 * Automatically invalidates cache on success
 */
export async function updateProfile(payload: ProfileUpdatePayload) {
  const result = await profileFetch<UserProfile>(
    "/api/v1/profile",
    "PUT",
    payload
  );
  if (result.success) {
    // Invalidate cache to ensure fresh data on next fetch
    revalidateTag(CACHE_KEYS.USER_PROFILE, "default");
  }

  return result;
}

/**
 * Complete user profile with personal details and preferences
 * POST /api/v1/auth/complete-profile
 *
 * Required fields: categoryIds, storeIds, brandIds
 * Optional fields: firstName, lastName, gender, mobileNotifications, newsletterSubscription
 *
 * Automatically invalidates cache on success
 */
export async function completeProfile(payload: CompleteProfileRequest) {
  const result = await profileFetch<UserProfile>(
    "/api/v1/auth/complete-profile",
    "POST",
    payload
  );
  if (result.success) {
    // Invalidate cache to ensure fresh data on next fetch
    console.log("results", result);
    revalidateTag(CACHE_KEYS.USER_PROFILE, "default");
  }

  return result;
}

/**
 * Save user preferences (categories, stores, brands)
 * POST /api/v1/profile/preferences
 *
 * Automatically invalidates cache on success
 */
export async function savePreferences(payload: UpdatePreferencesRequest) {
  const result = await profileFetch<UserProfile>(
    "/api/v1/profile/preferences",
    "POST",
    payload
  );

  if (result.success) {
    // Invalidate cache to ensure fresh data on next fetch
    revalidateTag(CACHE_KEYS.USER_PROFILE, "default");
  }

  return result;
}

/**
 * Sign out user and invalidate cache
 * NOTE: Cookie clearing is handled by /api/auth/logout API route
 * This action only invalidates cache and redirects
 *
 * @throws NEXT_REDIRECT - Always redirects after logout
 */
export async function signOutAction(): Promise<never> {
  try {
    console.log("[signOutAction] Starting cache invalidation");

    // Invalidate cache tags
    try {
      console.log(
        `[signOutAction] Invalidating cache: ${CACHE_KEYS.USER_PROFILE}`
      );
      revalidateTag(CACHE_KEYS.USER_PROFILE, "default");

      console.log("[signOutAction] Cache invalidation complete");
    } catch (cacheError) {
      console.error("[signOutAction] Cache invalidation error:", cacheError);
    }
  } catch (error: any) {
    console.error("[signOutAction] Unexpected error:", error);
  }

  // Redirect with cache-busting parameter to prevent RSC caching
  console.log("[signOutAction] Redirecting to home");
  redirect(`/?ts=${Date.now()}`);
}
