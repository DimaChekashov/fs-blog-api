import { pool } from "@/config/database.ts";
import type { AccessToken, RefreshToken } from "@/models/user.model.ts";
import { hashToken } from "@/utils/auth.ts";
import type { QueryResult } from "pg";

export class TokenRepository {
  async blacklistToken(token: RefreshToken | AccessToken, expireAt: Date) {
    const tokenHash = hashToken(token);

    const query = `
      INSERT INTO revoked_tokens (id, expires_at)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING
    `;

    const values = [tokenHash, expireAt];

    await pool.query(query, values);
  }

  async isTokenBlacklisted(
    token: RefreshToken | AccessToken
  ): Promise<boolean> {
    const tokenHash = hashToken(token);

    const query = `
      SELECT 1 FROM revoked_tokens
      WHERE id = $1
    `;

    const values = [tokenHash];
    const result = await pool.query(query, values);
    return result.rows.length > 0;
  }
}
