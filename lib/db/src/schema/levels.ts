import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const levelsTable = pgTable("levels", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionAr: text("description_ar").notNull(),
  order: integer("order").notNull(),
  color: text("color").notNull(),
});

export const insertLevelSchema = createInsertSchema(levelsTable).omit({ id: true });
export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type Level = typeof levelsTable.$inferSelect;
