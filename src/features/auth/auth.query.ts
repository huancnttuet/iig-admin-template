import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, coreAuthApi } from './auth.api';
import type { LoginInput } from './auth.type';
import { AppRoutes } from '@/configs/routes';
import {
  setCookie,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  removeAuthToken,
} from '@/lib/cookies';
import { useTranslations } from 'next-intl';
import { clearUserStorage, saveUserInfo } from '@/lib/storage';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      // Save localStorage
      saveUserInfo(response);

      // Save token to cookie
      if (response?.token) {
        setCookie(ACCESS_TOKEN_KEY, response.token);
      }

      // Show success message
      toast.success(t('common.signInSuccess'));

      // Redirect to return URL or dashboard
      const returnUrl = searchParams.get('redirect');
      router.push(returnUrl || AppRoutes.Dashboard);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message || t('auth.loginError');
      toast.error(errorMessage);
    },
  });
};

export const useGetProfile = () => {
  return useMutation({
    mutationFn: () => authApi.getProfile(),
    onSuccess: (response) => {
      // Save user info to localStorage
      saveUserInfo(response);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const t = useTranslations();

  return useMutation({
    // mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Remove token from cookie
      removeAuthToken();

      // Clear localStorage
      clearUserStorage();

      // Show success message
      toast.success(t('common.logoutSuccess'));

      // Redirect to login
      router.push(AppRoutes.Logout);
    },
    onError: () => {
      // Even if logout API fails, still remove token and redirect
      removeAuthToken();

      // Clear localStorage
      clearUserStorage();

      router.push(AppRoutes.Logout);
    },
  });
};

export const useSSOLogin = () => {
  return useMutation({
    mutationFn: coreAuthApi.ssoTokenExchange,

    onSuccess: (response) => {
      // Save token to cookie
      if (response?.accessToken) {
        setCookie(ACCESS_TOKEN_KEY, response.accessToken);
      }

      if (response?.refreshToken) {
        setCookie(REFRESH_TOKEN_KEY, response.refreshToken, 7 * 24 * 60 * 60); // 7 days
      }
    },
  });
};
