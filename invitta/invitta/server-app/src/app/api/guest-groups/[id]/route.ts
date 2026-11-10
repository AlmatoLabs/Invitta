import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { guestGroups } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, parseBody, route, type IdParams } from "@/lib/http";
import { ownedGroup } from "@/lib/ownership";

const Patch = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  status: z.enum(["confirmat", "asteptare", "refuzat"]).optional(),
  people: z.number().int().min(0).max(20).optional(),
  menu: z.enum(["standard", "vegetarian", "vegan"]).nullable().optional(),
  message: z.string().trim().max(2000).nullable().optional(),
});

export const PATCH = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const group = await ownedGroup(user.id, id);
  const body = await parseBody(req, Patch);
  const [row] = await db.update(guestGroups).set(body).where(eq(guestGroups.id, group.id)).returning();
  return json({ group: row });
});

export const DELETE = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const group = await ownedGroup(user.id, id);
  await db.delete(guestGroups).where(eq(guestGroups.id, group.id));
  return json({ ok: true });
});
