import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable, lessonsTable, levelsTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { SaveProgressBody } from "@workspace/api-zod";

const router = Router();

const XP_PER_LESSON = 50;

function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

router.get("/progress", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: progressTable.id,
        lessonId: progressTable.lessonId,
        lessonTitleAr: lessonsTable.titleAr,
        levelCode: levelsTable.code,
        completedAt: progressTable.completedAt,
        score: progressTable.score,
      })
      .from(progressTable)
      .leftJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
      .leftJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .orderBy(progressTable.completedAt);
    res.json(rows.map((r) => ({
      id: r.id,
      lessonId: r.lessonId,
      lessonTitleAr: r.lessonTitleAr ?? "",
      levelCode: r.levelCode ?? "",
      completedAt: r.completedAt.toISOString(),
      score: r.score ?? null,
    })));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/progress", async (req, res) => {
  try {
    const parsed = SaveProgressBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid body" });
    const { lessonId, score } = parsed.data;

    const existing = await db.select().from(progressTable).where(eq(progressTable.lessonId, lessonId));
    let progressEntry;
    const isNew = existing.length === 0;

    if (!isNew) {
      const [updated] = await db
        .update(progressTable)
        .set({ score: score ?? null, completedAt: new Date() })
        .where(eq(progressTable.lessonId, lessonId))
        .returning();
      progressEntry = updated;
    } else {
      const [inserted] = await db
        .insert(progressTable)
        .values({ lessonId, score: score ?? null })
        .returning();
      progressEntry = inserted;
    }

    // Award XP to logged-in user for first completion
    const userId = (req.session as any).userId;
    if (userId && isNew) {
      const today = new Date().toISOString().split("T")[0];
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
      if (user) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        let newStreak = user.streak;
        if (user.lastActive !== today) {
          if (user.lastActive === yesterday) {
            newStreak = user.streak + 1;
          } else if (!user.lastActive) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
        }
        await db
          .update(usersTable)
          .set({ xp: sql`${usersTable.xp} + ${XP_PER_LESSON}`, streak: newStreak, lastActive: today })
          .where(eq(usersTable.id, userId));
      }
    }

    const [lesson] = await db
      .select({ titleAr: lessonsTable.titleAr, levelCode: levelsTable.code })
      .from(lessonsTable)
      .leftJoin(levelsTable, eq(lessonsTable.levelId, levelsTable.id))
      .where(eq(lessonsTable.id, lessonId));

    res.json({
      id: progressEntry.id,
      lessonId: progressEntry.lessonId,
      lessonTitleAr: lesson?.titleAr ?? "",
      levelCode: lesson?.levelCode ?? "",
      completedAt: progressEntry.completedAt.toISOString(),
      score: progressEntry.score ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
