import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, ChevronLeft, ChevronRight, Trophy, ClipboardList } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface PlacementQuestion {
  id: number;
  questionAr: string;
  options: string[];
  levelCode: string;
}

interface PlacementResult {
  recommendedLevel: string;
  recommendedLevelName: string;
  score: number;
  total: number;
  scoreByLevel: Record<string, { correct: number; total: number }>;
}

const LEVEL_LABELS: Record<string, string> = {
  A1: "المبتدئ",
  A2: "المبتدئ المتقدم",
  B1: "المتوسط",
  B2: "المتوسط المتقدم",
  C1: "المتقدم",
  C2: "الإتقان",
};

export default function PlacementTest() {
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/api/placement-test`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (optionIndex: number) => {
    const q = questions[current];
    setAnswers(prev => ({ ...prev, [q.id]: optionIndex }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/placement-test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (result) {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-secondary/10 rounded-full p-6">
              <Trophy className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">نتيجة الاختبار</h1>
          <p className="text-muted-foreground text-lg">
            أجبت بشكل صحيح على <strong>{result.score}</strong> من أصل <strong>{result.total}</strong> سؤال
          </p>
        </div>

        <Card className="border-secondary/30 bg-secondary/5">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-muted-foreground">مستواك المقترح</p>
            <div className="text-4xl font-bold text-secondary english-text">{result.recommendedLevel}</div>
            <div className="text-2xl font-bold">{result.recommendedLevelName}</div>
            <p className="text-sm text-muted-foreground">
              تم فتح جميع المستويات من A1 حتى {result.recommendedLevel}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-semibold text-lg">أداؤك في كل مستوى</h2>
          {levels.map(lvl => {
            const s = result.scoreByLevel[lvl];
            if (!s) return null;
            const pct = s.total > 0 ? (s.correct / s.total) * 100 : 0;
            return (
              <div key={lvl} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium english-text">{lvl}</span>
                  <span className="text-muted-foreground">{s.correct}/{s.total}</span>
                </div>
                <Progress value={pct} className="h-2 [&>div]:bg-secondary" />
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/levels")}>
            العودة للمستويات
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/levels`)}>
            ابدأ التعلم
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;

  const progressPct = ((current + 1) / questions.length) * 100;
  const isAnswered = answers[q.id] !== undefined;
  const isLastQuestion = current === questions.length - 1;
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const levelGroup = Math.ceil((current + 1) / 5);
  const levelCode = ["A1", "A2", "B1", "B2", "C1", "C2"][levelGroup - 1] ?? "A1";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 py-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">اختبار تحديد المستوى</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {current + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-2 [&>div]:bg-primary" />
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium english-text">
            {levelCode}
          </span>
          <span className="text-xs text-muted-foreground">{LEVEL_LABELS[levelCode]}</span>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold leading-relaxed">{q.questionAr}</h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all font-medium
                    ${selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}
                >
                  <span className="english-text text-muted-foreground ml-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={current === 0}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        <div className="flex gap-2 flex-wrap justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all
                ${i === current
                  ? "bg-primary text-primary-foreground"
                  : answers[questions[i]?.id] !== undefined
                    ? "bg-secondary/30 text-secondary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="flex items-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            إرسال الاختبار
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center gap-2"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
