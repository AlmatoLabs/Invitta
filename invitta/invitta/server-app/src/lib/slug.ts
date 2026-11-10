import { randomBytes } from "node:crypto";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** "Ioana & Andrei" → "ioana-andrei-k3f9" */
export function makeSlug(base: string): string {
  return `${slugify(base) || "invitatie"}-${randomBytes(2).toString("hex")}`;
}
