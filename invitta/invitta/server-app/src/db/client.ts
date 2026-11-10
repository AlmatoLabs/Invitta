import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Reuse the connection across hot reloads in dev so we don't exhaust Postgres connections.
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set (see server-app/.env.example)");
  return postgres(url, {
    // Supabase's transaction pooler (port 6543) does not support prepared statements.
    prepare: process.env.DATABASE_PREPARE !== "false",
    max: process.env.NODE_ENV === "production" ? 10 : 3,
  });
}

export const sql = (globalForDb.__sql ??= connect());
export const db = drizzle(sql, { schema });
export { schema };
