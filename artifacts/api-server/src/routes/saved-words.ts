import { Router } from "express";
import { db } from "@workspace/db";
import { savedWordsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

router.get("/saved-words", requireAuth, async (req: any, res: any) => {
  try {
    const userId = (req.session as any).userId;
    const words = await db
      .select()
      .from(savedWordsTable)
      .where(eq(savedWordsTable.userId, userId))
      .orderBy(savedWordsTable.savedAt);
    res.json(words);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/saved-words", requireAuth, async (req: any, res: any) => {
  try {
    const userId = (req.session as any).userId;
    const { word, translation, example } = req.body;
    if (!word?.trim()) return res.status(400).json({ error: "الكلمة مطلوبة" });
    const [inserted] = await db
      .insert(savedWordsTable)
      .values({ userId, word: word.trim(), translation: translation?.trim(), example: example?.trim() })
      .returning();
    res.json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/saved-words/:id", requireAuth, async (req: any, res: any) => {
  try {
    const userId = (req.session as any).userId;
    const id = Number(req.params.id);
    await db
      .delete(savedWordsTable)
      .where(and(eq(savedWordsTable.id, id), eq(savedWordsTable.userId, userId)));
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
