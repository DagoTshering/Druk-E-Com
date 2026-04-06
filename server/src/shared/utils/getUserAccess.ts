// utils/getUserAccess.ts
import { db } from "../database/connection";
import {
  userRoles,
  roles,
  rolePermissions,
  permissions,
} from "../../features/auth/models";
import { eq } from "drizzle-orm";

export async function getUserAccess(userId: string) {
  const result = await db
    .select({
      role: roles.slug,
      permission: permissions.slug,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));

  // Format result
  const rolesSet = new Set<string>();
  const permissionsSet = new Set<string>();

  for (const row of result) {
    rolesSet.add(row.role);
    permissionsSet.add(row.permission);
  }

  return {
    roles: Array.from(rolesSet),
    permissions: Array.from(permissionsSet),
  };
}
