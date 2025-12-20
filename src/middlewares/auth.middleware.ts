import { jwtSecret } from "@/consts.ts";
import { TokenRepository } from "@/repositories/token.repository.ts";
import { ApiError } from "@/utils/errors.ts";
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

type UserJwtPayload = JwtPayload & { sub: number };

declare global {
  namespace Express {
    interface Request {
      user: UserJwtPayload;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "No token provided!");
  }

  const tokenRepository = new TokenRepository();
  const isTokenBlacklisted = await tokenRepository.isTokenBlacklisted(token);
  if (isTokenBlacklisted) {
    throw new ApiError(401, "Token revoked!");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded as UserJwtPayload;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token!");
  }
};
