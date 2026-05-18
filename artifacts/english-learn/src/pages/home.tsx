import { useGetLevels, useGetLessons, useGetStatsOverview } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, Loader2, Sparkles, Book, Zap, Flame, Star, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AdBanner } from "@/components/ad-banner";

export default function Home() {
  const { user } = useAuth();
  const { data: levels, isLoading: levelsLoading } = useGetLevels();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: recentLessons, isLoading: lessonsLoading } = useGetLessons({}, { query: { enabled: true } });

  const isLoading = levelsLoading || statsLoading || lessonsLoading;

  const xpInLevel = user ? user.xp % 100 : 0;
  const xpToNext = 100;
  const xpPercent = xpInLevel;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* User Dashboard Card */}
      {user && (
        <Card className="relative overflow-hidden border-primary/20 bg-card">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <CardContent className="p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Welcome */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">مرحباً بك،</p>
                <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
                <p className="text-sm text-muted-foreground">استمر في التعلم واكسب المزيد من الـ XP</p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col items-center gap-1 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 min-w-[80px]">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold text-primary english-text">{user.xp}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-3 min-w-[80px]">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-xl font-bold text-orange-400 english-text">{user.streak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">يوم متتالي</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-3 min-w-[80px]">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-secondary" />
                    <span className="text-xl font-bold text-secondary english-text">{user.level}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">المستوى</span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  التقدم نحو المستوى <span className="text-primary font-bold english-text">{user.level + 1}</span>
                </span>
                <span className="font-bold text-primary english-text">{xpInLevel} / {xpToNext} XP</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${xpPercent}%`,
                    background: "linear-gradient(90deg, #5B7CFF, #7F5AF0)"
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero */}
      <section className="relative py-10 md:py-16 overflow-hidden rounded-3xl bg-primary/5 border border-primary/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="relative px-6 md:px-12 flex flex-col items-center text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-sm text-secondary-foreground font-medium border border-secondary/30">
            <Sparkles className="h-4 w-4" />
            <span>رحلتك نحو الإتقان تبدأ هنا</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
            تعلّم الإنجليزية <br /> بثقة وهدوء
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            من الأساسيات حتى الاحتراف. منهجية علمية ومحتوى متكامل صُمم خصيصاً للمتعلم العربي الطموح.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <Button size="lg" className="text-lg px-8 rounded-xl" asChild>
              <Link href="/levels">ابدأ رحلتك الآن</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 rounded-xl" asChild>
              <Link href="/progress">تابع تقدمك</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
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
              <CardDescription>مستوى اللغة</CardDescription>
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

      {/* Ad between hero and levels */}
      <AdBanner slot="0987654321" format="horizontal" />

      {/* Levels */}
      <section className="space-y-6">
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

      {/* Suggested lessons */}
      {recentLessons && recentLessons.length > 0 && (
        <section className="space-y-6 pb-12">
          <h2 className="text-2xl font-bold text-primary">دروس مقترحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentLessons.filter(l => !l.completed).slice(0, 4).map((lesson) => (
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
