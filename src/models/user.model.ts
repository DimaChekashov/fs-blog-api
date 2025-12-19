import z from "zod";

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

export const CreatedAt = z.date();

export const UpdatedAt = z.date();

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
export type LoginUserSchema = z.infer<typeof LoginUserSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema.omit({ hashedPassword: true }),
  // tokens: z.object({
  //   access_token: z.string(),
  //   refresh_token: z.string(),
  //   expires_in: z.number(),
  // }),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
