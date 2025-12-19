import { pool } from "@/config/database.ts";
import type { CreateUserDto, User } from "@/models/user.model.ts";
import { ApiError } from "@/utils/errors.ts";
import type { QueryResult } from "pg";
import * as changeKeys from "change-case/keys";

export class UserRepository {
  async findOne(email: string, username?: string): Promise<User | null> {
    let values;
    let query;

    if (!username) {
      query = `
        SELECT * FROM users
        WHERE email = $1
      `;
      values = [email];
    } else {
      query = `
        SELECT * FROM users
        WHERE email = $1 OR username = $2
      `;
      values = [email, username];
    }

    const result: QueryResult<User> = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) return null;

    return changeKeys.camelCase(user) as User;
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

    return changeKeys.camelCase(user) as User;
  }

  async delete() {}
}
