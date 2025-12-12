import { pool } from "../config/database.ts";
import type { QueryResult } from "pg";

interface Post {
  id: number;
  title: string;
  created_at: Date;
}

export class PostRepository {
  async findAll(): Promise<Post[]> {
    const query = `
        SELECT * FROM posts
    `;

    const result: QueryResult<Post> = await pool.query(query);
    return result.rows;
  }

  async create(postData: Omit<Post, "id" | "created_at">): Promise<Post> {
    const query = `
      INSERT INTO posts (title) 
      VALUES ($1) 
      RETURNING *
    `;

    const values = [postData.title];

    const result: QueryResult<Post> = await pool.query(query, values);
    return result.rows[0] as Post;
  }
}
