import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => r.update(), 60 * 60 * 1000);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto" dir="rtl">
      <div className="bg-card border border-primary/30 rounded-2xl shadow-xl shadow-black/40 p-4 flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">تحديث جديد متاح</p>
          <p className="text-xs text-muted-foreground">اضغط للتحديث الآن</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" onClick={() => updateServiceWorker(true)} className="h-8 text-xs px-3">
            تحديث
          </Button>
          <button onClick={() => setNeedRefresh(false)} className="text-muted-foreground hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
