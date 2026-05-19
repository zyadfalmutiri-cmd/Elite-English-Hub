import { useParams, Link, useLocation } from "wouter";
import { useGetLevelById, useGetLessons, useGetTopics } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, PlayCircle, Clock, Lock } from "lucide-react";
import { useMemo, useEffect } from "react";

export default function LevelDetail() {
  const { id } = useParams();
  const levelId = Number(id);
  const [, navigate] = useLocation();

  const { data: level, isLoading: levelLoading } = useGetLevelById(levelId, { query: { enabled: !!levelId } });
  const { data: topics, isLoading: topicsLoading } = useGetTopics();
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons({ levelId }, { query: { enabled: !!levelId } });

  const isLoading = levelLoading || topicsLoading || lessonsLoading;

  // Redirect if locked
  useEffect(() => {
    if (!isLoading && (level as any)?.locked) {
      navigate("/levels");
    }
  }, [isLoading, level, navigate]);

  const groupedLessons = useMemo(() => {
    if (!lessons || !topics) return {};
    return lessons.reduce((acc, lesson) => {
      if (!acc[lesson.topicId]) acc[lesson.topicId] = [];
      acc[lesson.topicId].push(lesson);
      return acc;
    }, {} as Record<number, typeof lessons>);
  }, [lessons, topics]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!level) return <div className="text-center py-12">لم يتم العثور على المستوى</div>;

  if ((level as any).locked) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="bg-muted rounded-full p-6">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">هذا المستوى مقفل</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            أكمل المستوى السابق أو اجرِ اختبار تحديد المستوى لفتح هذا المستوى.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/levels">العودة للمستويات</Link>
          </Button>
          <Button asChild>
            <Link href="/placement-test">اختبار التحديد</Link>
          </Button>
        </div>
      </div>
    );
  }

  const topicIcons: Record<string, string> = {
    grammar: "📖",
    vocabulary: "📚",
    listening: "🎧",
    speaking: "🎤",
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 shrink-0">
          <Link href="/levels">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold english-text text-primary">{level.code}</span>
            <h1 className="text-3xl font-bold">{level.nameAr}</h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">{level.descriptionAr}</p>
        </div>
      </div>

      <div className="space-y-12">
        {topics?.map(topic => {
          const topicLessons = groupedLessons[topic.id];
          if (!topicLessons || topicLessons.length === 0) return null;

          const completedCount = topicLessons.filter(l => l.completed).length;
          const icon = topicIcons[topic.slug] ?? "📝";

          return (
            <div key={topic.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-semibold text-secondary text-lg">{topic.nameAr}</span>
                  <span className="text-sm text-muted-foreground">{topicLessons.length} دروس</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{topicLessons.length} مكتمل
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicLessons.sort((a, b) => a.order - b.order).map(lesson => (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <Card className={`hover-elevate cursor-pointer transition-all border-primary/10 ${lesson.completed ? 'bg-muted/30 border-l-4 border-l-green-500' : 'hover:border-primary/30'}`}>
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-lg">{lesson.titleAr}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {lesson.durationMinutes} دقيقة
                            </span>
                            {lesson.completed && (
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                مكتمل
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`p-3 rounded-full ${lesson.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-primary/5 text-primary'}`}>
                          {lesson.completed ? <CheckCircle2 className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
