import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  questionAr: string;
  options: string[];
  correctIndex: number;
}

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  feedback: string;
}

export default function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch(`/api/quiz/${lessonId}`)
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => {});
  }, [lessonId]);

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      // Submit
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: Number(lessonId), answers: newAnswers }),
      })
        .then((r) => r.json())
        .then(setResult)
        .catch(() => {});
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-4 max-w-lg mx-auto text-center py-12">
        <p className="text-gray-400">لا توجد أسئلة لهذا الدرس</p>
        <button onClick={() => window.history.back()} className="mt-4 text-primary">
          رجوع
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-4 max-w-lg mx-auto text-center py-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${result.passed ? "bg-success/20" : "bg-error/20"}`}>
          {result.passed ? <CheckCircle size={40} className="text-success" /> : <XCircle size={40} className="text-error" />}
        </div>
        <h2 className="text-xl font-bold mb-2">{result.passed ? "أحسنت! 🎉" : "حاول مرة أخرى"}</h2>
        <p className="text-gray-400 mb-4">{result.feedback}</p>
        <p className="text-2xl font-bold text-primary mb-6">{result.score}/{result.total}</p>
        <button
          onClick={() => setLocation("/lessons")}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
        >
          العودة للدروس
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button onClick={() => window.history.back()} className="flex items-center gap-1 text-gray-400 mb-4">
        <ArrowRight size={16} />
        <span className="text-sm">رجوع</span>
      </button>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">السؤال {current + 1} من {questions.length}</span>
      </div>
      <div className="w-full bg-surface-light rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-4">
        <h2 className="text-lg font-bold">{q.questionAr}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="w-full bg-surface border border-border rounded-xl p-4 text-right hover:border-primary transition-colors"
          >
            <span className="text-sm">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
