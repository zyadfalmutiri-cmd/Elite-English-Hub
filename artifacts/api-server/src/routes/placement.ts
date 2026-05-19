import { Router } from "express";
import { db } from "@workspace/db";
import { placementQuestionsTable, userPlacementResultsTable, levelsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/placement-test", async (_req, res) => {
  try {
    const questions = await db
      .select()
      .from(placementQuestionsTable)
      .orderBy(asc(placementQuestionsTable.order));

    const result = questions.map((q) => ({
      id: q.id,
      questionAr: q.questionAr,
      options: JSON.parse(q.optionsJson),
      levelCode: q.levelCode,
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/placement-test/submit", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "غير مسجل الدخول" });

    const { answers } = req.body as { answers: Record<number, number> };

    const questions = await db
      .select()
      .from(placementQuestionsTable)
      .orderBy(asc(placementQuestionsTable.order));

    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const scoreByLevel: Record<string, { correct: number; total: number }> = {};
    levels.forEach((l) => (scoreByLevel[l] = { correct: 0, total: 0 }));

    let totalCorrect = 0;
    for (const q of questions) {
      scoreByLevel[q.levelCode].total++;
      if (answers[q.id] === q.correctIndex) {
        scoreByLevel[q.levelCode].correct++;
        totalCorrect++;
      }
    }

    // Find recommended level: highest level where user got ≥3/5
    let recommendedCode = "A1";
    for (const lvl of levels) {
      const s = scoreByLevel[lvl];
      if (s.correct >= 3) recommendedCode = lvl;
      else break;
    }

    const allLevels = await db.select().from(levelsTable).orderBy(levelsTable.order);
    const recommended = allLevels.find((l) => l.code === recommendedCode)!;

    // Save or update result
    const existing = await db
      .select()
      .from(userPlacementResultsTable)
      .where(eq(userPlacementResultsTable.userId, userId));

    if (existing.length > 0) {
      // Keep the highest recommended level
      const existingLevel = allLevels.find((l) => l.id === existing[0].recommendedLevelId);
      const newOrder = recommended.order;
      if (!existingLevel || newOrder > existingLevel.order) {
        await db
          .update(userPlacementResultsTable)
          .set({ recommendedLevelId: recommended.id, score: totalCorrect })
          .where(eq(userPlacementResultsTable.userId, userId));
      }
    } else {
      await db.insert(userPlacementResultsTable).values({
        userId,
        recommendedLevelId: recommended.id,
        score: totalCorrect,
      });
    }

    res.json({
      recommendedLevel: recommendedCode,
      recommendedLevelName: recommended.nameAr,
      score: totalCorrect,
      total: questions.length,
      scoreByLevel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/placement-test/result", async (req: any, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.json({ result: null });

    const [result] = await db
      .select()
      .from(userPlacementResultsTable)
      .where(eq(userPlacementResultsTable.userId, userId));

    if (!result) return res.json({ result: null });

    const [level] = await db
      .select()
      .from(levelsTable)
      .where(eq(levelsTable.id, result.recommendedLevelId));

    res.json({
      result: {
        recommendedLevel: level?.code ?? "A1",
        recommendedLevelName: level?.nameAr ?? "المبتدئ",
        score: result.score,
        recommendedLevelOrder: level?.order ?? 1,
      },
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
