import { Link, useLocation } from "wouter";
import { LogOut, Zap, Flame, Star, Home, Layers, Mic, Grid3X3, BookOpenCheck } from "lucide-react";
import logoImg from "/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const bottomTabs = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/levels", label: "المستويات", icon: Layers },
  { href: "/voice-chat", label: "محادثة", icon: Mic, accent: true },
  { href: "/pronunciation", label: "تدريبات", icon: BookOpenCheck },
  { href: "/more", label: "المزيد", icon: Grid3X3 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl flex h-14 items-center justify-between px-4 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={logoImg} alt="VOT for English" className="h-9 w-auto" />
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-bold text-primary">{user.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">{user.streak}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-secondary/10 border border-secondary/20 rounded-full px-2.5 py-1">
                <Star className="h-3 w-3 text-secondary" />
                <span className="text-xs font-bold text-secondary">Lv.{user.level}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-foreground">
                <span className="font-medium">{user.username}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={logout}
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-stretch h-16">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
                >
                  {tab.accent ? (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center -mt-5 shadow-lg ${
                      active
                        ? "bg-gradient-to-br from-primary to-purple-600 shadow-primary/40"
                        : "bg-gradient-to-br from-primary/80 to-purple-600/80 shadow-primary/20"
                    }`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <Icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  <span className={`text-[10px] font-medium transition-colors ${
                    tab.accent
                      ? active ? "text-primary" : "text-muted-foreground"
                      : active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
