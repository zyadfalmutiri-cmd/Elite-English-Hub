import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable, levelsTable, topicsTable, progressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/lessons", async (req, res) => {
  try {
    const levelId = req.query.levelId ? parseInt(req.query.levelId as string) : undefined;
    const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : undefined;
    const conditions = [];
    if (levelId) conditions.push(eq(lessonsTable.levelId, levelId));
    if (topicId) conditions.push(eq(lessonsTable.topicId, topicId));
    const rows = await db
      .select({
        id: lessonsTable.id,
        titleAr: lessonsTable.titleAr,
        levelId: lessonsTable.levelId,
        levelCode: levelsTable.code,
        topicId: lessonsTable.topicId,
        topicNameAr: topicsTable.nameAr,
        order: lessonsTable.order,
        durationMinutes: lessonsTable.durationMinutes,
      })
      .from(lessonsTable)
      .leftJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .leftJoin(topicsTable, eq(lessonsTable.topicId, topicsTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(lessonsTable.order);

    const completed = await db.select({ lessonId: progressTable.lessonId }).from(progressTable);
    const completedSet = new Set(completed.map((p) => p.lessonId));
    const result = rows.map((r) => ({
      ...r,
      levelCode: r.levelCode ?? "",
      topicNameAr: r.topicNameAr ?? "",
      completed: completedSet.has(r.id),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/lessons/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [row] = await db
      .select({
        id: lessonsTable.id,
        titleAr: lessonsTable.titleAr,
        levelId: lessonsTable.levelId,
        levelCode: levelsTable.code,
        topicId: lessonsTable.topicId,
        topicNameAr: topicsTable.nameAr,
        order: lessonsTable.order,
        durationMinutes: lessonsTable.durationMinutes,
        contentAr: lessonsTable.contentAr,
        examplesJson: lessonsTable.examplesJson,
        keyWordsJson: lessonsTable.keyWordsJson,
      })
      .from(lessonsTable)
      .leftJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .leftJoin(topicsTable, eq(lessonsTable.topicId, topicsTable.id))
      .where(eq(lessonsTable.id, id));
    if (!row) return res.status(404).json({ error: "Lesson not found" });

    const [prog] = await db.select().from(progressTable).where(eq(progressTable.lessonId, id));

    res.json({
      id: row.id,
      titleAr: row.titleAr,
      levelId: row.levelId,
      levelCode: row.levelCode ?? "",
      topicId: row.topicId,
      topicNameAr: row.topicNameAr ?? "",
      order: row.order,
      durationMinutes: row.durationMinutes,
      completed: !!prog,
      contentAr: row.contentAr,
      examplesAr: JSON.parse(row.examplesJson ?? "[]"),
      keyWordsAr: JSON.parse(row.keyWordsJson ?? "[]"),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
