import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../../config/database.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.join(__dirname);
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      const result = await client.query(
        "SELECT id FROM migrations WHERE name = $1",
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`🔄 Execute migration: ${file}`);

        const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");

        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);

        console.log(`✅ Migration ${file} executed`);
      } else {
        console.log(`⏭️ Migration ${file} already executed`);
      }
    }

    await client.query("COMMIT");
    console.log("🎉 All migration are executed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error executing migrations:", error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
}

runMigrations();
