import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { getCookieDeletionOptions } from '@/lib/auth.utils';

/**
 * Logout API Route
 * Handles cookie clearing by forwarding Set-Cookie headers from backend to browser
 *
 * This route is necessary because Server Actions cannot directly manipulate
 * response headers to clear HttpOnly cookies in the browser.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Logout API] Starting logout process');

    // Get session token from cookies
    const cookieStore = await cookies();
    const headersList = await headers();

    const isHttps = headersList.get('x-forwarded-proto') === 'https' ||
                    process.env.NODE_ENV === 'production';
    const tokenName = isHttps
      ? '__Secure-better-auth.session_token'
      : 'better-auth.session_token';

    const sessionCookie = cookieStore.get(tokenName);
    console.log(`[Logout API] Session cookie found: ${!!sessionCookie}`);

    // Call backend logout API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionCookie ? `${tokenName}=${sessionCookie.value}` : '',
        },
        credentials: 'include',
      }
    );

    console.log(`[Logout API] Backend response status: ${response.status}`);

    // Create response
    const result = await response.json();
    const nextResponse = NextResponse.json(
      { success: response.ok, message: result.message },
      { status: response.status }
    );

    // CRITICAL: Forward Set-Cookie headers from backend to browser
    const setCookieHeaders = response.headers.getSetCookie();
    console.log(`[Logout API] Set-Cookie headers from backend: ${setCookieHeaders.length}`);

    setCookieHeaders.forEach((cookie) => {
      console.log(`[Logout API] Forwarding Set-Cookie: ${cookie.substring(0, 100)}...`);
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    // Also explicitly delete cookies in Next.js with proper domain scoping
    // This ensures cookies are cleared even if backend doesn't send correct Set-Cookie headers
    const cookieDeleteOptions = getCookieDeletionOptions();
    console.log(`[Logout API] Deleting cookies with options:`, cookieDeleteOptions);
    console.log(`[Logout API] Token name: ${tokenName}`);

    // Set cookies with expired date to delete them
    // Using sameSite: 'none' for cross-subdomain compatibility (dev2.dealsmocktail.com → dev-be.dealsmocktail.com)
    nextResponse.cookies.set(tokenName, '', {
      ...cookieDeleteOptions,
      expires: new Date(0),
      httpOnly: true,
      secure: isHttps,
      sameSite: 'none',
    });

    nextResponse.cookies.set('user_token', '', {
      ...cookieDeleteOptions,
      expires: new Date(0),
      httpOnly: true,
      secure: isHttps,
      sameSite: 'none',
    });

    console.log('[Logout API] Logout complete');
    return nextResponse;
  } catch (error: any) {
    console.error('[Logout API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
