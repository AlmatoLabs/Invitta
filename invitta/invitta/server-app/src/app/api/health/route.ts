import { sql } from "@/db/client";
import { json, route } from "@/lib/http";

export const GET = route(async () => {
  await sql`select 1`;
  return json({ ok: true });
});
