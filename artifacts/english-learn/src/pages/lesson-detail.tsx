import { useParams, Link, useLocation } from "wouter";
import { useGetLessonById, useSaveProgress, getGetStatsOverviewQueryKey, getGetLessonsQueryKey, getGetLevelByIdQueryKey, getGetProgressQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, Play, BookOpen, Volume2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function LessonDetail() {
  const { id } = useParams();
  const lessonId = Number(id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: lesson, isLoading } = useGetLessonById(lessonId, { query: { enabled: !!lessonId } });
  const saveProgress = useSaveProgress();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) return <div className="text-center py-12">لم يتم العثور على الدرس</div>;

  const handleComplete = () => {
    saveProgress.mutate({ data: { lessonId } }, {
      onSuccess: () => {
        toast({
          title: "عمل رائع!",
          description: "لقد أتممت هذا الدرس بنجاح.",
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: getGetStatsOverviewQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetLessonsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetLevelByIdQueryKey(lesson.levelId) });
        queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
        
        // Move to quiz if available or back to level
        setLocation(`/quiz/${lessonId}`);
      }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 shrink-0">
          <Link href={`/levels/${lesson.levelId}`}>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-secondary/10 text-secondary text-sm px-2 py-1 rounded font-medium border border-secondary/20">
              {lesson.topicNameAr}
            </span>
            <span className="english-text text-muted-foreground font-medium">{lesson.levelCode}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{lesson.titleAr}</h1>
        </div>
      </div>

      <Card className="bg-card/50 border-primary/10 prose prose-lg max-w-none dark:prose-invert">
        <CardContent className="p-8">
          <div dangerouslySetInnerHTML={{ __html: lesson.contentAr || "" }} className="font-medium text-foreground leading-relaxed" />
        </CardContent>
      </Card>

      {lesson.examplesAr && lesson.examplesAr.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            أمثلة توضيحية
          </h2>
          <div className="space-y-4">
            {lesson.examplesAr.map((example, i) => (
              <Card key={i} className="border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 bg-primary/5 border-b md:border-b-0 md:border-l border-primary/10">
                      <div className="flex justify-between items-start gap-4">
                        <p className="english-text text-xl font-medium text-foreground">{example.english}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-full shrink-0">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 bg-card flex flex-col justify-center">
                      <p className="text-lg font-medium text-foreground">{example.arabicTranslation}</p>
                      {example.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{example.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {lesson.keyWordsAr && lesson.keyWordsAr.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-secondary" />
            كلمات مفتاحية
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lesson.keyWordsAr.map((kw, i) => (
              <Card key={i} className="border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <span className="english-text font-bold text-lg text-primary">{kw.english}</span>
                  <div className="h-px w-12 bg-secondary/30"></div>
                  <span className="font-medium text-foreground">{kw.arabicMeaning}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-8 border-t border-border/60">
        <Button 
          size="lg" 
          className="text-lg px-12 py-6 rounded-full h-auto flex items-center gap-3 shadow-lg shadow-primary/20"
          onClick={handleComplete}
          disabled={saveProgress.isPending}
        >
          {saveProgress.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-6 w-6" />
          )}
          أتممت الدرس، انتقل للاختبار
        </Button>
      </div>
    </div>
  );
}
