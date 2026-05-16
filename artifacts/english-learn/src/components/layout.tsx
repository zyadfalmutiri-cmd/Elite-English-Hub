import { Link, useLocation } from "wouter";
import { BookOpen, Trophy, Home, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/levels", label: "المستويات", icon: Layers },
  { href: "/progress", label: "مسيرتي", icon: Trophy },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">تعلّم الإنجليزية</span>
          </Link>
          <nav className="flex items-center gap-6">
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
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
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
