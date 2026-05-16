import { useParams, Link } from "wouter";
import { useGetLevelById, useGetLessons, useGetTopics } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { useMemo } from "react";

export default function LevelDetail() {
  const { id } = useParams();
  const levelId = Number(id);

  const { data: level, isLoading: levelLoading } = useGetLevelById(levelId, { query: { enabled: !!levelId } });
  const { data: topics, isLoading: topicsLoading } = useGetTopics();
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons({ levelId }, { query: { enabled: !!levelId } });

  const isLoading = levelLoading || topicsLoading || lessonsLoading;

  const groupedLessons = useMemo(() => {
    if (!lessons || !topics) return {};
    
    return lessons.reduce((acc, lesson) => {
      if (!acc[lesson.topicId]) {
        acc[lesson.topicId] = [];
      }
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

          return (
            <div key={topic.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <span className="font-semibold text-secondary text-lg">{topic.nameAr}</span>
                </div>
                <span className="text-sm text-muted-foreground">{topicLessons.length} دروس</span>
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
                        <div className={`p-3 rounded-full ${lesson.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-primary/5 text-primary group-hover:bg-primary/10'}`}>
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
