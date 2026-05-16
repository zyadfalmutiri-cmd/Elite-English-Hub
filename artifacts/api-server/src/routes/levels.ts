import { Router } from "express";
import { db } from "@workspace/db";
import { levelsTable, lessonsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/levels", async (_req, res) => {
  try {
    const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);
    const lessonCounts = await db
      .select({ levelId: lessonsTable.levelId, count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .groupBy(lessonsTable.levelId);
    const countMap = Object.fromEntries(lessonCounts.map((r) => [r.levelId, r.count]));
    const result = levels.map((l) => ({
      id: l.id,
      code: l.code,
      nameAr: l.nameAr,
      descriptionAr: l.descriptionAr,
      order: l.order,
      color: l.color,
      lessonsCount: countMap[l.id] ?? 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/levels/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [level] = await db.select().from(levelsTable).where(eq(levelsTable.id, id));
    if (!level) return res.status(404).json({ error: "Level not found" });
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .where(eq(lessonsTable.levelId, id));
    res.json({ ...level, lessonsCount: countRow?.count ?? 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
