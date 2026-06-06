import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle, Clock } from "lucide-react";

interface Lesson {
  id: number;
  titleAr: string;
  levelCode: string;
  topicNameAr: string;
  order: number;
  durationMinutes: number;
  completed: boolean;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const levelId = params.get("levelId");

  useEffect(() => {
    const url = levelId ? `/api/lessons?levelId=${levelId}` : "/api/lessons";
    fetch(url)
      .then((r) => r.json())
      .then(setLessons)
      .catch(() => {});
  }, [levelId]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">الدروس</h1>
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setLocation(`/lessons/${lesson.id}`)}
            className="w-full bg-surface border border-border rounded-xl p-4 text-right hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {lesson.levelCode}
                </span>
                <span className="text-xs text-gray-400">{lesson.topicNameAr}</span>
              </div>
              {lesson.completed && <CheckCircle size={16} className="text-success" />}
            </div>
            <h3 className="font-bold mt-2">{lesson.titleAr}</h3>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Clock size={12} />
              <span>{lesson.durationMinutes} دقيقة</span>
            </div>
          </button>
        ))}
        {lessons.length === 0 && (
          <p className="text-center text-gray-400 py-8">لا توجد دروس متاحة</p>
        )}
      </div>
    </div>
  );
}
