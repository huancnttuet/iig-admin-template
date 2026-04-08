import type { ApiResponse } from '@/types/api';
import type {
  LoginInput,
  LoginResponse,
  SSOExchangeResponse,
} from './auth.type';
import baseApi from '@/apis/base-api';
import { SSOApi } from '@/apis/sso-api';

export const authApi = {
  // Login
  login: async (data: LoginInput) => {
    const response = await baseApi.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await baseApi.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response =
      await baseApi.get<ApiResponse<LoginResponse['user']>>('/auth/me');
    return response.data.data;
  },

  getProfile: async () => {
    const response = await baseApi.get<LoginResponse>('/auth/profile');
    return response.data;
  },
};

export const coreAuthApi = {
  // SSO Token Exchange
  ssoTokenExchange: async (code: string) => {
    const response = await SSOApi.post<SSOExchangeResponse>('', {
      grantType: 'authorization_code',
      code,
      clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_SSO_REDIRECT_URI,
    });
    return response.data;
  },
};
