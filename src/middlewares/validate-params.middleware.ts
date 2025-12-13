import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodObject } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedParams: any;
    }
  }
}

type ValidationSchema = ZodObject<any>;

export const validateParams =
  (schema: ValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateData = await schema.parseAsync(req.params);

      req.validatedParams = validateData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Error validating route parameters",
          errors: error.issues,
        });
      } else {
        next(error);
      }
    }
  };
