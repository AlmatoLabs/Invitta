import { z } from "zod";

export const TableFields = z.object({
  name: z.string().trim().min(1).max(80),
  seats: z.number().int().min(1).max(60),
  shape: z.enum(["round", "rect", "square", "oval", "presidium"]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  notes: z.string().trim().max(500).nullable().optional(),
});
