export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}
/**
 * ===========================================
 * EXPRESS REQUEST AUGMENTATION
 * ===========================================
 * 
 * This block extends Express's Request interface to include our user property.
 * 
 * WHAT IT DOES:
 * Without this, TypeScript would error: "Property 'user' does not exist on type 'Request'"
 * 
 * With this declaration, we can safely use: req.user?: JwtPayload
 * 
 * HOW IT WORKS:
 * - "declare global" enters the global type scope
 * - "namespace Express" targets the Express module
 * - "interface Request" extends the existing Request interface
 * - "user?: JwtPayload" adds our custom property
 * 
 * The "export {}" makes this file a module, which is required for
 * "declare global" to work properly.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Empty export makes this file a MODULE (required for "declare global" to work).
 * Without this, TypeScript treats this as a SCRIPT and "declare global" has no effect.
 */
export {};
