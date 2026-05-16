import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable, lessonsTable, levelsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/stats/overview", async (_req, res) => {
  try {
    const [totalRow] = await db.select({ count: sql<number>`count(*)::int` }).from(lessonsTable);
    const [completedRow] = await db.select({ count: sql<number>`count(*)::int` }).from(progressTable);
    const totalLessons = totalRow?.count ?? 0;
    const completedLessons = completedRow?.count ?? 0;

    const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);
    const lessonsByLevel = await db
      .select({ levelId: lessonsTable.levelId, count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .groupBy(lessonsTable.levelId);
    const completedByLevel = await db
      .select({ levelId: lessonsTable.levelId, count: sql<number>`count(*)::int` })
      .from(progressTable)
      .leftJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
      .groupBy(lessonsTable.levelId);

    const totalMap = Object.fromEntries(lessonsByLevel.map((r) => [r.levelId, r.count]));
    const completedMap = Object.fromEntries(completedByLevel.map((r) => [r.levelId, r.count]));

    const levelBreakdown = levels.map((l) => ({
      levelCode: l.code,
      total: totalMap[l.id] ?? 0,
      completed: completedMap[l.id] ?? 0,
    }));

    let currentLevel = "A1";
    for (const lb of levelBreakdown) {
      if (lb.total > 0 && lb.completed >= lb.total * 0.5) {
        currentLevel = lb.levelCode;
      }
    }

    res.json({
      totalLessons,
      completedLessons,
      currentLevel,
      currentStreak: completedLessons > 0 ? Math.min(completedLessons, 7) : 0,
      levelBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
