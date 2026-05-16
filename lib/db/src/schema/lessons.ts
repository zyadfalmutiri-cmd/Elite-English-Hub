import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { levelsTable } from "./levels";
import { topicsTable } from "./topics";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  levelId: integer("level_id").notNull().references(() => levelsTable.id),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  order: integer("order").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(10),
  contentAr: text("content_ar").notNull().default(""),
  examplesJson: text("examples_json").notNull().default("[]"),
  keyWordsJson: text("keywords_json").notNull().default("[]"),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
