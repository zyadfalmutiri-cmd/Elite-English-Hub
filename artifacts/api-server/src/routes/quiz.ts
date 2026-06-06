import { Router } from "express";
import { db, quizQuestionsTable, progressTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export const quizRouter = Router();

quizRouter.get("/:lessonId", async (req, res) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.lessonId, lessonId));
    const result = questions.map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      questionAr: q.questionAr,
      options: JSON.parse(q.optionsJson),
      correctIndex: q.correctIndex,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

quizRouter.post("/submit", async (req, res) => {
  try {
    const { lessonId, answers } = req.body;
    if (!lessonId || !answers) {
      return res.status(400).json({ message: "lessonId and answers required" });
    }
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.lessonId, lessonId));

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctIndex) {
        score++;
      }
    }

    const total = questions.length;
    const passed = total > 0 ? score / total >= 0.7 : false;

    // Save progress
    await db.insert(progressTable).values({ lessonId, score });

    res.json({
      lessonId,
      score,
      total,
      passed,
      feedback: passed ? "أحسنت! لقد اجتزت الاختبار بنجاح 🎉" : "حاول مرة أخرى، أنت قريب من النجاح!",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
