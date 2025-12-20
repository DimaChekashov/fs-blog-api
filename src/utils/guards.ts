import type { JwtPayload } from "jsonwebtoken";

export const isJwtPayload = (
  decoded: string | JwtPayload | null
): decoded is JwtPayload => {
  return (
    decoded !== null &&
    typeof decoded !== "string" &&
    typeof decoded === "object"
  );
};
