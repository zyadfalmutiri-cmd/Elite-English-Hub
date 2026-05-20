import { pgTable, serial, text, integer, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActive: date("last_active"),
  isSubscribed: boolean("is_subscribed").notNull().default(false),
  subscribedAt: timestamp("subscribed_at"),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, xp: true, streak: true, lastActive: true, isSubscribed: true, subscribedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
