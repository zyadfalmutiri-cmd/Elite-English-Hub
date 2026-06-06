import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Star } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  categoryAr: string;
  level: string;
  coverColor: string;
  description: string;
  descriptionAr: string;
  chaptersCount: number;
  questionsCount: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  const categories = ["all", ...new Set(books.map((b) => b.category))];
  const filtered = filter === "all" ? books : books.filter((b) => b.category === filter);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">📚 مكتبة الكتب</h1>
        <p className="text-gray-400 mt-1">اقرأ كتب إنجليزية حقيقية واختبر فهمك</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === cat
                ? "bg-primary text-white"
                : "bg-surface-light text-gray-400 border border-border"
            }`}
          >
            {cat === "all" ? "الكل" : books.find((b) => b.category === cat)?.categoryAr || cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="space-y-4">
        {filtered.map((book) => (
          <button
            key={book.id}
            onClick={() => setLocation(`/books/${book.id}`)}
            className="w-full bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-colors"
          >
            <div className="flex">
              {/* Book Cover */}
              <div
                className="w-24 h-32 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: book.coverColor }}
              >
                <BookOpen size={28} className="text-white/80" />
              </div>
              {/* Book Info */}
              <div className="p-3 text-right flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {book.level}
                  </span>
                  <span className="text-xs text-gray-500">{book.categoryAr}</span>
                </div>
                <h3 className="font-bold text-sm mt-1" dir="ltr">{book.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{book.author}</p>
                <p className="text-xs text-gray-500 mt-2">{book.descriptionAr}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>📖 {book.chaptersCount} فصل</span>
                  <span>❓ {book.questionsCount} سؤال</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
