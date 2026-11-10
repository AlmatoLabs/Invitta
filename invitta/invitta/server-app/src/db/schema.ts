import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const rsvpStatus = pgEnum("rsvp_status", ["confirmat", "asteptare", "refuzat"]);
export const menuType = pgEnum("menu_type", ["standard", "vegetarian", "vegan"]);
export const tableShape = pgEnum("table_shape", ["round", "rect", "square", "oval", "presidium"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// Every table has RLS enabled and no policies: Supabase exposes the `public` schema through its
// Data API (PostgREST), and this keeps anon/authenticated keys from reading anything. server-app
// connects as the database owner, which bypasses RLS, so it is unaffected.

/** Couples with an account. Email is stored lower-cased. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
}).enableRLS();

/**
 * One invitation = one chosen model + everything the editor produces.
 * `content` is the editor payload (hero, people, places, sections...) kept as
 * JSONB so the editor can evolve without a migration for every new field.
 */
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    modelSlug: text("model_slug").notNull(),
    content: jsonb("content").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (t) => [index("invitations_user_idx").on(t.userId)],
).enableRLS();

/** An RSVP entry: a guest or a family/party answering together ("Familia Dumitrescu", 4 people). */
export const guestGroups = pgTable(
  "guest_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invitationId: uuid("invitation_id")
      .notNull()
      .references(() => invitations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: rsvpStatus("status").notNull().default("asteptare"),
    people: integer("people").notNull().default(1),
    menu: menuType("menu"),
    message: text("message"),
    ...timestamps,
  },
  (t) => [index("guest_groups_invitation_idx").on(t.invitationId)],
).enableRLS();

export const seatingTables = pgTable(
  "seating_tables",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invitationId: uuid("invitation_id")
      .notNull()
      .references(() => invitations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    seats: integer("seats").notNull().default(10),
    shape: tableShape("shape").notNull().default("round"),
    color: text("color").notNull().default("#C9A876"),
    notes: text("notes"),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("seating_tables_invitation_idx").on(t.invitationId)],
).enableRLS();

/** An individual person that can be seated (a group's main guest or their partner). */
export const guests = pgTable(
  "guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => guestGroups.id, { onDelete: "cascade" }),
    invitationId: uuid("invitation_id")
      .notNull()
      .references(() => invitations.id, { onDelete: "cascade" }),
    tableId: uuid("table_id").references(() => seatingTables.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    isPartner: boolean("is_partner").notNull().default(false),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    index("guests_group_idx").on(t.groupId),
    index("guests_table_idx").on(t.tableId),
    index("guests_invitation_idx").on(t.invitationId),
  ],
).enableRLS();

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull().unique(),
    plan: text("plan").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("RON"),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("invoices_user_idx").on(t.userId)],
).enableRLS();

export type User = typeof users.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type GuestGroup = typeof guestGroups.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type SeatingTable = typeof seatingTables.$inferSelect;
