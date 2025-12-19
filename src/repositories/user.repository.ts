import { pool } from "@/config/database.ts";
import type { CreateUserDto, User } from "@/models/user.model.ts";
import { ApiError } from "@/utils/errors.ts";
import type { QueryResult } from "pg";

export class UserRepository {
  async findOne(email: string): Promise<User | null> {
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;

    const result: QueryResult<User> = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) return null;

    return user;
  }

  async create(userData: CreateUserDto, hashedPassword: string): Promise<User> {
    const query = `
      INSERT INTO users (username, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [userData.username, userData.email, hashedPassword];
    const result: QueryResult<User> = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ApiError(500, "Error while create user!");
    }

    return user;
  }

  async delete() {}
}
