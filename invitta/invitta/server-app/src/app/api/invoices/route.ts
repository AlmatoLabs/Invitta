import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { invoices } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, route } from "@/lib/http";

export const GET = route(async () => {
  const user = await requireUser();
  const rows = await db.select().from(invoices).where(eq(invoices.userId, user.id)).orderBy(desc(invoices.issuedAt));
  return json({ invoices: rows });
});
