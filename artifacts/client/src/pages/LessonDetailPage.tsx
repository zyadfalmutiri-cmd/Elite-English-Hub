import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";

interface LessonDetail {
  id: number;
  titleAr: string;
  levelCode: string;
  topicNameAr: string;
  durationMinutes: number;
  contentAr: string;
  examplesAr: { english: string; arabicTranslation: string; notes?: string }[];
  keyWordsAr: { english: string; arabicMeaning: string }[];
}

export default function LessonDetailPage() {
  const params = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch(`/api/lessons/${params.id}`)
      .then((r) => r.json())
      .then(setLesson)
      .catch(() => {});
  }, [params.id]);

  if (!lesson) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button onClick={() => window.history.back()} className="flex items-center gap-1 text-gray-400 mb-4">
        <ArrowRight size={16} />
        <span className="text-sm">رجوع</span>
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{lesson.levelCode}</span>
        <span className="text-xs text-gray-400">{lesson.topicNameAr}</span>
      </div>

      <h1 className="text-xl font-bold mb-4">{lesson.titleAr}</h1>

      {/* Content */}
      <div className="bg-surface rounded-xl p-4 border border-border mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-primary" />
          <h2 className="font-bold">الشرح</h2>
        </div>
        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {lesson.contentAr}
        </div>
      </div>

      {/* Examples */}
      {lesson.examplesAr.length > 0 && (
        <div className="bg-surface rounded-xl p-4 border border-border mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-warning" />
            <h2 className="font-bold">أمثلة</h2>
          </div>
          <div className="space-y-3">
            {lesson.examplesAr.map((ex, i) => (
              <div key={i} className="bg-surface-light rounded-lg p-3">
                <p className="text-primary font-medium text-sm" dir="ltr">{ex.english}</p>
                <p className="text-gray-300 text-sm mt-1">{ex.arabicTranslation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {lesson.keyWordsAr.length > 0 && (
        <div className="bg-surface rounded-xl p-4 border border-border mb-4">
          <h2 className="font-bold mb-3">📝 كلمات مفتاحية</h2>
          <div className="grid grid-cols-2 gap-2">
            {lesson.keyWordsAr.map((kw, i) => (
              <div key={i} className="bg-surface-light rounded-lg p-2 text-center">
                <p className="text-primary text-sm font-medium" dir="ltr">{kw.english}</p>
                <p className="text-gray-400 text-xs mt-1">{kw.arabicMeaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Button */}
      <button
        onClick={() => setLocation(`/quiz/${lesson.id}`)}
        className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
      >
        ابدأ الاختبار 🎯
      </button>
    </div>
  );
}
