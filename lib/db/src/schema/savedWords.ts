import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const savedWordsTable = pgTable("saved_words", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  word: text("word").notNull(),
  translation: text("translation"),
  example: text("example"),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export type SavedWord = typeof savedWordsTable.$inferSelect;
export type InsertSavedWord = typeof savedWordsTable.$inferInsert;
