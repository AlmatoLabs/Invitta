import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { publicUser, requireUser } from "@/lib/auth";
import { ApiError, json, parseBody, route } from "@/lib/http";

const Body = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(40).nullable().optional(),
});

export const PATCH = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, Body);
  if (body.email && body.email !== user.email) {
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email)).limit(1);
    if (taken) throw new ApiError(409, "Există deja un cont cu acest email.");
  }
  const [updated] = await db.update(users).set(body).where(eq(users.id, user.id)).returning();
  return json({ user: publicUser(updated) });
});
