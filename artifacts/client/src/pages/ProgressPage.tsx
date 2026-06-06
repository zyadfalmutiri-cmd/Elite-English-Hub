import { useEffect, useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";

interface Stats {
  totalLessons: number;
  completedLessons: number;
  currentLevel: string;
  currentStreak: number;
  levelBreakdown: { levelCode: string; total: number; completed: number }[];
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/progress/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const percentage = stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">تقدمي</h1>

      {/* Overall Progress */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-4 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none" stroke="#5B7CFF" strokeWidth="8"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{percentage}%</span>
          </div>
        </div>
        <p className="text-gray-400">أكملت {stats.completedLessons} من {stats.totalLessons} درس</p>
      </div>

      {/* Level Breakdown */}
      <h2 className="text-lg font-bold mb-3">التقدم حسب المستوى</h2>
      <div className="space-y-3">
        {stats.levelBreakdown.map((level) => {
          const pct = level.total > 0 ? Math.round((level.completed / level.total) * 100) : 0;
          return (
            <div key={level.levelCode} className="bg-surface rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{level.levelCode}</span>
                <span className="text-xs text-gray-400">{level.completed}/{level.total}</span>
              </div>
              <div className="w-full bg-surface-light rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
