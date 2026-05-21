import { Router } from "express";
import webpush from "web-push";
import { db } from "@workspace/db";
import { pushSubscriptionsTable, usersTable } from "@workspace/db";
import { eq, and, isNotNull } from "drizzle-orm";

const router = Router();

let vapidReady = false;

function ensureVapid(): boolean {
  if (vapidReady) return true;
  const pub = process.env["VAPID_PUBLIC_KEY"];
  const priv = process.env["VAPID_PRIVATE_KEY"];
  if (!pub || !priv) return false;
  webpush.setVapidDetails(
    process.env["VAPID_EMAIL"] ?? "mailto:admin@vot-english.app",
    pub,
    priv,
  );
  vapidReady = true;
  return true;
}

function requireAuth(req: any, res: any, next: any) {
  if (!(req.session as any).userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

router.get("/push/vapid-public-key", (_req, res) => {
  res.json({ key: process.env["VAPID_PUBLIC_KEY"] ?? "" });
});

router.post("/push/subscribe", requireAuth, async (req: any, res: any) => {
  if (!ensureVapid()) return res.status(503).json({ error: "Push not configured" });
  try {
    const userId = (req.session as any).userId;
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "بيانات الاشتراك ناقصة" });
    }
    await db
      .insert(pushSubscriptionsTable)
      .values({ userId, endpoint, p256dh: keys.p256dh, auth: keys.auth })
      .onConflictDoUpdate({
        target: pushSubscriptionsTable.endpoint,
        set: { p256dh: keys.p256dh, auth: keys.auth },
      });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/push/unsubscribe", requireAuth, async (req: any, res: any) => {
  try {
    const userId = (req.session as any).userId;
    const { endpoint } = req.body;
    await db
      .delete(pushSubscriptionsTable)
      .where(and(eq(pushSubscriptionsTable.endpoint, endpoint), eq(pushSubscriptionsTable.userId, userId)));
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function sendPush(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url?: string },
): Promise<boolean> {
  if (!ensureVapid()) return false;
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ ...payload, icon: "/pwa-192.png", badge: "/pwa-192.png" }),
    );
    return true;
  } catch (err: any) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      await db.delete(pushSubscriptionsTable).where(eq(pushSubscriptionsTable.endpoint, sub.endpoint));
    }
    return false;
  }
}

export function startStreakReminderJob() {
  const check = async () => {
    try {
      const users = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          streak: usersTable.streak,
          lastActive: usersTable.lastActive,
        })
        .from(usersTable)
        .where(isNotNull(usersTable.lastActive));

      const now = Date.now();

      for (const user of users) {
        if (!user.lastActive || user.streak === 0) continue;
        const hoursGone = (now - new Date(user.lastActive).getTime()) / (1000 * 60 * 60);
        // Only notify users who've been away 20-47 hours (streak at risk)
        if (hoursGone < 20 || hoursGone > 47) continue;

        const subs = await db
          .select()
          .from(pushSubscriptionsTable)
          .where(eq(pushSubscriptionsTable.userId, user.id));

        for (const sub of subs) {
          await sendPush(sub, {
            title: "🔥 حافظ على حماستك!",
            body: `لم تتدرب منذ ${Math.round(hoursGone)} ساعة — حماستك ${user.streak} يوم ستتصفر اليوم!`,
            url: "/",
          });
        }
      }
    } catch (err) {
      console.error("Streak reminder error:", err);
    }
  };

  setTimeout(check, 5 * 60 * 1000);
  setInterval(check, 60 * 60 * 1000);
}

export default router;
