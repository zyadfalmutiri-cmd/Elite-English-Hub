import { useState } from "wouter"; // Actually, we don't need wouter's useState, we need react's useState
import { useParams, Link } from "wouter";
import { useGetQuizByLesson, useSubmitQuiz, useGetLessonById, getGetProgressQueryKey, getGetStatsOverviewQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState as useReactState } from "react";

export default function Quiz() {
  const { lessonId } = useParams();
  const id = Number(lessonId);
  const queryClient = useQueryClient();

  const { data: lesson, isLoading: lessonLoading } = useGetLessonById(id, { query: { enabled: !!id } });
  const { data: questions, isLoading: questionsLoading } = useGetQuizByLesson(id, { query: { enabled: !!id } });
  const submitQuiz = useSubmitQuiz();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useReactState(0);
  const [answers, setAnswers] = useReactState<number[]>([]);
  const [result, setResult] = useReactState<any>(null);

  const isLoading = lessonLoading || questionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold">لا يوجد اختبار متاح لهذا الدرس حالياً</h2>
        <Button asChild>
          <Link href={`/lessons/${id}`}>العودة للدرس</Link>
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    submitQuiz.mutate({ data: { lessonId: id, answers } }, {
      onSuccess: (res) => {
        setResult(res);
        queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsOverviewQueryKey() });
      }
    });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 py-12">
        <Card className="text-center p-8 border-primary/20 bg-card/80 backdrop-blur">
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-center">
              <div className={`p-6 rounded-full ${result.passed ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                {result.passed ? <Trophy className="h-16 w-16" /> : <XCircle className="h-16 w-16" />}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                {result.passed ? 'ممتاز! لقد اجتزت الاختبار' : 'حاول مرة أخرى'}
              </h2>
              <p className="text-xl text-muted-foreground">{result.feedback}</p>
            </div>

            <div className="text-4xl font-bold english-text flex items-center justify-center gap-2">
              <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                {Math.round((result.score / result.total) * 100)}%
              </span>
            </div>
            <p className="text-muted-foreground">النتيجة: {result.score} من {result.total}</p>

            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="rounded-full px-8">
                <Link href={`/levels/${lesson?.levelId || ''}`}>متابعة التعلم</Link>
              </Button>
              {!result.passed && (
                <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => {
                  setResult(null);
                  setCurrentQuestionIdx(0);
                  setAnswers([]);
                }}>
                  إعادة الاختبار
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAnswered = answers[currentQuestionIdx] !== undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2">
          <Link href={`/lessons/${id}`}>
            <ArrowRight className="h-4 w-4" />
            العودة للدرس
          </Link>
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          سؤال {currentQuestionIdx + 1} من {questions.length}
        </div>
      </div>

      <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-secondary h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="border-primary/10 shadow-lg">
        <CardHeader className="bg-primary/5 pb-8 border-b border-primary/10">
          <CardTitle className="text-2xl font-bold text-center leading-relaxed">
            {currentQuestion.questionAr}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <Button
                key={idx}
                variant={answers[currentQuestionIdx] === idx ? "default" : "outline"}
                className={`h-auto min-h-[4rem] py-4 text-lg justify-start px-6 ${
                  answers[currentQuestionIdx] === idx 
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                    : 'border-border/60 hover:border-primary/40 hover:bg-primary/5'
                }`}
                onClick={() => handleSelectOption(idx)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full border-2 ${
                    answers[currentQuestionIdx] === idx 
                      ? 'border-primary-foreground/50 text-primary-foreground' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <span className="english-text text-left w-full block">{option}</span>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              size="lg" 
              onClick={handleNext} 
              disabled={!isAnswered || submitQuiz.isPending}
              className="px-8 rounded-full"
            >
              {submitQuiz.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 
                currentQuestionIdx < questions.length - 1 ? "التالي" : "إنهاء الاختبار"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
