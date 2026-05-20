import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customFetch } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SavedWord {
  id: number;
  word: string;
  translation: string | null;
  example: string | null;
  savedAt: string;
}

function speak(word: string) {
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

export default function SavedWords() {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"list" | "flashcard" | "add">("list");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExample, setNewExample] = useState("");

  const { data: words = [], isLoading } = useQuery<SavedWord[]>({
    queryKey: ["saved-words"],
    queryFn: () => customFetch<SavedWord[]>("/api/saved-words"),
  });

  const addMutation = useMutation({
    mutationFn: (data: { word: string; translation?: string; example?: string }) =>
      customFetch<SavedWord>("/api/saved-words", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-words"] });
      setNewWord("");
      setNewTranslation("");
      setNewExample("");
      setMode("list");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      customFetch(`/api/saved-words/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-words"] }),
  });

  const handleAdd = () => {
    if (!newWord.trim()) return;
    addMutation.mutate({ word: newWord, translation: newTranslation || undefined, example: newExample || undefined });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (mode === "add") {
    return (
      <div className="max-w-md mx-auto space-y-4 py-4" dir="rtl">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("list")} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
          <h2 className="text-lg font-bold text-white">إضافة كلمة جديدة</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">الكلمة بالإنجليزية *</label>
            <input
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="e.g. perseverance"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary text-left"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">الترجمة (اختياري)</label>
            <input
              value={newTranslation}
              onChange={e => setNewTranslation(e.target.value)}
              placeholder="مثابرة"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">مثال (اختياري)</label>
            <input
              value={newExample}
              onChange={e => setNewExample(e.target.value)}
              placeholder="She showed great perseverance."
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary text-left"
              dir="ltr"
            />
          </div>
        </div>
        <Button onClick={handleAdd} disabled={!newWord.trim() || addMutation.isPending} className="w-full h-11">
          {addMutation.isPending ? "جارٍ الحفظ..." : "حفظ الكلمة"}
        </Button>
      </div>
    );
  }

  if (mode === "flashcard" && words.length > 0) {
    const card = words[cardIdx];
    return (
      <div className="max-w-md mx-auto space-y-6 py-4 text-center" dir="rtl">
        <div className="flex items-center justify-between">
          <button onClick={() => setMode("list")} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
          <p className="text-sm text-muted-foreground">{cardIdx + 1} / {words.length}</p>
          <span />
        </div>

        <motion.div
          onClick={() => setFlipped(f => !f)}
          className="relative h-52 cursor-pointer"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipped ? "back" : "front"}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`absolute inset-0 rounded-3xl border flex flex-col items-center justify-center p-6 ${
                flipped ? "bg-primary/10 border-primary/30" : "bg-card border-border"
              }`}
            >
              {flipped ? (
                <>
                  <p className="text-sm text-primary mb-2">الترجمة</p>
                  <p className="text-3xl font-bold text-white">{card.translation || "—"}</p>
                  {card.example && (
                    <p className="text-sm text-muted-foreground mt-4 italic">"{card.example}"</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-2">الكلمة</p>
                  <p className="text-4xl font-bold text-white">{card.word}</p>
                  <button onClick={e => { e.stopPropagation(); speak(card.word); }}
                    className="mt-4 text-primary hover:text-primary/80">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">اضغط لترى الترجمة</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
            disabled={cardIdx === 0}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-white disabled:opacity-30"
          ><ChevronRight className="w-5 h-5" /></button>
          <button onClick={() => { setFlipped(false); }}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-white">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setCardIdx(i => Math.min(words.length - 1, i + 1)); setFlipped(false); }}
            disabled={cardIdx === words.length - 1}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-white disabled:opacity-30"
          ><ChevronLeft className="w-5 h-5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 py-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">كلماتي المحفوظة</h1>
            <p className="text-xs text-muted-foreground">{words.length} كلمة</p>
          </div>
        </div>
        <div className="flex gap-2">
          {words.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => { setCardIdx(0); setFlipped(false); setMode("flashcard"); }}>
              بطاقات تعليمية
            </Button>
          )}
          <Button size="sm" onClick={() => setMode("add")} className="gap-1">
            <Plus className="w-4 h-4" /> إضافة
          </Button>
        </div>
      </div>

      {words.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">لا توجد كلمات محفوظة بعد</p>
          <Button onClick={() => setMode("add")} variant="outline">أضف أول كلمة</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {words.map(w => (
            <motion.div key={w.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white text-left">{w.word}</p>
                  <button onClick={() => speak(w.word)} className="text-muted-foreground hover:text-primary flex-shrink-0">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {w.translation && <p className="text-sm text-muted-foreground">{w.translation}</p>}
                {w.example && <p className="text-xs text-muted-foreground/60 italic text-left truncate">"{w.example}"</p>}
              </div>
              <button onClick={() => deleteMutation.mutate(w.id)}
                className="text-muted-foreground hover:text-destructive flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
