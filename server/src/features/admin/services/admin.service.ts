import { eq } from "drizzle-orm";
import { db } from "../../../shared/database/connection";
import { users } from "../../auth/models";
import { userRoles, roles } from "../../auth/models";

class AdminService {
  public async getUsers() {
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    const userRoleList = await db
      .select({
        userId: userRoles.userId,
        roleName: roles.slug,
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id));

    const roleMap = new Map<string, string[]>();
    userRoleList.forEach(ur => {
      if (ur.userId && ur.roleName) {
        if (!roleMap.has(ur.userId)) {
          roleMap.set(ur.userId, []);
        }
        roleMap.get(ur.userId)!.push(ur.roleName);
      }
    });

    return userList.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles: roleMap.get(user.id) || ["customer"],
      createdAt: user.createdAt,
    }));
  }
}

export const adminService = new AdminService();