import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function StreakWidget() {
  const { user } = useAuth();
  const prevStreak = useRef<number | null>(null);

  // Update app badge when streak changes
  useEffect(() => {
    if (!user) return;
    if ("setAppBadge" in navigator) {
      if (user.streak > 0) {
        (navigator as any).setAppBadge(user.streak).catch(() => {});
      } else {
        (navigator as any).clearAppBadge().catch(() => {});
      }
    }
    prevStreak.current = user.streak;
  }, [user?.streak]);

  if (!user || user.streak === 0) return null;

  const isAtRisk = (() => {
    const lastActive = (user as any).lastActive;
    if (!lastActive) return false;
    const hours = (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60);
    return hours > 16;
  })();

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-lg text-sm font-bold cursor-default select-none transition-all
        ${isAtRisk
          ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-red-500/20"
          : "bg-orange-500/15 border-orange-500/30 text-orange-400 shadow-orange-500/10"
        }`}
    >
      <Flame className="w-4 h-4" />
      <span>{user.streak}</span>
      {isAtRisk && <span className="text-xs font-medium">يوم!</span>}
    </div>
  );
}
