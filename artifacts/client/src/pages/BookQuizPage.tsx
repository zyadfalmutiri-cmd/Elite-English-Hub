import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function BookQuizPage() {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch(`/api/books/${id}/questions`)
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => {});
  }, [id]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(index);

    setTimeout(() => {
      const newAnswers = [...answers, index];
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  if (questions.length === 0) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (showResult) {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correctIndex ? 1 : 0), 0);
    const passed = score / questions.length >= 0.7;

    return (
      <div className="p-4 max-w-lg mx-auto text-center py-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${passed ? "bg-success/20" : "bg-error/20"}`}>
          {passed ? <CheckCircle size={40} className="text-success" /> : <XCircle size={40} className="text-error" />}
        </div>
        <h2 className="text-xl font-bold mb-2">{passed ? "ممتاز! فهمك رائع 🎉" : "حاول مرة أخرى 📖"}</h2>
        <p className="text-gray-400 mb-2">
          {passed ? "أثبتّ فهمك الجيد لمحتوى الكتاب" : "أعد قراءة الكتاب وحاول مرة أخرى"}
        </p>
        <p className="text-3xl font-bold text-primary mb-6">{score}/{questions.length}</p>

        {/* Show answers review */}
        <div className="text-right space-y-2 mb-6">
          {questions.map((q, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm ${answers[i] === q.correctIndex ? "bg-success/10 border border-success/30" : "bg-error/10 border border-error/30"}`}>
              <p className="font-medium" dir="ltr">{q.question}</p>
              <p className="text-xs mt-1 text-gray-400" dir="ltr">
                Your answer: {q.options[answers[i]]} {answers[i] !== q.correctIndex && `| Correct: ${q.options[q.correctIndex]}`}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setLocation(`/books/${id}`)}
            className="flex-1 px-4 py-3 bg-surface border border-border text-white rounded-xl font-bold"
          >
            أعد القراءة
          </button>
          <button
            onClick={() => setLocation("/books")}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold"
          >
            المكتبة
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button onClick={() => setLocation(`/books/${id}`)} className="flex items-center gap-1 text-gray-400 mb-4">
        <ArrowRight size={16} />
        <span className="text-sm">العودة للكتاب</span>
      </button>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Question {current + 1} of {questions.length}</span>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Book Quiz</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-surface-light rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-4">
        <h2 className="text-lg font-bold" dir="ltr">{q.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((option, i) => {
          let borderClass = "border-border hover:border-primary";
          if (selectedAnswer !== null) {
            if (i === q.correctIndex) borderClass = "border-success bg-success/10";
            else if (i === selectedAnswer) borderClass = "border-error bg-error/10";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`w-full bg-surface border rounded-xl p-4 text-left transition-colors ${borderClass}`}
              dir="ltr"
            >
              <span className="text-sm">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
