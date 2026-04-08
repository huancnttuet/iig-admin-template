import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getCookie,
  REFRESH_TOKEN_KEY,
  getAccessToken,
  removeAuthToken,
  setAuthToken,
} from '@/lib/cookies';
import { AppRoutes } from '@/configs/routes';

// Create axios instance with default config
export const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Enable sending cookies with requests
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
baseApi.interceptors.request.use(
  (config) => {
    // Add auth token from cookie if available
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return baseApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // No refresh token, redirect to login
        removeAuthToken();

        window.location.href = AppRoutes.SignIn;

        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SSO_TOKEN_API}`,
          {
            refreshToken,
            grantType: 'refresh_token',
            clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
          },
        );

        const data = response.data;

        // Save new tokens
        setAuthToken(data);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;
        }

        // Process queued requests
        processQueue(null, data?.accessToken);

        // Retry original request
        return baseApi(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        processQueue(refreshError as AxiosError, null);

        removeAuthToken();

        window.location.href = AppRoutes.SignIn;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

export default baseApi;
