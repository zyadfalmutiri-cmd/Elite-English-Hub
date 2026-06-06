import { Router } from "express";
import { db, levelsTable, lessonsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export const levelsRouter = Router();

levelsRouter.get("/", async (_req, res) => {
  try {
    const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);
    const counts = await db
      .select({ levelId: lessonsTable.levelId, count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .groupBy(lessonsTable.levelId);
    const countMap = Object.fromEntries(counts.map((c) => [c.levelId, c.count]));
    const result = levels.map((l) => ({
      id: l.id,
      code: l.code,
      nameAr: l.nameAr,
      descriptionAr: l.descriptionAr,
      order: l.order,
      color: l.color,
      lessonsCount: countMap[l.id] || 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
