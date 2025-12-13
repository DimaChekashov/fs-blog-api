import { ZodQuerySchema, type ZodQuery } from "@/models/endpoints.model.ts";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedQuery: ZodQuery;
    }
  }
}

export const validateQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = ZodQuerySchema.parse(req.query);

    // @ts-ignore
    req.validatedQuery = validatedData;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Ошибка валидации параметров запроса",
        errors: error.issues,
      });
    }
    next(error);
  }
};
