import type {
  CreatePostDto,
  PaginatedPosts,
  Post,
  UpdatePostDto,
} from "@/models/post.model.ts";
import { pool } from "../config/database.ts";
import type { QueryResult } from "pg";
import type { ZodQuery } from "@/models/endpoints.model.ts";

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
      posts: result.rows,
      total: totalCount,
    };
  }

  async findOne(id: number): Promise<Post> {
    const query = `
      SELECT * FROM posts
      WHERE id = $1
    `;

    const values = [id];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }

  async create(postData: CreatePostDto): Promise<Post> {
    const query = `
      INSERT INTO posts (title) 
      VALUES ($1) 
      RETURNING *
    `;

    const values = [postData.title];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }

  async update(id: number, postData: UpdatePostDto): Promise<Post> {
    const query = `
      UPDATE posts
      SET title = $1
      WHERE id = $2
      RETURnING *
    `;

    const values = [postData.title, id];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }

  async delete(id: number): Promise<Post> {
    const query = `
      DELETE FROM posts
      WHERE id = $1
      RETURnING *
    `;

    const values = [id];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }
}
