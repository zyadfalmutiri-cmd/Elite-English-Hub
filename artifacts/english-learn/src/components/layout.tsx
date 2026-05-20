import { Link, useLocation } from "wouter";
import { Trophy, Home, Layers, LogOut, Zap, Flame, Star, MessageCircle, Crown } from "lucide-react";
import logoImg from "/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AdBanner } from "@/components/ad-banner";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/levels", label: "المستويات", icon: Layers },
  { href: "/progress", label: "مسيرتي", icon: Trophy },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-4 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={logoImg} alt="VOT for English" className="h-10 w-auto" />
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            {user?.isSubscribed ? (
              <Link href="/ai-chat">
                <span className={`text-sm font-medium transition-colors flex items-center gap-1 hover:text-primary ${location === "/ai-chat" ? "text-primary" : "text-yellow-400"}`}>
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">الذكاء الاصطناعي</span>
                </span>
              </Link>
            ) : (
              <Link href="/subscription">
                <span className={`text-sm font-medium transition-colors flex items-center gap-1 hover:text-yellow-400 text-muted-foreground`}>
                  <Crown className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">اشترك</span>
                </span>
              </Link>
            )}
          </nav>

          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary english-text">{user.xp} XP</span>
              </div>

              <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-xs font-bold text-orange-400 english-text">{user.streak}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1">
                <Star className="h-3.5 w-3.5 text-secondary" />
                <span className="text-xs font-bold text-secondary english-text">Lv.{user.level}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{user.username}</span>
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive sm:hidden"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>

      {/* Ad banner above footer */}
      <div className="container mx-auto max-w-5xl px-4 pb-4">
        <AdBanner slot="1234567890" format="horizontal" />
      </div>

      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container mx-auto max-w-5xl flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row px-4">
          <p className="text-sm leading-loose text-muted-foreground text-center">
            تعلّم الإنجليزية بثقة وهدوء.
          </p>
        </div>
      </footer>
    </div>
  );
}
