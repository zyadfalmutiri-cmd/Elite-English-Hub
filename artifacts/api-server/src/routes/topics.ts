import { Router } from "express";
import { db } from "@workspace/db";
import { topicsTable } from "@workspace/db";

const router = Router();

router.get("/topics", async (_req, res) => {
  try {
    const topics = await db.select().from(topicsTable);
    res.json(topics.map((t) => ({ id: t.id, nameAr: t.nameAr, icon: t.icon, slug: t.slug })));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
