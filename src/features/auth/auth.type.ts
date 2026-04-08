import { PermissionCodeType } from '@/configs/permissions';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  userId: string;
  email: string;
  userName: string;
  permissions: PermissionCodeType[];
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface SSOExchangeRequest {
  grantType: string;
  code: string;
  clientId: string;
  redirectUri: string;
}
export interface SSOExchangeResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}
