import { Router } from "express";
import { db } from "@workspace/db";
import { levelsTable, lessonsTable, progressTable, userPlacementResultsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";

const router = Router();

router.get("/levels", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);

    const lessonCounts = await db
      .select({ levelId: lessonsTable.levelId, count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .groupBy(lessonsTable.levelId);
    const countMap = Object.fromEntries(lessonCounts.map((r) => [r.levelId, r.count]));

    // Get placement result for this user
    let placementOrder = 0;
    if (userId) {
      const [pr] = await db
        .select()
        .from(userPlacementResultsTable)
        .where(eq(userPlacementResultsTable.userId, userId));
      if (pr) {
        const [pl] = await db
          .select()
          .from(levelsTable)
          .where(eq(levelsTable.id, pr.recommendedLevelId));
        placementOrder = pl?.order ?? 0;
      }
    }

    // Completion per level
    const completionByLevel: Record<number, { completed: number; total: number }> = {};
    for (const lvl of levels) {
      const total = countMap[lvl.id] ?? 0;
      if (total === 0) { completionByLevel[lvl.id] = { completed: 0, total: 0 }; continue; }

      if (userId) {
        const [row] = await db
          .select({ completed: sql<number>`count(*)::int` })
          .from(progressTable)
          .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
          .where(and(eq(lessonsTable.levelId, lvl.id)));
        completionByLevel[lvl.id] = { completed: row?.completed ?? 0, total };
      } else {
        completionByLevel[lvl.id] = { completed: 0, total };
      }
    }

    const result = levels.map((l, idx) => {
      const comp = completionByLevel[l.id] ?? { completed: 0, total: 0 };
      let locked = false;

      if (l.order === 1) {
        locked = false; // A1 always unlocked
      } else {
        // Unlocked via placement test
        const unlockedByPlacement = placementOrder >= l.order;

        // Unlocked by completing previous level
        const prevLevel = levels[idx - 1];
        const prevComp = prevLevel ? completionByLevel[prevLevel.id] : null;
        const prevComplete = prevComp ? (prevComp.total > 0 && prevComp.completed >= prevComp.total) : false;

        locked = !unlockedByPlacement && !prevComplete;
      }

      return {
        id: l.id,
        code: l.code,
        nameAr: l.nameAr,
        descriptionAr: l.descriptionAr,
        order: l.order,
        color: l.color,
        lessonsCount: countMap[l.id] ?? 0,
        locked,
        completedLessons: comp.completed,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/levels/:id", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [level] = await db.select().from(levelsTable).where(eq(levelsTable.id, id));
    if (!level) return res.status(404).json({ error: "Level not found" });

    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessonsTable)
      .where(eq(lessonsTable.levelId, id));

    // Check locking
    let locked = false;
    if (level.order > 1) {
      const allLevels = await db.select().from(levelsTable).orderBy(levelsTable.order);
      const prevLevel = allLevels.find((l) => l.order === level.order - 1);

      // Check placement
      let placementOrder = 0;
      if (userId) {
        const [pr] = await db
          .select()
          .from(userPlacementResultsTable)
          .where(eq(userPlacementResultsTable.userId, userId));
        if (pr) {
          const [pl] = await db.select().from(levelsTable).where(eq(levelsTable.id, pr.recommendedLevelId));
          placementOrder = pl?.order ?? 0;
        }
      }

      const unlockedByPlacement = placementOrder >= level.order;

      if (!unlockedByPlacement && prevLevel && userId) {
        const [prevCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(lessonsTable)
          .where(eq(lessonsTable.levelId, prevLevel.id));
        const [prevDone] = await db
          .select({ done: sql<number>`count(*)::int` })
          .from(progressTable)
          .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
          .where(eq(lessonsTable.levelId, prevLevel.id));

        const total = prevCount?.count ?? 0;
        const done = prevDone?.done ?? 0;
        locked = total === 0 || done < total;
      } else if (!unlockedByPlacement) {
        locked = true;
      }
    }

    res.json({ ...level, lessonsCount: countRow?.count ?? 0, locked });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
