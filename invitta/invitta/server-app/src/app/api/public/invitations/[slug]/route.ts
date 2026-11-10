import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { invitations } from "@/db/schema";
import { ApiError, json, route, type SlugParams } from "@/lib/http";

/** Public (no auth): what a guest sees when opening the invitation link. */
export const GET = route<SlugParams>(async (_req, { params }) => {
  const { slug } = await params;
  const [inv] = await db
    .select({ slug: invitations.slug, modelSlug: invitations.modelSlug, content: invitations.content })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);
  if (!inv) throw new ApiError(404, "Invitația nu a fost găsită.");
  return json({ invitation: inv });
});
