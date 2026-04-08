'use client';

import { generateRandomString } from '@/lib/utils';
import { useEffect } from 'react';

const loginWithSSO = () => {
  const state = generateRandomString(32);
  sessionStorage.setItem('oauth_state', state);

  // Build authorization URL
  const authUrl = new URL(
    `${process.env.NEXT_PUBLIC_SSO_LOGIN_PAGE}/authorize`,
  );
  authUrl.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_SSO_CLIENT_ID || '',
  );

  authUrl.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_SSO_REDIRECT_URI || '',
  );
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', process.env.NEXT_PUBLIC_SSO_SCOPE || '');
  authUrl.searchParams.set('state', state);

  // Redirect to SSO immediately
  window.location.href = authUrl.toString();
};

export default function SSOLoginPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      loginWithSSO();
    }, 500); // Redirect after 0.5 second
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex h-screen items-center justify-center'>
      Đang chuyển hướng đến hệ thống xác thực...
    </div>
  );
}
