import { Request, Response, NextFunction } from "express";

export function authorizeRoles(...allowedRoles: string[]) {
  return (req : Request, res : Response, next : NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRoles = user.roles || [];

    const hasRole = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        message: 'Forbidden: insufficient role',
        requiredRoles: allowedRoles,
        userRoles
      });
    }
    next();
  };
}