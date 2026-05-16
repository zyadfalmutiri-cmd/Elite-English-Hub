import { useGetProgress, useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Loader2, Trophy, Clock, Target, CalendarDays, Award } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Progress() {
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: progressHistory, isLoading: progressLoading } = useGetProgress();

  const isLoading = statsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-primary">مسيرتي التعليمية</h1>
        <p className="text-muted-foreground mt-2 text-lg">تابع تقدمك وإنجازاتك في رحلة تعلم الإنجليزية.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <BookIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-muted-foreground">{stats.totalLessons}</CardTitle>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10 bg-secondary/5 border-secondary/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription className="text-secondary-foreground/80">المستوى الحالي</CardDescription>
              <Award className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-secondary">{stats.currentLevel || "A1"}</CardTitle>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>أيام متتالية</CardDescription>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-primary">{stats.currentStreak}</CardTitle>
            </CardContent>
          </Card>
        </div>
      )}

      {stats?.levelBreakdown && stats.levelBreakdown.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">التقدم حسب المستوى</h2>
          <Card className="border-primary/10">
            <CardContent className="p-6 space-y-6">
              {stats.levelBreakdown.map((level) => {
                const percentage = level.total > 0 ? (level.completed / level.total) * 100 : 0;
                return (
                  <div key={level.levelCode} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold english-text text-lg">{level.levelCode}</span>
                      <span className="text-sm font-medium">{level.completed} / {level.total}</span>
                    </div>
                    <ProgressBar value={percentage} className="h-3 [&>div]:bg-secondary" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">سجل الإنجازات</h2>
        
        {(!progressHistory || progressHistory.length === 0) ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/50">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">لا يوجد إنجازات بعد</h3>
            <p className="text-muted-foreground/80 mt-2">ابدأ دراسة درسك الأول لتظهر هنا.</p>
          </div>
        ) : (
          <div className="relative border-r border-primary/20 mr-4 pr-6 space-y-8">
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
                            نتيجة الاختبار: {item.score}
                          </span>
                        )}
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

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
