// Dev data: a demo couple with an invitation, RSVP entries and two tables.
// Usage: pnpm db:seed   (login: demo@invitta.ro / demo12345)
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "./schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { max: 1, prepare: process.env.DATABASE_PREPARE !== "false" });
  const db = drizzle(sql, { schema: s });

  const email = "demo@invitta.ro";
  await db.delete(s.users).where(eq(s.users.email, email));
  const [user] = await db
    .insert(s.users)
    .values({ email, name: "Ioana & Andrei", passwordHash: await bcrypt.hash("demo12345", 10) })
    .returning();
  const [inv] = await db
    .insert(s.invitations)
    .values({ userId: user.id, slug: "ioana-andrei-demo", modelSlug: "minimal-ivory", content: {} })
    .returning();

  const [t1, t2] = await db
    .insert(s.seatingTables)
    .values([
      { invitationId: inv.id, name: "Masa 1", seats: 10, shape: "round", color: "#C9A876", position: 0 },
      { invitationId: inv.id, name: "Prezidiu", seats: 6, shape: "presidium", color: "#2A2A2A", position: 1 },
    ])
    .returning();

  const rows: Array<[string, "confirmat" | "asteptare" | "refuzat", number, "standard" | "vegetarian" | "vegan" | null, string[]]> = [
    ["Maria Popescu", "confirmat", 2, "standard", ["Maria Popescu", "Partener"]],
    ["Andrei Ionescu", "confirmat", 1, "vegetarian", ["Andrei Ionescu"]],
    ["Elena Marin", "asteptare", 2, null, ["Elena Marin", "Partener"]],
    ["Familia Dumitrescu", "confirmat", 4, "standard", ["Dumitrescu A.", "Dumitrescu B.", "Dumitrescu C.", "Dumitrescu D."]],
    ["Ioana Vasile", "refuzat", 0, null, ["Ioana Vasile"]],
  ];
  for (const [name, status, people, menu, members] of rows) {
    const [g] = await db
      .insert(s.guestGroups)
      .values({ invitationId: inv.id, name, status, people, menu })
      .returning();
    await db.insert(s.guests).values(
      members.map((m, i) => ({
        groupId: g.id,
        invitationId: inv.id,
        name: m,
        isPartner: i > 0,
        position: i,
        tableId: name === "Maria Popescu" ? t1.id : null,
      })),
    );
  }
  void t2;
  await sql.end();
  console.log(`Seeded ${email} / demo12345`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
