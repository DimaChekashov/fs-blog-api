import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../../config/database.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
  const client = await pool.connect();

  const seedDir = path.join(__dirname);
  const sqlFile = await fs.readFile(
    path.join(seedDir, "seed-data.sql"),
    "utf8"
  );

  await client.query(sqlFile);

  console.log("✅ PostgreSQL seeded successfully");

  client.release();
  process.exit(0);
}

runSeeds();
