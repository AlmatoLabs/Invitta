import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { guests, seatingTables } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, json, parseBody, route, type IdParams } from "@/lib/http";
import { ownedTable } from "@/lib/ownership";
import { TableFields } from "@/lib/validators";

const Patch = TableFields.partial();

export const PATCH = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const table = await ownedTable(user.id, id);
  const body = await parseBody(req, Patch);
  if (body.seats !== undefined) {
    const seated = await db.select({ id: guests.id }).from(guests).where(eq(guests.tableId, table.id));
    if (body.seats < seated.length) {
      throw new ApiError(409, `La masă sunt deja ${seated.length} persoane.`);
    }
  }
  const [row] = await db.update(seatingTables).set(body).where(eq(seatingTables.id, table.id)).returning();
  return json({ table: row });
});

export const DELETE = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const table = await ownedTable(user.id, id);
  await db.delete(seatingTables).where(eq(seatingTables.id, table.id)); // guests.table_id → NULL
  return json({ ok: true });
});
