import { PermissionCodeType } from '@/configs/permissions';

const STORAGE_KEYS = {
  USERNAME: 'username',
  USER_EMAIL: 'userEmail',
  USER_ID: 'userId',
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
} as const;

/**
 * Save username to localStorage after successful login
 */
export const saveUsername = (username: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  }
};

/**
 * Get saved username from localStorage
 */
export const getUsername = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.USERNAME);
  }
  return null;
};

/**
 * Remove username from localStorage (on logout)
 */
export const removeUsername = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
  }
};

/**
 * Save user email to localStorage
 */
export const saveUserEmail = (email: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
  }
};

/**
 * Get saved user email from localStorage
 */
export const getUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
  }
  return null;
};

/**
 * Remove user email from localStorage
 */
export const removeUserEmail = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
  }
};

/**
 * Save user ID to localStorage
 */
export const saveUserId = (userId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
};

/**
 * Get saved user ID from localStorage
 */
export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  }
  return null;
};

/**
 * Remove user ID from localStorage
 */
export const removeUserId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  }
};

export const getPermissions = (): PermissionCodeType[] => {
  if (typeof window !== 'undefined') {
    const permissions = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    return permissions ? JSON.parse(permissions) : [];
  }
  return [];
};

export const savePermissions = (permissions: PermissionCodeType[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissions));
  }
};

export const removePermissions = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
  }
};

export const getRoles = (): string[] => {
  if (typeof window !== 'undefined') {
    const roles = localStorage.getItem(STORAGE_KEYS.ROLES);
    return roles ? JSON.parse(roles) : [];
  }
  return [];
};

export const saveRoles = (roles: string[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  }
};

export const removeRoles = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ROLES);
  }
};

/**
 * Clear all user-related data from localStorage (on logout)
 */
export const clearUserStorage = (): void => {
  removeUsername();
  removeUserEmail();
  removeUserId();
  removePermissions();
  removeRoles();
};

/**
 * Save all user info to localStorage after login
 */
export const saveUserInfo = (data: {
  userName?: string;
  email?: string;
  userId?: string;
  permissions: PermissionCodeType[];
  roles: string[];
}): void => {
  if (data.userName) saveUsername(data.userName);
  if (data.email) saveUserEmail(data.email);
  if (data.userId) saveUserId(data.userId);

  savePermissions(data.permissions);
  saveRoles(data.roles);
};
