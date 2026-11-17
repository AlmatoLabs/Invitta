// Creates (or resets the password of) a single login account, without demo data.
// Usage: pnpm db:seed-user
// Override the defaults with SEED_EMAIL, SEED_PASSWORD and SEED_NAME in .env or the shell.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "./schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const email = (process.env.SEED_EMAIL ?? "admin@invitta.ro").trim().toLowerCase();
  const password = process.env.SEED_PASSWORD ?? "admin12345";
  const name = process.env.SEED_NAME ?? "Admin";
  if (password.length < 8) throw new Error("SEED_PASSWORD must be at least 8 characters");

  const sql = postgres(url, { max: 1, prepare: process.env.DATABASE_PREPARE !== "false" });
  const db = drizzle(sql, { schema: s });

  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .insert(s.users)
    .values({ email, name, passwordHash })
    .onConflictDoUpdate({ target: s.users.email, set: { name, passwordHash } });

  await sql.end();
  console.log(`Seeded user ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
