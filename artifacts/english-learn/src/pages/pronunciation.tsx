import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ChevronRight, Trophy, Volume2, RotateCcw } from "lucide-react";
import { useVoiceRecorder } from "@workspace/integrations-openai-ai-react";
import { customFetch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

const WORDS = {
  easy: [
    "cat", "dog", "sun", "hat", "big", "run", "hot", "bed", "cup", "sit",
    "map", "pen", "red", "box", "ten", "fly", "sky", "zoo", "egg", "ant",
    "bus", "car", "sea", "ice", "owl", "bag", "lip", "fog", "mud", "net",
  ],
  medium: [
    "apple", "table", "water", "green", "happy", "phone", "light", "smile",
    "stand", "brave", "cloud", "dream", "floor", "grass", "heart", "large",
    "month", "night", "order", "place", "quiet", "river", "south", "think",
    "under", "value", "world", "young", "zebra", "blank",
  ],
  hard: [
    "beautiful", "opportunity", "communication", "pronunciation", "university",
    "vocabulary", "together", "understand", "experience", "important",
    "different", "question", "friendship", "knowledge", "adventure",
    "challenge", "encourage", "excellent", "furniture", "government",
    "hamburger", "interview", "journalist", "kilometer", "language",
  ],
  sentences: [
    "How are you", "Good morning", "Thank you very much", "Nice to meet you",
    "I would like water", "What is your name", "Have a good day",
    "See you later", "I am learning English", "Can you help me",
  ],
};

type Difficulty = keyof typeof WORDS;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Pronunciation() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"idle" | "recording" | "checking" | "correct" | "wrong">("idle");
  const [transcribed, setTranscribed] = useState("");
  const [done, setDone] = useState(false);
  const recorder = useVoiceRecorder();

  const currentWord = queue[currentIdx] ?? "";

  const startSession = (diff: Difficulty) => {
    const shuffled = shuffle(WORDS[diff]);
    setDifficulty(diff);
    setQueue(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setTotal(0);
    setStatus("idle");
    setDone(false);
    setTranscribed("");
  };

  const handleMic = useCallback(async () => {
    if (status === "recording") {
      setStatus("checking");
      const blob = await recorder.stop();
      if (!blob || blob.size < 500) { setStatus("idle"); return; }

      try {
        const reader = new FileReader();
        const base64: string = await new Promise((res, rej) => {
          reader.onload = () => {
            const result = reader.result as string;
            res(result.split(",")[1]);
          };
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });

        const result = await customFetch<{ correct: boolean; transcribed: string }>("/api/pronunciation/check", {
          method: "POST",
          body: JSON.stringify({ audio: base64, targetWord: currentWord }),
        });

        setTranscribed(result.transcribed);
        setTotal(t => t + 1);
        if (result.correct) {
          setScore(s => s + 1);
          setStatus("correct");
        } else {
          setStatus("wrong");
        }
      } catch {
        setStatus("idle");
      }
    } else if (status === "idle" || status === "correct" || status === "wrong") {
      setStatus("recording");
      setTranscribed("");
      await recorder.start();
    }
  }, [status, recorder, currentWord]);

  const next = () => {
    if (currentIdx + 1 >= queue.length) {
      setDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setStatus("idle");
      setTranscribed("");
    }
  };

  const speakWord = () => {
    const u = new SpeechSynthesisUtterance(currentWord);
    u.lang = "en-US";
    speechSynthesis.speak(u);
  };

  const diffLabels: Record<Difficulty, string> = {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
    sentences: "جمل",
  };
  const diffColors: Record<Difficulty, string> = {
    easy: "from-green-500 to-emerald-600",
    medium: "from-blue-500 to-indigo-600",
    hard: "from-red-500 to-rose-600",
    sentences: "from-purple-500 to-violet-600",
  };

  if (!difficulty) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-4" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">تدريبات النطق</h1>
          <p className="text-muted-foreground mt-1">اختر مستوى الصعوبة لتبدأ</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(diffLabels) as Difficulty[]).map(d => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.95 }}
              onClick={() => startSession(d)}
              className={`bg-gradient-to-br ${diffColors[d]} rounded-2xl p-5 text-center text-white font-bold text-lg shadow-lg`}
            >
              {diffLabels[d]}
              <p className="text-sm font-normal opacity-80 mt-1">{WORDS[d].length} كلمة</p>
            </motion.button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-white">كيف تعمل؟</p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span>١.</span> اختر مستوى الصعوبة</li>
            <li className="flex gap-2"><span>٢.</span> ستظهر لك كلمة عشوائية</li>
            <li className="flex gap-2"><span>٣.</span> اضغط 🎤 وانطق الكلمة بالإنجليزية</li>
            <li className="flex gap-2"><span>٤.</span> ستحصل على تقييم فوري لنطقك</li>
          </ul>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center space-y-6 py-8" dir="rtl">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">أحسنت!</h1>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-5xl font-bold text-white mb-1">{score}<span className="text-2xl text-muted-foreground">/{total}</span></p>
          <p className="text-muted-foreground">نسبة النجاح: {pct}%</p>
          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => startSession(difficulty)} className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" />
            مرة أخرى
          </Button>
          <Button variant="outline" onClick={() => setDifficulty(null)} className="flex-1">
            تغيير المستوى
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-4" dir="rtl">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{currentIdx + 1} / {queue.length}</span>
        <span className="font-bold text-green-400">✓ {score} صحيح</span>
      </div>
      <div className="h-2 bg-muted rounded-full">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${diffColors[difficulty]} transition-all`}
          style={{ width: `${((currentIdx) / queue.length) * 100}%` }}
        />
      </div>

      {/* Word card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card border border-border rounded-3xl p-8 text-center shadow-xl"
        >
          <p className="text-xs text-muted-foreground mb-4">انطق هذه الكلمة بالإنجليزية</p>
          <p className="text-4xl font-bold text-white mb-6 tracking-wide">{currentWord}</p>
          <button
            onClick={speakWord}
            className="flex items-center gap-2 mx-auto text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            استمع للنطق الصحيح
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {(status === "correct" || status === "wrong") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-4 text-center border ${
              status === "correct"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <p className="text-2xl mb-1">{status === "correct" ? "✅ صحيح!" : "❌ حاول مرة أخرى"}</p>
            {transcribed && (
              <p className="text-sm text-muted-foreground">
                ما سمعته: <span className="text-white italic">"{transcribed}"</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          onClick={handleMic}
          disabled={status === "checking"}
          whileTap={{ scale: 0.9 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            status === "recording"
              ? "bg-gradient-to-br from-red-500 to-rose-600"
              : status === "checking"
              ? "bg-gradient-to-br from-yellow-500 to-amber-600"
              : status === "correct"
              ? "bg-gradient-to-br from-green-500 to-emerald-600"
              : "bg-gradient-to-br from-primary to-purple-600"
          }`}
        >
          {status === "recording" ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : status === "checking" ? (
            <motion.div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </motion.button>
        <p className="text-sm text-muted-foreground">
          {status === "recording" ? "🔴 جارٍ التسجيل... اضغط للإيقاف"
            : status === "checking" ? "⏳ جارٍ التقييم..."
            : "اضغط للتسجيل"}
        </p>
      </div>

      {/* Next button */}
      {(status === "correct" || status === "wrong") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button onClick={next} className="w-full gap-2 h-12">
            {currentIdx + 1 >= queue.length ? "عرض النتيجة" : "الكلمة التالية"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
