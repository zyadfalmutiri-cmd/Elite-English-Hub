import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/share-button";

type QuestionType = "fill" | "match" | "truefalse" | "choose";

interface Question {
  type: QuestionType;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

const ALL_QUESTIONS: Question[] = [
  // Fill in blank
  { type: "fill", question: "I ___ a student.", options: ["am", "is", "are", "be"], correct: 0, explanation: "مع I نستخدم am" },
  { type: "fill", question: "She ___ going to school.", options: ["is", "am", "are", "be"], correct: 0, explanation: "مع She نستخدم is" },
  { type: "fill", question: "They ___ playing football.", options: ["are", "is", "am", "was"], correct: 0, explanation: "مع They نستخدم are" },
  { type: "fill", question: "He ___ not happy today.", options: ["is", "am", "are", "were"], correct: 0, explanation: "مع He نستخدم is" },
  { type: "fill", question: "We ___ friends for ten years.", options: ["have been", "has been", "are been", "be"], correct: 0, explanation: "مع We نستخدم have been" },
  { type: "fill", question: "She ___ the book yesterday.", options: ["read", "reads", "reading", "readed"], correct: 0, explanation: "في الماضي نستخدم read (تُقرأ red)" },
  { type: "fill", question: "I will ___ you tomorrow.", options: ["call", "calls", "called", "calling"], correct: 0, explanation: "بعد will تأتي المصدر call" },
  { type: "fill", question: "___ you speak English?", options: ["Can", "Does", "Is", "Are"], correct: 0, explanation: "Can تستخدم لاستفسار عن قدرة" },

  // True/False
  { type: "truefalse", question: "The word 'quickly' is an adverb.", options: ["صحيح", "خطأ"], correct: 0, explanation: "نعم، quickly وصف للفعل = ظرف حال" },
  { type: "truefalse", question: "\"Running\" in \"I love running\" is a verb.", options: ["صحيح", "خطأ"], correct: 1, explanation: "خطأ — running هنا اسم مصدر (gerund)" },
  { type: "truefalse", question: "\"He\" is a subject pronoun.", options: ["صحيح", "خطأ"], correct: 0, explanation: "نعم، he ضمير رفع (فاعل)" },
  { type: "truefalse", question: "Adjectives come after nouns in English.", options: ["صحيح", "خطأ"], correct: 1, explanation: "خطأ — الصفة تأتي قبل الاسم: a big house" },
  { type: "truefalse", question: "\"Go\" is the past tense of \"went\".", options: ["صحيح", "خطأ"], correct: 1, explanation: "خطأ — went هو ماضي go، وليس العكس" },

  // Multiple choice (choose)
  { type: "choose", question: "What is the plural of 'child'?", options: ["childs", "children", "childes", "child"], correct: 1, explanation: "children جمع شاذ لـ child" },
  { type: "choose", question: "Which sentence is correct?", options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"], correct: 2, explanation: "مع she نستخدم doesn't + مصدر" },
  { type: "choose", question: "ما معنى كلمة 'grateful'?", options: ["غاضب", "ممتن", "حزين", "خائف"], correct: 1, explanation: "grateful = ممتن، شاكر" },
  { type: "choose", question: "ما معنى كلمة 'achieve'?", options: ["يفشل", "يحاول", "يحقق", "يرفض"], correct: 2, explanation: "achieve = يحقق، ينجز" },
  { type: "choose", question: "What is the opposite of 'ancient'?", options: ["old", "modern", "big", "slow"], correct: 1, explanation: "modern = عصري، عكس ancient = قديم" },
  { type: "choose", question: "Which word is a verb?", options: ["beautiful", "quickly", "freedom", "run"], correct: 3, explanation: "run فعل (يجري)" },

  // Match type (same as choose but with Arabic)
  { type: "match", question: "ما ترجمة 'determined'؟", options: ["مرتبك", "مصمم", "متردد", "خجول"], correct: 1, explanation: "determined = مصمم، عازم" },
  { type: "match", question: "ما ترجمة 'opportunity'؟", options: ["تحدي", "صعوبة", "فرصة", "نجاح"], correct: 2, explanation: "opportunity = فرصة" },
  { type: "match", question: "ما ترجمة 'perseverance'؟", options: ["مرونة", "مثابرة", "شجاعة", "حكمة"], correct: 1, explanation: "perseverance = مثابرة" },
  { type: "match", question: "ما ترجمة 'apologize'؟", options: ["يشكر", "يعتذر", "يرفض", "يطلب"], correct: 1, explanation: "apologize = يعتذر" },
  { type: "match", question: "ما ترجمة 'exhausted'؟", options: ["نشيط", "مبتهج", "منهك", "هادئ"], correct: 2, explanation: "exhausted = منهك، متعب جداً" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TYPE_LABELS: Record<QuestionType, { label: string; color: string }> = {
  fill:      { label: "أكمل الجملة",    color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  match:     { label: "اختر الترجمة",   color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  truefalse: { label: "صح أم خطأ",     color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  choose:    { label: "اختر الإجابة",   color: "bg-green-500/20 text-green-300 border-green-500/30" },
};

export default function InteractiveQuiz() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, 15));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setWrongAnswers([]);
    setStarted(true);
  }, []);

  const confirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    const q = questions[current];
    if (selected === q.correct) {
      setScore(s => s + 1);
    } else {
      setWrongAnswers(w => [...w, q]);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  if (!started) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8" dir="rtl">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">التحديات التفاعلية</h1>
        <p className="text-muted-foreground">15 سؤال من أنواع مختلفة — أكمل الجمل، صح وخطأ، واختر الإجابة</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {(Object.entries(TYPE_LABELS) as [QuestionType, { label: string; color: string }][]).map(([, v]) => (
            <div key={v.label} className={`border rounded-xl px-3 py-2 ${v.color}`}>{v.label}</div>
          ))}
        </div>

        <Button onClick={startQuiz} size="lg" className="w-full h-12 text-base">ابدأ التحدي</Button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";
    const shareText = `حققت ${score}/${questions.length} (${pct}%) في التحديات التفاعلية على VOT for English! ${emoji}`;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center space-y-5 py-6" dir="rtl">
        <div className="text-6xl">{emoji}</div>
        <h1 className="text-2xl font-bold text-white">انتهى التحدي!</h1>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <div className="text-5xl font-bold text-white">{score}<span className="text-2xl text-muted-foreground">/{questions.length}</span></div>
          <p className="text-muted-foreground">{pct}% نسبة نجاح</p>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"}`} />
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-right space-y-2">
            <p className="font-semibold text-red-400 text-sm mb-2">راجع هذه الأسئلة:</p>
            {wrongAnswers.map((q, i) => (
              <div key={i} className="text-xs text-muted-foreground border-t border-border/30 pt-2">
                <p className="text-white">{q.question}</p>
                <p className="text-green-400">✓ {q.options[q.correct]}</p>
                {q.explanation && <p className="text-muted-foreground">{q.explanation}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={startQuiz} className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" /> تحدي جديد
          </Button>
          <ShareButton text={shareText} title="نتيجتي في VOT for English" className="flex-1" />
        </div>
      </motion.div>
    );
  }

  const q = questions[current];
  const typeInfo = TYPE_LABELS[q.type];
  const isCorrect = confirmed && selected === q.correct;
  const isWrong = confirmed && selected !== q.correct;

  return (
    <div className="max-w-md mx-auto space-y-5 py-4" dir="rtl">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{current + 1} / {questions.length}</span>
        <span className="font-bold text-primary">✓ {score} صحيح</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
          style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
          className="space-y-4">
          {/* Type badge */}
          <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${typeInfo.color}`}>
            {typeInfo.label}
          </span>

          {/* Question */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-lg font-semibold text-white leading-relaxed">
              {q.type === "fill" ? (
                q.question.split("___").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-primary font-bold underline decoration-dotted">___</span>}
                  </span>
                ))
              ) : q.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, idx) => {
              let cls = "border border-border bg-card text-white hover:border-primary/50 hover:bg-primary/5";
              if (confirmed) {
                if (idx === q.correct) cls = "border-green-500 bg-green-500/10 text-green-300";
                else if (idx === selected) cls = "border-red-500 bg-red-500/10 text-red-300";
                else cls = "border-border bg-card text-muted-foreground opacity-60";
              } else if (selected === idx) {
                cls = "border-primary bg-primary/10 text-white";
              }
              return (
                <button key={idx} disabled={confirmed}
                  onClick={() => setSelected(idx)}
                  className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${cls}`}>
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    confirmed && idx === q.correct ? "border-green-500 text-green-400" :
                    confirmed && idx === selected ? "border-red-500 text-red-400" :
                    selected === idx ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                  }`}>{idx + 1}</span>
                  <span className={q.type === "fill" || q.type === "choose" ? "text-left" : ""}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 text-sm border flex items-start gap-2 ${isCorrect ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
              {isCorrect ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
              <span>{isCorrect ? "إجابة صحيحة! " : `الإجابة الصحيحة: ${q.options[q.correct]}. `}{q.explanation}</span>
            </motion.div>
          )}

          {/* Action */}
          {!confirmed ? (
            <Button onClick={confirm} disabled={selected === null} className="w-full h-11">تأكيد الإجابة</Button>
          ) : (
            <Button onClick={next} className="w-full h-11 gap-2">
              {current + 1 >= questions.length ? "عرض النتيجة" : "السؤال التالي"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
