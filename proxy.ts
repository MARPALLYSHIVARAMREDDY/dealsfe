import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  type LocaleCode,
} from "./lib/locale-utils";

// List of routes that require authentication
const AUTHENTICATED_ROUTES = [
  "/profile",
  // Add more as needed
];

// Routes that should bypass locale routing
const LOCALE_EXEMPT_ROUTES = ["/auth", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // LOCALE-EXEMPT ROUTES
  // ============================================
  // Check if the route should bypass locale routing
  const isExemptRoute = LOCALE_EXEMPT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isExemptRoute) {
    // Handle auth checks without locale prefix
    return handleAuthChecksWithoutLocale(request, pathname);
  }

  // ============================================
  // LOCALE HANDLING (i18n)
  // ============================================

  // Extract first segment from pathname
  const firstSegment = pathname.split("/")[1];

  // Check if first segment is a valid locale (us, in, gb, au)
  // Only treat as locale if it's ACTUALLY in our supported locales
  // This prevents /deals, /sales, /coupons from being treated as locales
  const pathnameHasLocale =
    firstSegment && firstSegment.length === 2 && isValidLocale(firstSegment);

  if (pathnameHasLocale) {
    // Extract path without locale (safe because we validated firstSegment is a valid locale)
    const pathWithoutLocale = pathname.substring(firstSegment.length + 1);

    // Redirect locale-prefixed exempt routes to non-locale versions
    if (
      LOCALE_EXEMPT_ROUTES.some((route) => pathWithoutLocale.startsWith(route))
    ) {
      return NextResponse.redirect(new URL(pathWithoutLocale, request.url));
    }

    // Valid locale - set cookie and continue to auth check
    const response = handleAuthChecks(request, pathname, firstSegment);
    response.cookies.set("NEXT_LOCALE", firstSegment, {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // No locale prefix - redirect to /us/ (default)
  // Examples: / → /us/, /deals → /us/deals, /profile → /us/profile
  const newUrl = new URL(
    `/us${pathname === "/" ? "/" : pathname}`,
    request.url
  );
  const response = NextResponse.redirect(newUrl);
  response.cookies.set("NEXT_LOCALE", "us", {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

/**
 * Handle authentication checks
 * Extracted to allow locale handling to wrap it
 */
function handleAuthChecks(
  request: NextRequest,
  pathname: string,
  locale: string
) {
  // All locales now have prefixes: "/us/profile", "/in/profile", etc.
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, ""); // e.g., "/us/profile" -> "/profile"

  // Dynamically determine cookie name based on protocol
  const isHttps =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  const tokenName = isHttps
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";
  const session = request.cookies.get(tokenName);

  // If authenticated and visiting /auth, redirect to home (preserve locale)
  if (pathWithoutLocale.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  // Only check for protected routes (check path without locale)
  const isProtected = AUTHENTICATED_ROUTES.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  if (!session) {
    // Not authenticated, redirect to /auth (preserve locale)
    const url = new URL(`/${locale}/auth`, request.url);
    url.searchParams.set("redirect", pathname); // Full path with locale
    return NextResponse.redirect(url);
  }

  // Authenticated, allow request
  return NextResponse.next();
}

/**
 * Handle authentication checks for locale-exempt routes
 * These routes don't have locale prefixes: /auth, /profile
 */
function handleAuthChecksWithoutLocale(request: NextRequest, pathname: string) {
  // Determine cookie name based on protocol
  const isHttps =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  const tokenName = isHttps
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";
  const session = request.cookies.get(tokenName);
  const isAuthenticated = !!session;

  // Redirect authenticated users from /auth to home (default locale)
  if (pathname.startsWith("/auth") && isAuthenticated) {
    return NextResponse.redirect(new URL("/us/", request.url));
  }

  // Redirect unauthenticated users from /profile to /auth
  if (pathname.startsWith("/profile") && !isAuthenticated) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - images (public images directory)
     * - Files with extensions (e.g., .png, .jpg, .css, .js)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
  ],
};
