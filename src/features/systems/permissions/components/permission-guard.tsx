import React, { ReactNode } from 'react';
import { usePermission } from '../permission.query';
import { PermissionCodeType } from '@/configs/permissions';
import { useLogout } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PermissionGuardProps {
  /**
   * Single permission or array of permissions to check
   */
  permissions: PermissionCodeType[] | PermissionCodeType;
  /**
   * Check mode: 'all' requires all permissions, 'any' requires at least one
   */
  mode?: 'all' | 'any';
  /**
   * Content to render when user has permission
   */
  children: ReactNode;
  /**
   * Optional fallback content to render when user lacks permission
   */
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 *
 * @example
 * // Require single permission
 * <PermissionGuard permissions={PermissionCode.USER_VIEW}>
 *   <UserList />
 * </PermissionGuard>
 *
 * @example
 * // Require all permissions
 * <PermissionGuard permissions={[PermissionCode.USER_VIEW, PermissionCode.USER_EDIT]} mode="all">
 *   <UserEditForm />
 * </PermissionGuard>
 *
 * @example
 * // Require any permission with fallback
 * <PermissionGuard
 *   permissions={[PermissionCode.ROLE_ADD, PermissionCode.ROLE_EDIT]}
 *   mode="any"
 *   fallback={<NoAccess />}
 * >
 *   <RoleForm />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permissions,
  mode = 'all',
  children,
  fallback = <FallBackDefault />,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermission();

  if (!permissions?.length) return <>{children}</>;

  // Normalize permissions to array
  const permissionArray = Array.isArray(permissions)
    ? permissions
    : [permissions];

  // Check permissions based on mode
  const hasAccess =
    mode === 'all'
      ? permissionArray.length === 1
        ? hasPermission(permissionArray[0])
        : hasAllPermissions(permissionArray)
      : hasAnyPermission(permissionArray);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

function FallBackDefault() {
  const t = useTranslations();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div
      className='flex h-[calc(100vh-200px)] flex-col items-center justify-center
        gap-6'
    >
      <div className='flex flex-col items-center gap-3'>
        <ShieldX className='h-16 w-16 text-red-500' />
        <h2 className='text-xl font-semibold text-red-500'>
          {t('permissions.denied')}
        </h2>
        <p className='max-w-md text-center text-sm text-gray-500'>
          {t('permissions.loginAgainMessage')}
        </p>
      </div>
      <Button
        variant='destructive'
        onClick={() => logout()}
        disabled={isPending}
        className='flex items-center gap-2'
      >
        <LogOut className='h-4 w-4' />
        {isPending ? t('common.loading') : t('auth.logout')}
      </Button>
    </div>
  );
}
