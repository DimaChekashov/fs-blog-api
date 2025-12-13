// export interface Post {
//   id: number;
//   title: string;
//   created_at: Date;
// }

export class GetPostDto {
  constructor(public readonly id: number) {}
}

export class CreatePostDto {
  constructor(public readonly title: string) {}
}

export class UpdatePostDto {
  constructor(public readonly id: number, public readonly title: string) {}
}

export class DeletePostDto {
  constructor(public readonly id: number) {}
}

import { z } from "zod";

export const PostIdSchema = z.number().int().positive().brand<"PostId">();
export type PostId = z.infer<typeof PostIdSchema>;

export const TitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(255, "Title must be less than 255 characters")
  .trim();

export const PostSchema = z.object({
  id: PostIdSchema,
  title: TitleSchema,
});
export type Post = z.infer<typeof PostSchema>;

export const PostQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  authorId: z.string().optional(),
  search: z.string().optional(),
});
export type PostQuery = z.infer<typeof PostQuerySchema>;
