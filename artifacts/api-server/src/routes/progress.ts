import { Router } from "express";
import { db, progressTable, lessonsTable, levelsTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

export const progressRouter = Router();

progressRouter.get("/", async (req, res) => {
  try {
    const progress = await db
      .select({
        id: progressTable.id,
        lessonId: progressTable.lessonId,
        lessonTitleAr: lessonsTable.titleAr,
        levelCode: levelsTable.code,
        completedAt: progressTable.completedAt,
        score: progressTable.score,
      })
      .from(progressTable)
      .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
      .innerJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .orderBy(desc(progressTable.completedAt));
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

progressRouter.post("/", async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    if (!lessonId) {
      return res.status(400).json({ message: "lessonId required" });
    }
    const [entry] = await db
      .insert(progressTable)
      .values({ lessonId, score: score ?? null })
      .returning();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

progressRouter.get("/stats", async (_req, res) => {
  try {
    const totalLessons = await db.select({ count: sql<number>`count(*)::int` }).from(lessonsTable);
    const completedLessons = await db.select({ count: sql<number>`count(*)::int` }).from(progressTable);
    
    const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);
    const breakdown = [];
    for (const level of levels) {
      const [total] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(lessonsTable)
        .where(eq(lessonsTable.levelId, level.id));
      const [completed] = await db
        .select({ count: sql<number>`count(distinct ${progressTable.lessonId})::int` })
        .from(progressTable)
        .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
        .where(eq(lessonsTable.levelId, level.id));
      breakdown.push({
        levelCode: level.code,
        total: total.count,
        completed: completed.count,
      });
    }

    res.json({
      totalLessons: totalLessons[0].count,
      completedLessons: completedLessons[0].count,
      currentLevel: levels[0]?.code || "A1",
      currentStreak: 0,
      levelBreakdown: breakdown,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
