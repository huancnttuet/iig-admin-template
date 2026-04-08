/**
 * Utility functions for working with permissions
 */

import { PermissionCode, PermissionModule } from '@/configs/permissions';
import { Permission } from './permission.type';

/**
 * Get all permissions for a specific module
 */
export function getPermissionsByModule(module: string): string[] {
  const permissions: string[] = [];

  Object.entries(PermissionCode).forEach(([, value]) => {
    if (value.startsWith(module.toLowerCase())) {
      permissions.push(value);
    }
  });

  return permissions;
}

/**
 * Parse permission code to get module and action
 */
export function parsePermissionCode(code: string): {
  module: string;
  action: string;
} {
  const [module, action] = code.split(':');
  return { module, action };
}

/**
 * Get module name by permission code
 */
export function getModuleByPermissionCode(code: string): string | undefined {
  const { module } = parsePermissionCode(code);

  // Convert snake_case to PascalCase and match with module
  const moduleName = module
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return Object.values(PermissionModule).find(
    (m) => m.toLowerCase().replace(/[^a-z]/g, '') === moduleName.toLowerCase(),
  );
}

/**
 * Group permissions by module
 */
export function groupPermissionsByModule(
  permissions: Permission[],
): Record<string, Permission[]> {
  return permissions.reduce(
    (acc, permission) => {
      const moduleName = permission.module;
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );
}

/**
 * Format permission code to human-readable name
 */
export function formatPermissionName(code: string): string {
  const { module, action } = parsePermissionCode(code);

  // Format module name
  const formattedModule = module
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Format action name
  const formattedAction = action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `${formattedModule} - ${formattedAction}`;
}
