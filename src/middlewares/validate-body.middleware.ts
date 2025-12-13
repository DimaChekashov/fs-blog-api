import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, z } from "zod";

type ValidationSchema = ZodObject<any>;

export const validateBody =
  (schema: ValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);

      req.body = validatedData;

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
