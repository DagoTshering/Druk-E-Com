// utils/assignRole.ts
import { db } from '../../../shared/database/connection';
import { roles, userRoles } from '../models';
import { eq } from 'drizzle-orm';

export async function assignRoleToUser(userId: string, roleSlug: string) {
  const role = await db.query.roles.findFirst({
    where: eq(roles.slug, roleSlug)
  });

  if (!role) throw new Error('Role not found');

  await db.insert(userRoles).values({
    userId,
    roleId: role.id
  });

  return role;
}