import { useGetProgress, useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Clock, Target, CalendarDays, Award, Zap, Flame, Star, LogOut, User } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useAuth } from "@/contexts/auth-context";

export default function Progress() {
  const { user, logout } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: progressHistory, isLoading: progressLoading } = useGetProgress();

  const isLoading = statsLoading || progressLoading;

  const xpInLevel = user ? user.xp % 100 : 0;
  const xpPercent = xpInLevel;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Profile Card */}
      {user && (
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-l from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
          <CardContent className="p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">متعلم نشيط</p>
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="outline"
                size="sm"
                className="self-start text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>

            {/* 3 stat boxes */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-primary english-text">{user.xp}</span>
                </div>
                <p className="text-xs text-muted-foreground english-text">XP</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400 english-text">{user.streak}</span>
                </div>
                <p className="text-xs text-muted-foreground">يوم متتالي</p>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Star className="h-4 w-4 text-secondary" />
                  <span className="text-2xl font-bold text-secondary english-text">{user.level}</span>
                </div>
                <p className="text-xs text-muted-foreground">المستوى</p>
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  التقدم نحو المستوى <span className="text-primary font-bold english-text">{user.level + 1}</span>
                </span>
                <span className="font-bold text-primary english-text">{xpInLevel} / 100 XP</span>
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
              <p className="text-xs text-muted-foreground text-left english-text">
                {100 - xpInLevel} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>الدروس المكتملة</CardDescription>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-primary">{stats.completedLessons}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>إجمالي الدروس</CardDescription>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-muted-foreground">{stats.totalLessons}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-secondary/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>مستوى اللغة</CardDescription>
              <Award className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-secondary">{stats.currentLevel || "A1"}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>سلسلة الأيام</CardDescription>
              <Flame className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-orange-400">{stats.currentStreak}</CardTitle>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Level breakdown */}
      {stats?.levelBreakdown && stats.levelBreakdown.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">التقدم حسب المستوى</h2>
          <Card className="border-primary/10">
            <CardContent className="p-6 space-y-6">
              {stats.levelBreakdown.map((level) => {
                const percentage = level.total > 0 ? (level.completed / level.total) * 100 : 0;
                return (
                  <div key={level.levelCode} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold english-text text-lg">{level.levelCode}</span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {level.completed} / {level.total} درس
                      </span>
                    </div>
                    <ProgressBar value={percentage} className="h-3 [&>div]:bg-secondary" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      {/* History */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">سجل الإنجازات</h2>

        {(!progressHistory || progressHistory.length === 0) ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/50">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">لا يوجد إنجازات بعد</h3>
            <p className="text-muted-foreground/80 mt-2">ابدأ دراسة درسك الأول لتظهر هنا.</p>
          </div>
        ) : (
          <div className="relative border-r border-primary/20 mr-4 pr-6 space-y-6">
            {progressHistory.map((item) => (
              <div key={item.id} className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-secondary -right-[34px] top-1 border-4 border-background" />
                <div className="bg-card/50 border border-primary/10 p-4 rounded-xl hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-lg">{item.lessonTitleAr}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium english-text">
                          {item.levelCode}
                        </span>
                        {item.score !== null && (
                          <span className="text-xs text-secondary font-medium">
                            الاختبار: {item.score}%
                          </span>
                        )}
                        <span className="text-xs text-primary font-bold english-text">+50 XP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                      <CalendarDays className="h-4 w-4" />
                      <span className="english-text">
                        {format(new Date(item.completedAt), 'PP', { locale: ar })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
