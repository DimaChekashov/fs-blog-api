import { pool } from "@/config/database.ts";
import type {
  Comment,
  CommentId,
  CreateCommentDto,
  PaginatedComments,
} from "@/models/comment.model.ts";
import type { ZodQuery } from "@/models/endpoints.model.ts";
import type { QueryResult } from "pg";
import * as changeKeys from "change-case/keys";
import { ApiError } from "@/utils/errors.ts";
import type { UserId } from "@/models/user.model.ts";

export class CommentRepository {
  async findAll(rawQuery: ZodQuery): Promise<PaginatedComments> {
    const query = `
        SELECT * FROM comments
        LIMIT $1
        OFFSET $2
    `;

    const queryTotal = `
        SELECT count(*) FROM comments
    `;

    const values = [rawQuery.limit, (rawQuery.page - 1) * rawQuery.limit];

    const result: QueryResult<Comment> = await pool.query(query, values);
    const totalResult = await pool.query(queryTotal);

    const totalCount = parseInt(totalResult.rows[0].count);

    return {
      comments: changeKeys.camelCase(result.rows) as Comment[],
      total: totalCount,
    };
  }

  async findOne(commentId: CommentId): Promise<Comment> {
    const query = `
        SELECT * FROM comments
        WHERE id = $1
      `;

    const values = [commentId];
    const result: QueryResult<Comment> = await pool.query(query, values);
    const comment = result.rows[0];

    if (!comment) {
      throw new ApiError(404, `Comment with id ${commentId} not found`);
    }

    return changeKeys.camelCase(comment) as Comment;
  }

  async create(
    commentData: CreateCommentDto,
    userId: UserId
  ): Promise<Comment> {
    const query = `
        INSERT INTO comments (message, post_id, user_id) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;

    const values = [commentData.message, commentData.postId, userId];

    const result: QueryResult<Comment> = await pool.query(query, values);

    return changeKeys.camelCase(result.rows[0]) as Comment;
  }

  async delete(commentId: CommentId): Promise<Comment> {
    const query = `
        DELETE FROM comments
        WHERE id = $1
        RETURnING *
      `;

    const values = [commentId];

    const result: QueryResult<Comment> = await pool.query(query, values);

    return changeKeys.camelCase(result.rows[0]) as Comment;
  }
}
