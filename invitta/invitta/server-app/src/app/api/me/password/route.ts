import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { ApiError, json, parseBody, route } from "@/lib/http";

const Body = z.object({ current: z.string().min(1).max(200), next: z.string().min(8).max(200) });

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, Body);
  if (!(await verifyPassword(body.current, user.passwordHash))) {
    throw new ApiError(400, "Parola curentă este incorectă.");
  }
  await db.update(users).set({ passwordHash: await hashPassword(body.next) }).where(eq(users.id, user.id));
  return json({ ok: true });
});
