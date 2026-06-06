import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Trophy, Flame, BookOpen, Target } from "lucide-react";

interface Stats {
  totalLessons: number;
  completedLessons: number;
  currentLevel: string;
  currentStreak: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/progress/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">مرحباً بك 👋</h1>
        <p className="text-gray-400 mt-1">واصل رحلتك في تعلم الإنجليزية</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-warning" />
            <span className="text-xs text-gray-400">المستوى</span>
          </div>
          <p className="text-xl font-bold">{stats?.currentLevel || "A1"}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-error" />
            <span className="text-xs text-gray-400">السلسلة</span>
          </div>
          <p className="text-xl font-bold">{stats?.currentStreak || 0} يوم</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-primary" />
            <span className="text-xs text-gray-400">الدروس</span>
          </div>
          <p className="text-xl font-bold">{stats?.completedLessons || 0}/{stats?.totalLessons || 0}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-success" />
            <span className="text-xs text-gray-400">التقدم</span>
          </div>
          <p className="text-xl font-bold">
            {stats && stats.totalLessons > 0
              ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-3">ابدأ الآن</h2>
      <div className="space-y-3">
        <button
          onClick={() => setLocation("/levels")}
          className="w-full bg-gradient-to-l from-primary to-secondary p-4 rounded-xl text-right"
        >
          <h3 className="font-bold text-white">المستويات التعليمية</h3>
          <p className="text-sm text-white/70 mt-1">من المبتدئ إلى المتقدم</p>
        </button>
        <button
          onClick={() => setLocation("/books")}
          className="w-full bg-gradient-to-l from-emerald-600 to-teal-500 p-4 rounded-xl text-right"
        >
          <h3 className="font-bold text-white">📚 مكتبة الكتب</h3>
          <p className="text-sm text-white/70 mt-1">اقرأ كتب إنجليزية واختبر فهمك</p>
        </button>
        <button
          onClick={() => setLocation("/lessons")}
          className="w-full bg-surface border border-border p-4 rounded-xl text-right"
        >
          <h3 className="font-bold">جميع الدروس</h3>
          <p className="text-sm text-gray-400 mt-1">تصفح كل الدروس المتاحة</p>
        </button>
      </div>
    </div>
  );
}
