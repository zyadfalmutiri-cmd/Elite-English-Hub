import { Router } from "express";
import { db } from "@workspace/db";
import { quizQuestionsTable, progressTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitQuizBody } from "@workspace/api-zod";

const router = Router();

router.get("/quiz/:lessonId", async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    if (isNaN(lessonId)) return res.status(400).json({ error: "Invalid lessonId" });
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.lessonId, lessonId));
    if (questions.length === 0) return res.status(404).json({ error: "No quiz for this lesson" });
    res.json(
      questions.map((q) => ({
        id: q.id,
        lessonId: q.lessonId,
        questionAr: q.questionAr,
        options: JSON.parse(q.optionsJson),
        correctIndex: q.correctIndex,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/quiz/submit", async (req, res) => {
  try {
    const parsed = SubmitQuizBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid body" });
    const { lessonId, answers } = parsed.data;
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.lessonId, lessonId));
    if (questions.length === 0) return res.status(404).json({ error: "No quiz found" });

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 60;

    const existing = await db.select().from(progressTable).where(eq(progressTable.lessonId, lessonId));
    if (existing.length === 0) {
      await db.insert(progressTable).values({ lessonId, score });
    } else {
      if ((existing[0].score ?? 0) < score) {
        await db.update(progressTable).set({ score, completedAt: new Date() }).where(eq(progressTable.lessonId, lessonId));
      }
    }

    res.json({
      lessonId,
      score,
      total: questions.length,
      passed,
      feedback: passed
        ? `أحسنت! لقد اجتزت الاختبار بنجاح بنتيجة ${score}%.`
        : `حاول مرة أخرى. نتيجتك ${score}% والحد الأدنى للنجاح 60%.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
