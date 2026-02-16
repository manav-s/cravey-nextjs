import fs from "node:fs";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";

function parseEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

async function main() {
  const workspaceRoot = process.cwd();
  const envPath = path.resolve(workspaceRoot, ".env.local");
  const migrationPath = path.resolve(workspaceRoot, "db/migrations/001_init.sql");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found");
  }

  if (!fs.existsSync(migrationPath)) {
    throw new Error("db/migrations/001_init.sql not found");
  }

  const env = parseEnvFile(envPath);
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  const migrationSql = fs.readFileSync(migrationPath, "utf8");
  const statements = migrationSql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    for (const statement of statements) {
      await client.query(statement);
    }

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users','accounts','sessions','verification_tokens','craving_entries','usage_entries','recordings')
      ORDER BY table_name;
    `);

    console.log("Migration applied.");
    console.log("Tables:", result.rows.map((row) => row.table_name).join(", "));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
