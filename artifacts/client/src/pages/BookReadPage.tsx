import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";

interface BookDetail {
  id: number;
  title: string;
  author: string;
  category: string;
  categoryAr: string;
  level: string;
  coverColor: string;
  description: string;
  descriptionAr: string;
  chapters: { title: string; content: string }[];
  questionsCount: number;
}

export default function BookReadPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readComplete, setReadComplete] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((r) => r.json())
      .then(setBook)
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    // Mark as read when user scrolls to bottom or after some time
    const timer = setTimeout(() => setReadComplete(true), 10000);
    return () => clearTimeout(timer);
  }, [currentChapter]);

  if (!book) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const chapter = book.chapters[currentChapter];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button onClick={() => setLocation("/books")} className="flex items-center gap-1 text-gray-400 mb-4">
        <ArrowRight size={16} />
        <span className="text-sm">العودة للمكتبة</span>
      </button>

      {/* Book Header */}
      <div className="bg-surface rounded-xl p-4 border border-border mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: book.coverColor }}
          >
            <BookOpen size={20} className="text-white/80" />
          </div>
          <div>
            <h1 className="font-bold" dir="ltr">{book.title}</h1>
            <p className="text-sm text-gray-400" dir="ltr">{book.author}</p>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
              {book.level}
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="bg-surface rounded-xl p-5 border border-border mb-4">
        <h2 className="font-bold text-primary mb-4" dir="ltr">{chapter.title}</h2>
        <div className="text-gray-200 text-sm leading-7 whitespace-pre-line" dir="ltr" style={{ fontFamily: "'Georgia', serif" }}>
          {chapter.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentChapter > 0 && (
          <button
            onClick={() => setCurrentChapter(currentChapter - 1)}
            className="flex-1 py-3 bg-surface border border-border text-white font-bold rounded-xl"
          >
            الفصل السابق
          </button>
        )}
        {currentChapter < book.chapters.length - 1 ? (
          <button
            onClick={() => setCurrentChapter(currentChapter + 1)}
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl"
          >
            الفصل التالي
          </button>
        ) : (
          <button
            onClick={() => setLocation(`/books/${id}/quiz`)}
            className="flex-1 py-3 bg-gradient-to-l from-primary to-secondary text-white font-bold rounded-xl"
          >
            ابدأ اختبار الفهم 🎯
          </button>
        )}
      </div>

      {readComplete && currentChapter === book.chapters.length - 1 && (
        <p className="text-center text-success text-sm mt-3">✅ أنهيت القراءة! جرب الاختبار الآن</p>
      )}
    </div>
  );
}
