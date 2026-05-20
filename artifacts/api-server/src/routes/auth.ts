import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody } from "@workspace/api-zod";

const router = Router();

function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    username: user.username,
    xp: user.xp,
    streak: user.streak,
    level: getLevel(user.xp),
    lastActive: user.lastActive ?? null,
    isSubscribed: user.isSubscribed,
  };
}

async function updateStreak(userId: number) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = user.streak;
  if (user.lastActive === today) {
    return;
  } else if (user.lastActive === yesterday) {
    newStreak = user.streak + 1;
  } else {
    newStreak = 1;
  }

  await db.update(usersTable).set({ streak: newStreak, lastActive: today }).where(eq(usersTable.id, userId));
}

router.post("/auth/register", async (req, res) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "بيانات غير صحيحة" });

    const { username, password } = parsed.data;
    if (username.length < 3) return res.status(400).json({ error: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" });
    if (password.length < 4) return res.status(400).json({ error: "كلمة المرور يجب أن تكون 4 أحرف على الأقل" });

    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username));
    if (existing.length > 0) return res.status(400).json({ error: "اسم المستخدم موجود بالفعل" });

    const passwordHash = await bcrypt.hash(password, 10);
    const today = new Date().toISOString().split("T")[0];

    const [user] = await db.insert(usersTable).values({ username, passwordHash, xp: 0, streak: 1, lastActive: today }).returning();

    (req.session as any).userId = user.id;
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "بيانات غير صحيحة" });

    const { username, password } = parsed.data;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    if (!user) return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });

    (req.session as any).userId = user.id;
    await updateStreak(user.id);

    const [updated] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
    res.json(formatUser(updated));
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ status: "ok" });
  });
});

router.get("/auth/me", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ error: "غير مسجل" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(401).json({ error: "غير مسجل" });

    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export { getLevel, updateStreak };
export default router;
