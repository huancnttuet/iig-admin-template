import { PermissionCodeType } from '@/configs/permissions';
import { PermissionGuard } from './permission-guard';

type Props = {
  children: React.ReactNode;
  permissions: PermissionCodeType[] | PermissionCodeType;
};

export function PermissionWrapper({ permissions, children }: Props) {
  return (
    <PermissionGuard permissions={permissions} fallback={<></>}>
      {children}
    </PermissionGuard>
  );
}
