import type {
  CreatePostDto,
  DeletePostDto,
  Post,
  UpdatePostDto,
} from "@/models/post.model.ts";
import { pool } from "../config/database.ts";
import type { QueryResult } from "pg";

export class PostRepository {
  async findAll(): Promise<Post[]> {
    const query = `
        SELECT * FROM posts
    `;

    const result: QueryResult<Post> = await pool.query(query);
    return result.rows;
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

  async update(postData: UpdatePostDto): Promise<Post> {
    const query = `
      UPDATE posts
      SET title = $1
      WHERE id = $2
      RETURnING *
    `;

    const values = [postData.title, postData.id];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }

  async delete(data: DeletePostDto): Promise<Post> {
    const query = `
      DELETE FROM posts
      WHERE id = $1
      RETURnING *
    `;

    const values = [data.id];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }
}
