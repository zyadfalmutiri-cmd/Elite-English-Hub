import { Router } from "express";
import { db, topicsTable } from "@workspace/db";

export const topicsRouter = Router();

topicsRouter.get("/", async (_req, res) => {
  try {
    const topics = await db.select().from(topicsTable);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
