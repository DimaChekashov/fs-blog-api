import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AccessToken, RefreshToken, Tokens } from "@/models/user.model.ts";
import { jwtSecret, refreshSecret } from "@/consts.ts";
import { isJwtPayload } from "./guards.ts";

const SALT_ROUNDS = 10;
const SALT_TOKEN_ROUNDS = 2;

export const createToken = (
  payload: string | object | JwtPayload,
  secretKey: string,
  expire: number
) => {
  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: expire,
  });

  return token;
};

export const createTokens = (
  payload: string | object | JwtPayload,
  jwtExpire: number
): Tokens => {
  return {
    accessToken: createToken(payload, jwtSecret, jwtExpire),
    refreshToken: createToken(payload, refreshSecret, 60 * 60 * 24 * 7),
    expiresIn: jwtExpire,
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const hashToken = (token: AccessToken | RefreshToken): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const getTokenExpiresAt = (
  token: AccessToken | RefreshToken,
  secretKey: string
): Date => {
  const decoded = jwt.verify(token, secretKey);

  if (!isJwtPayload(decoded) || !decoded.exp) {
    throw new Error("Invalid token payload!");
  }

  const expiresAt = new Date(decoded.exp * 1000);

  return expiresAt;
};
