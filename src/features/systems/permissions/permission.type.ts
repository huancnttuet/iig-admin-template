import {
  PermissionCodeType,
  PermissionModuleType,
} from '@/configs/permissions';

/**
 * Permission entity
 */
export interface Permission {
  id: string;
  code: PermissionCodeType | string;
  name: string;
  module: PermissionModuleType | string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions?: string[];
}

/**
 * User permissions
 */
export interface UserPermissions {
  userId: string;
  permissions: string[];
}
