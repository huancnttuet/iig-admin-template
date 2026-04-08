import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes } from './configs/routes';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './lib/cookies';

// Define protected routes that require authentication
const protectedRoutes = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    // Try to refresh token if refresh token exists
    if (refreshToken) {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_SSO_TOKEN_API;
        const response = await fetch(`${apiBaseUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken,
            grantType: 'refresh_token',
            clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newToken = data.accessToken;
          const newRefreshToken = data.refreshToken;

          // Create response and set new tokens
          const nextResponse = NextResponse.next();

          nextResponse.cookies.set(ACCESS_TOKEN_KEY, newToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
          });

          nextResponse.cookies.set(REFRESH_TOKEN_KEY, newRefreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });

          return nextResponse;
        }
      } catch (error) {
        console.error('Token refresh failed in middleware:', error);
      }
    }

    // If refresh failed or no refresh token, redirect to login
    const loginUrl = new URL(AppRoutes.SignIn, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = pathname === AppRoutes.SignIn || pathname === '/';

  // If user is authenticated and trying to access auth routes (like sign-in or sign-up)
  if (isAuthRoute && token) {
    const homeUrl = new URL(AppRoutes.Dashboard, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|otf)$).*)',
  ],
};
