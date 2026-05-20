import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, User, Lock, Sparkles } from "lucide-react";
import logoImg from "/logo.png";

export default function LoginPage() {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center mb-2">
            <img src={logoImg} alt="VOT for English" className="h-24 w-auto" />
          </div>
          <p className="text-muted-foreground">رحلتك نحو الإتقان تبدأ هنا</p>
        </div>

        {/* Card */}
        <Card className="border-border/60 bg-card/80 backdrop-blur shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex rounded-xl border border-border overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => { setMode("login"); setLocalError(null); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setLocalError(null); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                حساب جديد
              </button>
            </div>
            <CardTitle className="text-xl">
              {mode === "login" ? "مرحباً بعودتك" : "انضم إلينا"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "أدخل بياناتك للمتابعة من حيث توقفت"
                : "أنشئ حسابك وابدأ رحلة التعلم"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="اسم المستخدم"
                  className="pr-10 text-right"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="pr-10 text-right"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {(localError || error) && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-2.5 text-center">
                  {localError || error}
                </div>
              )}

              <Button type="submit" className="w-full rounded-xl h-11 text-base" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "login" ? (
                  "دخول"
                ) : (
                  "إنشاء الحساب"
                )}
              </Button>
            </form>

            {mode === "register" && (
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>ستحصل على XP مع كل درس تُكمله وتتتبع إنجازاتك</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
