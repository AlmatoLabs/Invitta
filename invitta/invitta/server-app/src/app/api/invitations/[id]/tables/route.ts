import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { guests, seatingTables } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, parseBody, route, type IdParams } from "@/lib/http";
import { ownedInvitation } from "@/lib/ownership";
import { TableFields } from "@/lib/validators";

export const GET = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const [tables, seated] = await Promise.all([
    db.select().from(seatingTables).where(eq(seatingTables.invitationId, inv.id)).orderBy(asc(seatingTables.position), asc(seatingTables.createdAt)),
    db
      .select({ id: guests.id, name: guests.name, tableId: guests.tableId })
      .from(guests)
      .where(eq(guests.invitationId, inv.id))
      .orderBy(asc(guests.position)),
  ]);
  return json({
    tables: tables.map((t) => ({
      ...t,
      guests: seated.filter((g) => g.tableId === t.id).map((g) => ({ id: g.id, name: g.name })),
    })),
  });
});

export const POST = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const body = await parseBody(req, TableFields);
  const [{ next }] = await db
    .select({ next: sql<number>`coalesce(max(${seatingTables.position}), -1) + 1` })
    .from(seatingTables)
    .where(eq(seatingTables.invitationId, inv.id));
  const [table] = await db
    .insert(seatingTables)
    .values({ ...body, invitationId: inv.id, position: Number(next) })
    .returning();
  return json({ table: { ...table, guests: [] } }, { status: 201 });
});
