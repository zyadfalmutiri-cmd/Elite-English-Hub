import { Router } from "express";
import { db, lessonsTable, levelsTable, topicsTable, progressTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";

export const lessonsRouter = Router();

lessonsRouter.get("/", async (req, res) => {
  try {
    const { levelId, topicId } = req.query;
    let query = db
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
      .innerJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .innerJoin(topicsTable, eq(lessonsTable.topicId, topicsTable.id))
      .orderBy(lessonsTable.order)
      .$dynamic();

    const conditions = [];
    if (levelId) conditions.push(eq(lessonsTable.levelId, Number(levelId)));
    if (topicId) conditions.push(eq(lessonsTable.topicId, Number(topicId)));
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const lessons = await query;

    // Get completed lessons for current user
    const completedIds = new Set<number>();
    if (req.session.userId) {
      const progress = await db.select({ lessonId: progressTable.lessonId }).from(progressTable);
      progress.forEach((p) => completedIds.add(p.lessonId));
    }

    const result = lessons.map((l) => ({
      ...l,
      completed: completedIds.has(l.id),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

lessonsRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [lesson] = await db
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
      .innerJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .innerJoin(topicsTable, eq(lessonsTable.topicId, topicsTable.id))
      .where(eq(lessonsTable.id, id));

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const completedIds = new Set<number>();
    if (req.session.userId) {
      const progress = await db.select({ lessonId: progressTable.lessonId }).from(progressTable);
      progress.forEach((p) => completedIds.add(p.lessonId));
    }

    res.json({
      ...lesson,
      completed: completedIds.has(lesson.id),
      examplesAr: JSON.parse(lesson.examplesJson || "[]"),
      keyWordsAr: JSON.parse(lesson.keyWordsJson || "[]"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
