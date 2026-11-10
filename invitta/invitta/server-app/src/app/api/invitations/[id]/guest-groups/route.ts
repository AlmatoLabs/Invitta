import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { guestGroups, guests } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, parseBody, route, type IdParams } from "@/lib/http";
import { ownedInvitation } from "@/lib/ownership";

const Create = z.object({
  name: z.string().trim().min(1).max(160),
  status: z.enum(["confirmat", "asteptare", "refuzat"]).default("asteptare"),
  people: z.number().int().min(0).max(20).default(1),
  menu: z.enum(["standard", "vegetarian", "vegan"]).nullable().optional(),
  message: z.string().trim().max(2000).nullable().optional(),
  /** Persons that can be seated. Defaults to just the group name. */
  members: z
    .array(z.object({ name: z.string().trim().min(1).max(160), isPartner: z.boolean().default(false) }))
    .max(20)
    .optional(),
});

export const GET = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const [groups, people] = await Promise.all([
    db.select().from(guestGroups).where(eq(guestGroups.invitationId, inv.id)).orderBy(asc(guestGroups.createdAt)),
    db.select().from(guests).where(eq(guests.invitationId, inv.id)).orderBy(asc(guests.position)),
  ]);
  return json({
    groups: groups.map((g) => ({
      ...g,
      members: people
        .filter((p) => p.groupId === g.id)
        .map((p) => ({ id: p.id, name: p.name, isPartner: p.isPartner, tableId: p.tableId })),
    })),
  });
});

export const POST = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const body = await parseBody(req, Create);
  const { members, ...fields } = body;
  const group = await db.transaction(async (tx) => {
    const [g] = await tx.insert(guestGroups).values({ ...fields, invitationId: inv.id }).returning();
    const list = members?.length ? members : [{ name: body.name, isPartner: false }];
    await tx.insert(guests).values(
      list.map((m, i) => ({ groupId: g.id, invitationId: inv.id, name: m.name, isPartner: m.isPartner, position: i })),
    );
    return g;
  });
  return json({ group }, { status: 201 });
});
