import 'server-only';
import { cookies, headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * JWT Payload structure from user_token cookie
 * Matches the payload structure returned by the backend auth service
 */
export interface JWTUserPayload {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string | null;
    phoneNumberVerified: boolean;
    firstName: string;
    lastName: string;
    status: string;
    detailsVerified: boolean;
    profileCompleted: boolean;
    isActive: boolean;
    termsAccepted: boolean;
    preferencesSelected: boolean;
    gender: 'male' | 'female' | 'others' | null;
    mobileNotifications: boolean;
    newsletterSubscription: boolean;
    isDeleted: boolean;
    preferences: {
      categories: string[];
      stores: string[];
      brands: string[];
    };
  };
  iat: number;  // Issued at (timestamp)
  exp: number;  // Expiration (timestamp)
  aud: string;  // Audience
  iss: string;  // Issuer
}

/**
 * Result of token retrieval operations
 */
export interface TokenResult {
  token: string;
  tokenName: string;
}

/**
 * Result of JWT decoding operations
 */
export interface DecodeResult<T> {
  success: boolean;
  data?: T;
  error?: 'missing' | 'invalid' | 'expired' | 'malformed';
  errorMessage?: string;
}

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

/**
 * Get authenticated session token from cookies
 * Extracted shared utility used by both auth-server-only and auth-server-action
 *
 * @returns Token object or null if not found
 */
export async function getSessionToken(): Promise<TokenResult | null> {
  const cookieStore = await cookies();
  const headersList = await headers();

  const isHttps = headersList.get('x-forwarded-proto') === 'https' ||
                  process.env.NODE_ENV === 'production';
  const tokenName = isHttps
    ? '__Secure-better-auth.session_token'
    : 'better-auth.session_token';

  const sessionCookie = cookieStore.get(tokenName);

  if (!sessionCookie) return null;

  return { token: sessionCookie.value, tokenName };
}

/**
 * Get user JWT token from cookies
 * This token contains encoded user data and can be decoded client-side
 *
 * @returns Token object or null if not found
 */
export async function getUserToken(): Promise<TokenResult | null> {
  const cookieStore = await cookies();

  const userCookie = cookieStore.get('user_token');

  if (!userCookie) return null;

  return { token: userCookie.value, tokenName: 'user_token' };
}

// ============================================================================
// JWT DECODING UTILITIES
// ============================================================================

/**
 * Check if JWT token is expired
 *
 * @param exp - Expiration timestamp from JWT payload
 * @returns True if token is expired
 */
function isTokenExpired(exp: number): boolean {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  return now >= exp;
}

/**
 * Decode and validate JWT user token
 * Handles all error cases: missing token, malformed JWT, expired token
 *
 * @param token - JWT token string to decode
 * @returns DecodeResult with user data or error information
 */
export function decodeUserToken(token: string): DecodeResult<JWTUserPayload> {
  try {
    const decoded = jwtDecode<JWTUserPayload>(token);

    // Validate required fields exist
    if (!decoded.user || !decoded.exp) {
      return {
        success: false,
        error: 'malformed',
        errorMessage: 'JWT payload missing required fields'
      };
    }

    // Check expiration
    if (isTokenExpired(decoded.exp)) {
      return {
        success: false,
        error: 'expired',
        errorMessage: 'JWT token has expired'
      };
    }

    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return {
      success: false,
      error: 'invalid',
      errorMessage: error instanceof Error ? error.message : 'Failed to decode JWT'
    };
  }
}

/**
 * Get user data from JWT cookie (fast, no API call)
 * This is the primary helper function for extracting user data from the JWT
 *
 * Usage:
 * ```typescript
 * const userData = await getUserFromToken();
 * if (userData) {
 *   console.log(userData.email);
 * }
 * ```
 *
 * @returns User payload from JWT or null if token missing/invalid/expired
 */
export async function getUserFromToken(): Promise<JWTUserPayload['user'] | null> {
  const tokenResult = await getUserToken();

  if (!tokenResult) {
    console.warn('User token cookie not found');
    return null;
  }

  const decodeResult = decodeUserToken(tokenResult.token);

  if (!decodeResult.success) {
    console.warn(`JWT decode failed: ${decodeResult.error} - ${decodeResult.errorMessage}`);
    return null;
  }

  return decodeResult.data!.user;
}

/**
 * Get full JWT payload including metadata (iat, exp, aud, iss)
 * Use this when you need access to token metadata, not just user data
 *
 * @returns Full JWT payload or null if token missing/invalid/expired
 */
export async function getFullJWTPayload(): Promise<JWTUserPayload | null> {
  const tokenResult = await getUserToken();

  if (!tokenResult) {
    return null;
  }

  const decodeResult = decodeUserToken(tokenResult.token);

  if (!decodeResult.success) {
    return null;
  }

  return decodeResult.data!;
}

// ============================================================================
// AUTHENTICATION STATUS HELPERS
// ============================================================================

/**
 * Check if user token is present and valid
 * Lightweight check that doesn't require API call
 *
 * @returns True if valid user token exists
 */
export async function hasValidUserToken(): Promise<boolean> {
  const userData = await getUserFromToken();
  return userData !== null;
}

/**
 * Check if user token is expired
 * Useful for proactive token refresh or user notification
 *
 * @returns Object with expiration status for user token
 */
export async function getTokenExpirationStatus(): Promise<{
  userToken: { exists: boolean; expired: boolean; expiresAt?: number };
}> {
  const tokenResult = await getUserToken();

  if (!tokenResult) {
    return {
      userToken: { exists: false, expired: false }
    };
  }

  const decodeResult = decodeUserToken(tokenResult.token);

  if (!decodeResult.success) {
    return {
      userToken: {
        exists: true,
        expired: decodeResult.error === 'expired'
      }
    };
  }

  return {
    userToken: {
      exists: true,
      expired: false,
      expiresAt: decodeResult.data!.exp
    }
  };
}

// ============================================================================
// COOKIE DELETION UTILITIES
// ============================================================================

/**
 * Get cookie deletion options based on environment
 * Ensures cookies are deleted with the same domain/path they were set with
 *
 * CRITICAL: For cookies to be deleted, the deletion request must specify
 * the EXACT SAME Domain and Path attributes as when the cookie was created.
 * Browsers will ignore deletion requests if attributes don't match.
 *
 * @returns Cookie deletion options for Next.js Response.cookies.delete()
 */
export function getCookieDeletionOptions(): {
  domain?: string;
  path: string;
} {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.dealsmocktail.com';

  // For production/HTTPS environments, include domain attribute
  // For localhost, omit domain (uses default: exact hostname)
  return isProduction
    ? { domain: cookieDomain, path: '/' }
    : { path: '/' };
}
