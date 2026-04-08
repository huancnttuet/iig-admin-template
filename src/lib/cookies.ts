/**
 * Cookie utilities for authentication token management
 * Works in both client and server (middleware) contexts
 */

import { SSOExchangeResponse } from '@/features/auth';

// Cookie name for auth token
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Set authentication token in cookie (client-side)
 */
export function setAuthToken(res: SSOExchangeResponse): void {
  setCookie(ACCESS_TOKEN_KEY, res.accessToken, 60); // 60 seconds
  setCookie(REFRESH_TOKEN_KEY, res.refreshToken, 7 * 24 * 60 * 60); // 7 days
}

/**
 * Get authentication token from cookie (client-side)
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${ACCESS_TOKEN_KEY}=`),
  );

  if (!authCookie) return null;

  return authCookie.split('=')[1] || null;
}

/**
 * Remove authentication token from cookie (client-side)
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${ACCESS_TOKEN_KEY}=; max-age=0; path=/`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; max-age=0; path=/`;
}

/**
 * Get authentication token from request cookies (server-side)
 */
export function getAccessTokenFromRequest(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${ACCESS_TOKEN_KEY}=`),
  );

  if (!authCookie) return null;

  return authCookie.split('=')[1] || null;
}

/**
 * Set  token from request cookies (client-side)
 */
export function setCookie(
  key: string,
  token: string,
  expiredDuration = 24 * 60 * 60,
): void {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + expiredDuration * 1000); // expiredDuration in minutes
  const isHttps = window.location.protocol === 'https:';
  let cookie = `${key}=${token}; path=/; expires=${expires.toUTCString()}`;
  if (isHttps) {
    cookie += '; secure; samesite=none';
  } else {
    cookie += '; samesite=lax';
  }
  document.cookie = cookie;
}

/**
 * Remove  token from cookie (client-side)
 */
export function removeCookie(key: string): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${key}=; max-age=0; path=/`;
}

/**
 * Get  token from cookie (client-side)
 */
export function getCookie(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const targetCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${key}=`),
  );
  if (!targetCookie) return null;
  return targetCookie.split('=')[1] || null;
}
