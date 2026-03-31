// middleware/permission.middleware.ts

import { NextFunction, Request, Response } from "express";

export function authorizePermissions(
  requiredPermissions: string[] | string,
  options: { mode?: "ALL" | "ANY" } = {},
) {
  const { mode = "ALL" } = options;

  // Normalize input → always array
  const permissionsToCheck = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // 1. Check authentication
      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const userPermissions = user.permissions || [];

      // 2. Optional: Admin bypass (very common)
      if (user.roles?.includes("admin")) {
        return next();
      }

      // 3. Permission check
      let hasPermission = false;

      if (mode === "ALL") {
        // user must have ALL permissions
        hasPermission = permissionsToCheck.every((p) =>
          userPermissions.includes(p),
        );
      } else {
        // user must have ANY one permission
        hasPermission = permissionsToCheck.some((p) =>
          userPermissions.includes(p),
        );
      }

      // 4. Deny if not allowed
      if (!hasPermission) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
          required: permissionsToCheck,
          userPermissions,
        });
      }
      // 5. Allow
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
}
