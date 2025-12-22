import { z } from "zod";
import { PostIdSchema } from "./post.model.ts";
import { UserIdSchema } from "./user.model.ts";
import { CreatedAt, UpdatedAt } from "./index.model.ts";

export const CommentIdSchema = z.number().int().positive().brand<"CommentId">();
export type CommentId = z.infer<typeof CommentIdSchema>;

export const MessageSchema = z.string().min(1, "Message is required").trim();

export const CommentSchema = z.object({
  id: CommentIdSchema,
  message: MessageSchema,
  postId: PostIdSchema,
  userId: UserIdSchema,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
});
export type Comment = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = z.object({
  message: MessageSchema,
  postId: PostIdSchema,
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;

export const CommentParamsSchema = z.object({
  id: z.coerce.number().int().positive().brand<"CommentId">(),
});
export type CommentParams = z.infer<typeof CommentParamsSchema>;

export interface PaginatedComments {
  comments: Comment[];
  total: number;
}
