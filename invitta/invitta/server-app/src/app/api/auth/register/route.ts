import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword, publicUser, startSession } from "@/lib/auth";
import { ApiError, json, parseBody, route } from "@/lib/http";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(200),
});

export const POST = route(async (req) => {
  const body = await parseBody(req, Body);
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email)).limit(1);
  if (existing) throw new ApiError(409, "Există deja un cont cu acest email.");
  const [user] = await db
    .insert(users)
    .values({ name: body.name, email: body.email, passwordHash: await hashPassword(body.password) })
    .returning();
  await startSession(user.id);
  return json({ user: publicUser(user), invitations: [] }, { status: 201 });
});
