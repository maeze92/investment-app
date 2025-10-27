import { Role, Permission } from '@/types/enums';

/**
 * Permission mapping for each role
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  system_admin: [
    'manage_groups',
    'manage_companies',
    'manage_users',
    'manage_roles',
    'view_audit_logs',
    'manage_system_settings',
  ],
  vr_approval: ['view_audit_logs'],
  vr_viewer: ['view_audit_logs'],
  cfo: ['view_audit_logs'],
  geschaeftsfuehrer: [],
  cashflow_manager: [],
  buchhaltung: [],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if any of the given roles has a specific permission
 */
export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => roleHasPermission(role, permission));
}

/**
 * Check if a role is an admin role
 */
export function isAdminRole(role: Role): boolean {
  return role === 'system_admin';
}

/**
 * Get all permissions for a set of roles (deduplicated)
 */
export function getPermissionsForRoles(roles: Role[]): Permission[] {
  const allPermissions = roles.flatMap((role) => ROLE_PERMISSIONS[role] || []);
  return Array.from(new Set(allPermissions));
}
