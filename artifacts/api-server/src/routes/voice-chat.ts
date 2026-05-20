import { Router } from "express";
import { ensureCompatibleFormat, voiceChatStream } from "@workspace/integrations-openai-ai-server/audio";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

router.post("/voice-chat/message", requireAuth, async (req: any, res: any) => {
  try {
    const { audio } = req.body;
    if (!audio) return res.status(400).json({ error: "الصوت مطلوب" });

    const audioBuffer = Buffer.from(audio, "base64");
    const { buffer: wavBuffer, format } = await ensureCompatibleFormat(audioBuffer);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await voiceChatStream(wavBuffer, "alloy", format);

    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: "خطأ في الخادم" });
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
