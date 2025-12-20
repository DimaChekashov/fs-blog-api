import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Tokens } from "@/models/user.model.ts";
import { jwtSecret, refreshSecret } from "@/consts.ts";

const SALT_ROUNDS = 10;

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
