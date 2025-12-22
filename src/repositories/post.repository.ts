import type {
  CreatePostDto,
  PaginatedPosts,
  Post,
  PostId,
  UpdatePostDto,
} from "@/models/post.model.ts";
import { pool } from "../config/database.ts";
import type { QueryResult } from "pg";
import type { ZodQuery } from "@/models/endpoints.model.ts";
import { ApiError } from "@/utils/errors.ts";
import type { UserId } from "@/models/user.model.ts";
import * as changeKeys from "change-case/keys";

export class PostRepository {
  async findAll(rawQuery: ZodQuery): Promise<PaginatedPosts> {
    const query = `
        SELECT * FROM posts
        LIMIT $1
        OFFSET $2
    `;

    const queryTotal = `
      SELECT count(*) FROM posts
    `;

    const values = [rawQuery.limit, (rawQuery.page - 1) * rawQuery.limit];

    const result: QueryResult<Post> = await pool.query(query, values);
    const totalResult: QueryResult = await pool.query(queryTotal);

    const totalCount = parseInt(totalResult.rows[0].count);

    return {
      posts: changeKeys.camelCase(result.rows) as Post[],
      total: totalCount,
    };
  }

  async findOne(postId: PostId): Promise<Post> {
    const query = `
      SELECT * FROM posts
      WHERE id = $1
    `;

    const values = [postId];
    const result: QueryResult<Post> = await pool.query(query, values);
    const post = result.rows[0];

    if (!post) {
      throw new ApiError(404, `Post with id ${postId} not found`);
    }

    return changeKeys.camelCase(post) as Post;
  }

  async create(postData: CreatePostDto, userId: UserId): Promise<Post> {
    const query = `
      INSERT INTO posts (title, content, author_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;

    const values = [postData.title, postData.content, userId];

    const result: QueryResult<Post> = await pool.query(query, values);

    return changeKeys.camelCase(result.rows[0]) as Post;
  }

  async update(postId: PostId, postData: UpdatePostDto): Promise<Post> {
    const query = `
      UPDATE posts
      SET title = COALESCE($1, title), 
          content = COALESCE($2, content),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const values = [postData.title, postData.content, postId];

    const result: QueryResult<Post> = await pool.query(query, values);

    return changeKeys.camelCase(result.rows[0]) as Post;
  }

  async delete(id: PostId): Promise<Post> {
    const query = `
      DELETE FROM posts
      WHERE id = $1
      RETURnING *
    `;

    const values = [id];

    const result: QueryResult<Post> = await pool.query(query, values);

    return changeKeys.camelCase(result.rows[0]) as Post;
  }
}
