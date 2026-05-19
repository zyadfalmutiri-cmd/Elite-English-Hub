import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { levelsTable } from "./levels";
import { usersTable } from "./users";

export const placementQuestionsTable = pgTable("placement_questions", {
  id: serial("id").primaryKey(),
  questionAr: text("question_ar").notNull(),
  optionsJson: text("options_json").notNull(),
  correctIndex: integer("correct_index").notNull(),
  levelCode: text("level_code").notNull(),
  order: integer("order").notNull().default(0),
});

export const userPlacementResultsTable = pgTable("user_placement_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  recommendedLevelId: integer("recommended_level_id").notNull().references(() => levelsTable.id),
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});
