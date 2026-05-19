import { useGetLevels, useGetStatsOverview } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CheckCircle2, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Levels() {
  const { data: levels, isLoading: levelsLoading } = useGetLevels();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const [placementResult, setPlacementResult] = useState<{
    recommendedLevel: string;
    recommendedLevelName: string;
    score: number;
    recommendedLevelOrder: number;
  } | null>(null);
  const [placementLoading, setPlacementLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/api/placement-test/result`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setPlacementResult(d.result);
        setPlacementLoading(false);
      })
      .catch(() => setPlacementLoading(false));
  }, []);

  const isLoading = levelsLoading || statsLoading || placementLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-primary">المستويات الدراسية</h1>
          <p className="text-muted-foreground mt-2 text-lg">اختر المستوى المناسب لتبدأ رحلة التعلم الخاصة بك.</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-secondary/40 text-secondary hover:bg-secondary/10"
          onClick={() => navigate("/placement-test")}
        >
          <ClipboardList className="h-5 w-5" />
          {placementResult ? "إعادة اختبار التحديد" : "اختبار تحديد المستوى"}
        </Button>
      </div>

      {!placementResult && (
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-start gap-3">
          <ClipboardList className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-secondary">لم تجرِ اختبار تحديد المستوى بعد</p>
            <p className="text-sm text-muted-foreground mt-1">
              أجرِ اختبار التحديد لفتح المستوى المناسب لك مباشرةً دون الحاجة إلى إتمام المستويات السابقة.
            </p>
          </div>
        </div>
      )}

      {placementResult && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary">
              مستواك المحدد: {placementResult.recommendedLevel} — {placementResult.recommendedLevelName}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              تم فتح جميع المستويات حتى {placementResult.recommendedLevelName} بناءً على نتيجة اختبارك.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels?.map((level: any) => {
          const breakdown = stats?.levelBreakdown.find((b: any) => b.levelCode === level.code);
          const progress = breakdown && breakdown.total > 0 ? (breakdown.completed / breakdown.total) * 100 : 0;
          const isLocked = level.locked;

          const card = (
            <Card
              className={`h-full transition-all border-primary/10 cursor-pointer group
                ${isLocked
                  ? "opacity-60 grayscale cursor-not-allowed bg-muted/20"
                  : "hover-elevate hover:border-primary/30"
                }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-primary english-text">{level.code}</span>
                  <div className="flex items-center gap-2">
                    {isLocked ? (
                      <span className="flex items-center gap-1.5 bg-muted text-muted-foreground text-sm px-3 py-1 rounded-md border border-muted-foreground/20">
                        <Lock className="h-4 w-4" />
                        مقفل
                      </span>
                    ) : (
                      <span className="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-md font-medium border border-secondary/20">
                        {level.lessonsCount} درس
                      </span>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl">{level.nameAr}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {level.descriptionAr}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mt-4 bg-muted/30 p-4 rounded-xl">
                  {isLocked ? (
                    <p className="text-sm text-muted-foreground text-center py-1">
                      أكمل المستوى السابق أو اجرِ اختبار التحديد لفتح هذا المستوى
                    </p>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm font-medium">
                        <span>نسبة الإنجاز</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2.5 [&>div]:bg-secondary" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{breakdown?.completed || 0} مكتمل</span>
                        <span>{breakdown?.total || level.lessonsCount} إجمالي</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );

          if (isLocked) return <div key={level.id}>{card}</div>;
          return <Link key={level.id} href={`/levels/${level.id}`}>{card}</Link>;
        })}
      </div>
    </div>
  );
}
