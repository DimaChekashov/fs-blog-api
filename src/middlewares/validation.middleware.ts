import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, ZodType, z } from "zod";

type ValidationSchema = ZodObject<{
  body?: ZodType<any, any>;
  query?: ZodType<any, any>;
  params?: ZodType<any, any>;
}>;

export const validate =
  (schema: ValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: z.infer<typeof schema> = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = result.body ?? req.body;
      if (result.query) {
        Object.assign(req.query, result.query);
      }

      if (result.params) {
        Object.assign(req.params, result.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      } else {
        next(error);
      }
    }
  };
