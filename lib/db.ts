import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
const neonSql = databaseUrl ? neon(databaseUrl) : null;

type SqlTag = <Row = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...params: unknown[]
) => Promise<Row[]>;

export const sql: SqlTag = <Row = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...params: unknown[]
) => {
  if (!neonSql) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  return neonSql(strings, ...params) as Promise<Row[]>;
};
