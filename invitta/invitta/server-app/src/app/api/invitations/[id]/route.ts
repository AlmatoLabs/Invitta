import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { invitations } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, json, parseBody, route, type IdParams } from "@/lib/http";
import { MODEL_SLUGS } from "@/lib/models";
import { ownedInvitation } from "@/lib/ownership";
import { slugify } from "@/lib/slug";

// The editor payload can embed uploaded images as data: URLs, so allow a generous (but bounded) size.
const MAX_CONTENT_BYTES = 12 * 1024 * 1024;

const Patch = z.object({
  modelSlug: z.enum(MODEL_SLUGS).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Doar litere mici, cifre și cratime")
    .min(3)
    .max(60)
    .optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const GET = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  return json({ invitation: await ownedInvitation(user.id, id) });
});

export const PATCH = route<IdParams>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  const body = await parseBody(req, Patch);
  if (body.content && JSON.stringify(body.content).length > MAX_CONTENT_BYTES) {
    throw new ApiError(413, "Conținutul invitației este prea mare.");
  }
  if (body.slug && body.slug !== inv.slug) {
    if (body.slug !== slugify(body.slug)) throw new ApiError(422, "Slug invalid");
    const [taken] = await db.select({ id: invitations.id }).from(invitations).where(eq(invitations.slug, body.slug)).limit(1);
    if (taken) throw new ApiError(409, "Acest link este deja folosit.");
  }
  const [row] = await db.update(invitations).set(body).where(eq(invitations.id, inv.id)).returning();
  return json({ invitation: row });
});

export const DELETE = route<IdParams>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const inv = await ownedInvitation(user.id, id);
  await db.delete(invitations).where(eq(invitations.id, inv.id));
  return json({ ok: true });
});
