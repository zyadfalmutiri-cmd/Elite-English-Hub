import { Router } from "express";
import { ensureCompatibleFormat, speechToText } from "@workspace/integrations-openai-ai-server/audio";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ error: "غير مسجل" });
  next();
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z\s]/g, "").trim();
}

function checkPronunciation(transcribed: string, target: string): boolean {
  const t = normalize(transcribed);
  const w = normalize(target);
  if (!t || !w) return false;
  if (t === w) return true;
  if (t.includes(w)) return true;
  const words = t.split(/\s+/);
  return words.some((word) => word === w || levenshtein(word, w) <= 1);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

router.post("/pronunciation/check", requireAuth, async (req: any, res: any) => {
  try {
    const { audio, targetWord } = req.body;
    if (!audio || !targetWord) {
      return res.status(400).json({ error: "الصوت والكلمة مطلوبان" });
    }

    const audioBuffer = Buffer.from(audio, "base64");
    const { buffer: wavBuffer, format } = await ensureCompatibleFormat(audioBuffer);

    const transcribed = await speechToText(wavBuffer, format);
    const correct = checkPronunciation(transcribed, targetWord);

    res.json({ correct, transcribed, targetWord });
  } catch (err: any) {
    res.status(500).json({ error: "خطأ في الخادم: " + err.message });
  }
});

export default router;
