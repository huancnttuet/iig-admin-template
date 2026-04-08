import { useCallback } from 'react';
import { PermissionCodeType } from '@/configs/permissions';
import { PermissionCheckResult } from './permission.type';
import { getPermissions } from '@/lib/storage';

/**
 * Hook to check user permissions
 * This is a placeholder implementation - you should integrate with your actual auth system
 */
export function usePermission() {
  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: PermissionCodeType): boolean => {
      // TODO: Implement actual permission check against user's permissions
      const userPermissions = getPermissions();

      // if (
      //   process.env.NODE_ENV === 'development' ||
      //   process.env.NEXT_PUBLIC_PERMISSION_ENABLED === 'false'
      // ) {
      //   return true;
      // }

      return userPermissions.includes(permission);
    },
    [],
  );

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: PermissionCodeType[]): boolean => {
      return permissions.every((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: PermissionCodeType[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  /**
   * Check permissions and return detailed result
   */
  const checkPermissions = useCallback(
    (permissions: PermissionCodeType[]): PermissionCheckResult => {
      const missingPermissions = permissions.filter(
        (permission) => !hasPermission(permission),
      );

      return {
        hasPermission: missingPermissions.length === 0,
        missingPermissions:
          missingPermissions.length > 0 ? missingPermissions : undefined,
      };
    },
    [hasPermission],
  );

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    checkPermissions,
  };
}
