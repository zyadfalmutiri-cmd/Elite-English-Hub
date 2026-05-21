import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show || !deferredPrompt) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto" dir="rtl">
      <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/40 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">ثبّت التطبيق</p>
          <p className="text-xs text-muted-foreground">يعمل بدون إنترنت ويفتح كتطبيق</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" onClick={handleInstall} className="h-8 text-xs px-3">تثبيت</Button>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
