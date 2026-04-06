import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type ValidationContext = "body" | "query" | "params";

type SchemaMap = Partial<Record<ValidationContext, ZodType>>;

export const validator = (schemas: SchemaMap) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const validated = await schemas.body.parseAsync(req.body);
        req.body = validated as Request["body"];
      }

      if (schemas.query) {
        const validated = await schemas.query.parseAsync(req.query);
        Object.assign(req.query, validated);
      }

      if (schemas.params) {
        const validated = await schemas.params.parseAsync(req.params);
        req.params = validated as Request["params"];
      }

      next();
    } catch (error) {
      return next(error);
    }
  };
};
