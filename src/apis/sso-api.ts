import axios from 'axios';

export const SSOApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SSO_TOKEN_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

SSOApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
