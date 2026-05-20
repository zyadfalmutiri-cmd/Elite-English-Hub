import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

async function requireSubscription(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user?.isSubscribed) {
    return res.status(403).json({ error: "يجب الاشتراك للوصول إلى هذه الميزة" });
  }
  next();
}

router.post("/ai-chat/conversations", requireAuth, requireSubscription, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const title = req.body.title || "محادثة جديدة";
    const [conv] = await db.insert(conversations).values({ title, userId }).returning();
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/ai-chat/conversations", requireAuth, requireSubscription, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const convs = await db.select().from(conversations).where(eq(conversations.userId, userId));
    res.json(convs);
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/ai-chat/conversations/:id/messages", requireAuth, requireSubscription, async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const msgs = await db.select().from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/ai-chat/conversations/:id/messages", requireAuth, requireSubscription, async (req, res) => {
  try {
    const convId = parseInt(req.params.id);
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "الرسالة فارغة" });

    await db.insert(messages).values({ conversationId: convId, role: "user", content });

    const history = await db.select().from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));

    const chatMessages = [
      {
        role: "system" as const,
        content: `أنت مساعد ذكي متخصص في تعليم اللغة الإنجليزية للناطقين بالعربية. 
اسمك "إنجلش بوت". تساعد المستخدمين على تعلم الإنجليزية بطريقة ممتعة وسهلة.
- اشرح القواعد والمفردات بالعربية مع أمثلة إنجليزية
- صحّح الأخطاء بلطف وشجّع المستخدم
- أجب على أسئلة اللغة الإنجليزية بوضوح
- إذا أرسل المستخدم جملة إنجليزية، صحّحها وأشرح الأخطاء
- كن ودوداً ومشجعاً دائماً`,
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const c = chunk.choices[0]?.delta?.content;
      if (c) {
        fullResponse += c;
        res.write(`data: ${JSON.stringify({ content: c })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
