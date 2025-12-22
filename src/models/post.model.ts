import { z } from "zod";
import { UserIdSchema } from "./user.model.ts";
import { CreatedAt, UpdatedAt } from "./index.model.ts";

export const PostIdSchema = z.number().int().positive().brand<"PostId">();
export type PostId = z.infer<typeof PostIdSchema>;

export const TitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(255, "Title must be less than 255 characters")
  .trim();

export const ContentSchema = z.string().min(1, "Content is required");

export const PostSchema = z.object({
  id: PostIdSchema,
  title: TitleSchema,
  content: ContentSchema,
  authorId: UserIdSchema,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
});
export type Post = z.infer<typeof PostSchema>;

export const CreatePostSchema = z.object({
  title: TitleSchema,
  content: ContentSchema,
  authorId: UserIdSchema,
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  title: TitleSchema,
  content: ContentSchema,
  authorId: UserIdSchema,
});
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;

export const PostParamsSchema = z.object({
  id: z.coerce.number().int().positive().brand<"PostId">(),
});
export type PostParams = z.infer<typeof PostParamsSchema>;

export interface PaginatedPosts {
  posts: Post[];
  total: number;
}
