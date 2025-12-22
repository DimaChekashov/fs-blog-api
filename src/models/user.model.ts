import z from "zod";
import { CreatedAt, UpdatedAt } from "./index.model.ts";

export const UserIdSchema = z.number().int().positive().brand<"UserId">();
export type UserId = z.infer<typeof UserIdSchema>;

export const UsernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(255, "Username must be less than 255 characters")
  .trim();

export const EmailSchema = z.email().trim();

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be less than 255 characters")
  .trim();

export const IsActive = z.boolean();

export const HashedPassword = z.string();

export const UserSchema = z.object({
  id: UserIdSchema,
  username: UsernameSchema,
  email: EmailSchema,
  isActive: IsActive,
  hashedPassword: HashedPassword,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});
export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export const AccessTokenSchema = z.string();
export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const RefreshTokenSchema = z.string();
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const TokensSchema = z.object({
  accessToken: AccessTokenSchema,
  refreshToken: RefreshTokenSchema,
  expiresIn: z.number().positive(),
});
export type Tokens = z.infer<typeof TokensSchema>;

export const RefreshTokenPayloadSchema = z.object({
  refreshToken: RefreshTokenSchema,
});
export type RefreshTokenPayloadDto = z.infer<typeof RefreshTokenPayloadSchema>;

export const AccessTokenResponseSchema = z.object({
  accessToken: AccessTokenSchema,
});
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;

export const UserResponseSchema = UserSchema.omit({ hashedPassword: true });
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  tokens: TokensSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
