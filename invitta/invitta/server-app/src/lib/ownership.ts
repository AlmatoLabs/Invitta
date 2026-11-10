import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { guestGroups, guests, invitations, seatingTables } from "@/db/schema";
import { ApiError, uuid } from "./http";

/** Loads an invitation only if it belongs to the user — otherwise 404 (never leak existence). */
export async function ownedInvitation(userId: string, invitationId: string) {
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, uuid(invitationId)), eq(invitations.userId, userId)))
    .limit(1);
  if (!inv) throw new ApiError(404, "Not found");
  return inv;
}

export async function ownedGroup(userId: string, groupId: string) {
  const [row] = await db
    .select({ group: guestGroups })
    .from(guestGroups)
    .innerJoin(invitations, eq(invitations.id, guestGroups.invitationId))
    .where(and(eq(guestGroups.id, uuid(groupId)), eq(invitations.userId, userId)))
    .limit(1);
  if (!row) throw new ApiError(404, "Not found");
  return row.group;
}

export async function ownedTable(userId: string, tableId: string) {
  const [row] = await db
    .select({ table: seatingTables })
    .from(seatingTables)
    .innerJoin(invitations, eq(invitations.id, seatingTables.invitationId))
    .where(and(eq(seatingTables.id, uuid(tableId)), eq(invitations.userId, userId)))
    .limit(1);
  if (!row) throw new ApiError(404, "Not found");
  return row.table;
}

export async function ownedGuest(userId: string, guestId: string) {
  const [row] = await db
    .select({ guest: guests })
    .from(guests)
    .innerJoin(invitations, eq(invitations.id, guests.invitationId))
    .where(and(eq(guests.id, uuid(guestId)), eq(invitations.userId, userId)))
    .limit(1);
  if (!row) throw new ApiError(404, "Not found");
  return row.guest;
}
