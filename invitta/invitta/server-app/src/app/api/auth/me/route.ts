import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { invitations } from "@/db/schema";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { json, route } from "@/lib/http";

export const dynamic = "force-dynamic";

/** 200 with `{ user: null }` when signed out, so the client can tell "no session" from a failure. */
export const GET = route(async () => {
  const user = await getCurrentUser();
  if (!user) return json({ user: null, invitations: [] });
  const list = await db
    .select({ id: invitations.id, slug: invitations.slug, modelSlug: invitations.modelSlug })
    .from(invitations)
    .where(eq(invitations.userId, user.id))
    .orderBy(invitations.createdAt);
  return json({ user: publicUser(user), invitations: list });
});
