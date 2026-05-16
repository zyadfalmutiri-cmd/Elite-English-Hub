import { useGetLevels, useGetLessons, useGetStatsOverview } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Loader2, Sparkles, Book } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const { data: levels, isLoading: levelsLoading } = useGetLevels();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: recentLessons, isLoading: lessonsLoading } = useGetLessons({}, { query: { enabled: true } });

  const isLoading = levelsLoading || statsLoading || lessonsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="relative py-12 md:py-24 overflow-hidden rounded-3xl bg-primary/5 border border-primary/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div className="relative px-6 md:px-12 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-sm text-secondary-foreground font-medium border border-secondary/30">
            <Sparkles className="h-4 w-4" />
            <span>رحلتك نحو الإتقان تبدأ هنا</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
            تعلّم الإنجليزية <br /> بثقة وهدوء
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            من الأساسيات حتى الاحتراف. منهجية علمية ومحتوى متكامل صُمم خصيصاً للمتعلم العربي الطموح.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Button size="lg" className="text-lg px-8 rounded-xl" asChild>
              <Link href="/levels">
                ابدأ رحلتك الآن
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 rounded-xl" asChild>
              <Link href="/progress">
                تابع تقدمك
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription>الدروس المكتملة</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.completedLessons}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription>إجمالي الدروس</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.totalLessons}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription>المستوى الحالي</CardDescription>
              <CardTitle className="text-3xl text-secondary">{stats.currentLevel || "A1"}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription>أيام متتالية</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.currentStreak}</CardTitle>
            </CardHeader>
          </Card>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">المستويات الدراسية</h2>
            <p className="text-muted-foreground mt-1">تدرج في التعلم من البداية وحتى الإتقان</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex group">
            <Link href="/levels" className="gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels?.map((level) => {
            const breakdown = stats?.levelBreakdown.find(b => b.levelCode === level.code);
            const progress = breakdown && breakdown.total > 0 ? (breakdown.completed / breakdown.total) * 100 : 0;
            
            return (
              <Link key={level.id} href={`/levels/${level.id}`}>
                <Card className="h-full hover-elevate transition-all border-primary/10 hover:border-primary/30 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary english-text">{level.code}</span>
                      <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-md font-medium border border-secondary/20">
                        {level.lessonsCount} درس
                      </span>
                    </div>
                    <CardTitle className="text-xl">{level.nameAr}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 leading-relaxed">
                      {level.descriptionAr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>التقدم</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2 [&>div]:bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {recentLessons && recentLessons.length > 0 && (
        <section className="space-y-8 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">دروس مقترحة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentLessons.slice(0, 4).map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <Card className="hover-elevate cursor-pointer border-primary/10 hover:border-primary/30 transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-3 rounded-xl">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{lesson.titleAr}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="english-text bg-muted px-1.5 rounded">{lesson.levelCode}</span>
                          <span>{lesson.topicNameAr}</span>
                          <span>{lesson.durationMinutes} دقيقة</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
