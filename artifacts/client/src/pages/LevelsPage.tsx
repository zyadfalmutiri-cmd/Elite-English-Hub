import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface Level {
  id: number;
  code: string;
  nameAr: string;
  descriptionAr: string;
  order: number;
  color: string;
  lessonsCount: number;
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/levels")
      .then((r) => r.json())
      .then(setLevels)
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">المستويات التعليمية</h1>
      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setLocation(`/lessons?levelId=${level.id}`)}
            className="w-full bg-surface border border-border rounded-xl p-4 text-right hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: level.color + "20", color: level.color }}
              >
                {level.code}
              </span>
              <span className="text-xs text-gray-400">{level.lessonsCount} درس</span>
            </div>
            <h3 className="font-bold mt-2">{level.nameAr}</h3>
            <p className="text-sm text-gray-400 mt-1">{level.descriptionAr}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
