import { useGetLevels, useGetStatsOverview } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function Levels() {
  const { data: levels, isLoading: levelsLoading } = useGetLevels();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();

  const isLoading = levelsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary">المستويات الدراسية</h1>
        <p className="text-muted-foreground mt-2 text-lg">اختر المستوى المناسب لتبدأ رحلة التعلم الخاصة بك.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels?.map((level) => {
          const breakdown = stats?.levelBreakdown.find(b => b.levelCode === level.code);
          const progress = breakdown && breakdown.total > 0 ? (breakdown.completed / breakdown.total) * 100 : 0;
          
          return (
            <Link key={level.id} href={`/levels/${level.id}`}>
              <Card className="h-full hover-elevate transition-all border-primary/10 hover:border-primary/30 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl font-bold text-primary english-text">{level.code}</span>
                    <span className="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-md font-medium border border-secondary/20">
                      {level.lessonsCount} درس
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{level.nameAr}</CardTitle>
                  <CardDescription className="mt-2 text-base leading-relaxed">
                    {level.descriptionAr}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-4 bg-muted/30 p-4 rounded-xl">
                    <div className="flex justify-between text-sm font-medium">
                      <span>نسبة الإنجاز</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 [&>div]:bg-secondary" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{breakdown?.completed || 0} مكتمل</span>
                      <span>{breakdown?.total || level.lessonsCount} إجمالي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
