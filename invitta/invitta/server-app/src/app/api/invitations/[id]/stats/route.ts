import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { guestGroups } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, route, type IdParams } from "@/lib/http";
import { ownedInvitation } from "@/lib/ownership";

export const GET = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const groups = await db
    .select({ status: guestGroups.status, people: guestGroups.people })
    .from(guestGroups)
    .where(eq(guestGroups.invitationId, inv.id));
  let confirmed = 0;
  let pending = 0;
  let declined = 0;
  for (const g of groups) {
    if (g.status === "confirmat") confirmed += g.people;
    else if (g.status === "asteptare") pending += g.people;
    else declined += 1;
  }
  return json({ confirmed, pending, declined, total: confirmed + pending + declined });
});
