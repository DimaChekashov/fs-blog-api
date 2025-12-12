import { Pool, type PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(config);

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Error connect to PostgreSQL:", error);
    return false;
  }
};
