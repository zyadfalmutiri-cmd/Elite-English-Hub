import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Crown, Copy, Check, ArrowRight, Sparkles, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { customFetch } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";

export default function Subscription() {
  const [, navigate] = useLocation();
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"info" | "payment" | "activate">("info");
  const [orderInfo, setOrderInfo] = useState<{ orderId: string; iban: string; accountName: string; instructions: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribeRequest = async () => {
    setLoading(true);
    try {
      const data = await customFetch("/api/subscription/request", { method: "POST" });
      setOrderInfo(data as any);
      setStep("payment");
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ، حاول مرة أخرى", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      toast({ title: "الرمز مطلوب", description: "أدخل رمز التفعيل", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await customFetch("/api/subscription/activate", {
        method: "POST",
        body: JSON.stringify({ code: activationCode }),
      });
      await refreshUser();
      toast({ title: "🎉 تم التفعيل!", description: "مرحباً بك في الاشتراك المميز!" });
      navigate("/ai-chat");
    } catch (e: any) {
      toast({ title: "خطأ", description: e?.data?.error ?? "رمز غير صحيح", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-md">
        {step === "info" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">الاشتراك المميز</h1>
              <p className="text-muted-foreground">احصل على مساعد ذكاء اصطناعي شخصي لتعلم الإنجليزية</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">تحدث مع مساعد ذكاء اصطناعي متخصص في الإنجليزية على مدار الساعة</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-foreground">احصل على تصحيح فوري لأخطائك وشرح مفصّل للقواعد</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <p className="text-sm text-foreground">أسئلة لا محدودة وردود ذكية مخصصة لمستواك</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30 rounded-2xl p-6 text-center">
              <p className="text-muted-foreground mb-1">السعر الشهري</p>
              <p className="text-5xl font-bold text-white mb-1">٢ <span className="text-2xl">ريال</span></p>
              <p className="text-muted-foreground text-sm">سعودي فقط</p>
            </div>

            <Button
              onClick={handleSubscribeRequest}
              disabled={loading}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              {loading ? "جاري الإعداد..." : "اشترك الآن"}
            </Button>

            <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </motion.div>
        )}

        {step === "payment" && orderInfo && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏦</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">تفاصيل التحويل</h1>
              <p className="text-muted-foreground">حوّل المبلغ ثم اضغط "لديّ رمز التفعيل"</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">المبلغ</p>
                <p className="text-2xl font-bold text-green-400">٢ ريال سعودي</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">اسم الحساب</p>
                <p className="font-medium text-white">{orderInfo.accountName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">رقم الآيبان</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white flex-1">{orderInfo.iban}</p>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(orderInfo.iban)}>
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-xs text-yellow-400 font-medium mb-1">⚠️ مهم جداً</p>
                <p className="text-xs text-muted-foreground">اذكر رمز الطلب التالي في ملاحظات التحويل:</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="font-mono text-lg font-bold text-yellow-400 flex-1">{orderInfo.orderId}</p>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(orderInfo.orderId)}>
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep("activate")}
              className="w-full h-12 text-base font-bold"
            >
              لديّ رمز التفعيل
            </Button>
          </motion.div>
        )}

        {step === "activate" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔑</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">أدخل رمز التفعيل</h1>
              <p className="text-muted-foreground">الرمز يُرسل بعد تأكيد التحويل</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">رمز التفعيل</p>
                <Input
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                  placeholder="مثال: A1B2C3D4"
                  className="text-center font-mono text-lg tracking-widest"
                  maxLength={8}
                  dir="ltr"
                />
              </div>
              <Button onClick={handleActivate} disabled={loading} className="w-full h-12 text-base font-bold">
                {loading ? "جاري التفعيل..." : "تفعيل الاشتراك"}
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setStep("payment")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
