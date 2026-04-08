import { AppRoutes } from './routes';

/**
 * Permission modules - Grouping permissions by feature/resource
 */
export const PermissionModule = {
  USER: 'User',
  ROLE: 'Role',
} as const;

/**
 * Permission codes - Specific permissions for each module
 */
export const PermissionCode = {
  // User permissions
  USER_VIEW: 'user:view',
  USER_ASSIGN_ROLE: 'user:assign_role',
  USER_REMOVE_ROLE: 'user:remove_role',
  USER_SYNC: 'user:sync',

  // Role permissions
  ROLE_VIEW: 'role:view',
  ROLE_ADD: 'role:add',
  ROLE_EDIT: 'role:edit',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN_USER: 'role:assign_user',
  ROLE_REMOVE_USER: 'role:remove_user',
} as const;

export const PermissionRoutes: Record<string, PermissionCodeType[]> = {
  [AppRoutes.Users]: [PermissionCode.USER_VIEW],
};

// Type definitions for type safety
export type PermissionModuleType =
  (typeof PermissionModule)[keyof typeof PermissionModule];
export type PermissionCodeType =
  (typeof PermissionCode)[keyof typeof PermissionCode];
