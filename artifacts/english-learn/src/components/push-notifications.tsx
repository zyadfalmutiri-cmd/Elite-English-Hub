import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customFetch } from "@workspace/api-client-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushNotificationsBanner() {
  const [status, setStatus] = useState<"idle" | "asking" | "granted" | "denied" | "dismissed">("idle");
  const [vapidKey, setVapidKey] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (localStorage.getItem("push-dismissed")) { setStatus("dismissed"); return; }
    if (Notification.permission === "granted") { setStatus("granted"); return; }
    if (Notification.permission === "denied") { setStatus("denied"); return; }

    customFetch<{ key: string }>("/api/push/vapid-public-key")
      .then((r) => { setVapidKey(r.key); setStatus("asking"); })
      .catch(() => {});
  }, []);

  const subscribe = async () => {
    if (!vapidKey) return;
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setStatus("denied"); return; }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const json = sub.toJSON();
      await customFetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  };

  const dismiss = () => {
    setStatus("dismissed");
    localStorage.setItem("push-dismissed", "1");
  };

  if (status !== "asking") return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto" dir="rtl">
      <div className="bg-card border border-orange-500/30 rounded-2xl shadow-xl shadow-black/40 p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">لا تفقد حماستك! 🔥</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            سنذكّرك يومياً حتى لا تتصفر حماستك
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={subscribe} className="h-8 text-xs px-3 bg-orange-500 hover:bg-orange-600">
              تفعيل التنبيهات
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss} className="h-8 text-xs px-2 text-muted-foreground">
              لاحقاً
            </Button>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-white flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PushStatusIcon() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(Notification.permission === "granted");
  }, []);

  if (!("PushManager" in window)) return null;

  return (
    <div title={active ? "التنبيهات مفعّلة" : "التنبيهات معطّلة"}
      className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 border ${
        active ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-muted-foreground border-border"
      }`}>
      {active ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
    </div>
  );
}
