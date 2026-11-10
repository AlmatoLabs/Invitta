import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { guests, seatingTables } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, json, parseBody, route, uuid, type IdParams } from "@/lib/http";
import { ownedGuest } from "@/lib/ownership";

const Patch = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  /** Seat the guest at a table, or `null` to send them back to the pool. */
  tableId: z.string().nullable().optional(),
});

export const PATCH = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const guest = await ownedGuest(user.id, id);
  const body = await parseBody(req, Patch);

  if (body.tableId) {
    const tableId = uuid(body.tableId);
    const [table] = await db
      .select()
      .from(seatingTables)
      .where(and(eq(seatingTables.id, tableId), eq(seatingTables.invitationId, guest.invitationId)))
      .limit(1);
    if (!table) throw new ApiError(404, "Masa nu există.");
    if (guest.tableId !== table.id) {
      const seated = await db.select({ id: guests.id }).from(guests).where(eq(guests.tableId, table.id));
      if (seated.length >= table.seats) throw new ApiError(409, "Masa este plină.");
    }
  }

  const [row] = await db.update(guests).set(body).where(eq(guests.id, guest.id)).returning();
  return json({ guest: row });
});
