import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { invitations } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { json, parseBody, route } from "@/lib/http";
import { MODEL_SLUGS } from "@/lib/models";
import { makeSlug } from "@/lib/slug";

const Create = z.object({
  modelSlug: z.enum(MODEL_SLUGS),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const GET = route(async () => {
  const user = await requireUser();
  const rows = await db
    .select()
    .from(invitations)
    .where(eq(invitations.userId, user.id))
    .orderBy(desc(invitations.createdAt));
  return json({ invitations: rows });
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, Create);
  const [row] = await db
    .insert(invitations)
    .values({
      userId: user.id,
      modelSlug: body.modelSlug,
      slug: makeSlug(user.name),
      content: body.content ?? {},
    })
    .returning();
  return json({ invitation: row }, { status: 201 });
});
