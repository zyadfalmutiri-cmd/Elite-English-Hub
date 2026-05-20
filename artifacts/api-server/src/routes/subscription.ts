import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const SUBSCRIPTION_CODES = new Map<string, number>();

function requireAuth(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

router.get("/subscription/status", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.json({ isSubscribed: user.isSubscribed, subscribedAt: user.subscribedAt });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/subscription/request", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    SUBSCRIPTION_CODES.set(code, userId);

    setTimeout(() => SUBSCRIPTION_CODES.delete(code), 24 * 60 * 60 * 1000);

    res.json({
      orderId: code,
      amount: 2,
      currency: "SAR",
      iban: "SA0380000000608010167519",
      accountName: "منصة تعلّم الإنجليزية",
      instructions: `حوّل مبلغ 2 ريال سعودي إلى الحساب أعلاه مع ذكر رمز الطلب: ${code}`,
    });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/subscription/activate", requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = (req.session as any).userId;

    if (!code) return res.status(400).json({ error: "الرمز مطلوب" });

    const targetUserId = SUBSCRIPTION_CODES.get(code.toUpperCase());
    if (!targetUserId || targetUserId !== userId) {
      return res.status(400).json({ error: "رمز غير صحيح أو منتهي الصلاحية" });
    }

    await db.update(usersTable)
      .set({ isSubscribed: true, subscribedAt: new Date() })
      .where(eq(usersTable.id, userId));

    SUBSCRIPTION_CODES.delete(code.toUpperCase());
    res.json({ success: true, message: "تم تفعيل الاشتراك بنجاح!" });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/subscription/admin-activate", async (req, res) => {
  try {
    const { username, adminKey } = req.body;
    if (adminKey !== (process.env["ADMIN_KEY"] ?? "admin-secret-2024")) {
      return res.status(403).json({ error: "غير مصرح" });
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });

    await db.update(usersTable)
      .set({ isSubscribed: true, subscribedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    res.json({ success: true, message: `تم تفعيل اشتراك ${username}` });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
