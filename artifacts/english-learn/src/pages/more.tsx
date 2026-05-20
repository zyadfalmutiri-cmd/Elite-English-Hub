import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Users, Mic2, MessageCircle, ClipboardList, BookOpen, ChevronLeft, Zap, BookMarked, Flag } from "lucide-react";
import logoImg from "/logo.png";

const options = [
  {
    href: "/interactive-quiz",
    icon: Zap,
    label: "التحديات التفاعلية",
    desc: "أسئلة متنوعة — أكمل الجمل، صح وخطأ، واختر الإجابة الصحيحة",
    color: "from-yellow-500/20 to-orange-600/20",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    href: "/pronunciation",
    icon: Mic2,
    label: "تدريبات النطق",
    desc: "درّب نطقك بكلمات عشوائية واحصل على تقييم فوري",
    color: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    href: "/voice-chat",
    icon: MessageCircle,
    label: "الذكاء الاصطناعي الصوتي",
    desc: "تحدث بالميكروفون مع مساعد ذكي يساعدك على تعلم الإنجليزية",
    color: "from-blue-500/20 to-indigo-600/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    href: "/saved-words",
    icon: BookMarked,
    label: "كلماتي المحفوظة",
    desc: "احفظ الكلمات التي تتعلمها وراجعها كبطاقات تعليمية",
    color: "from-teal-500/20 to-cyan-600/20",
    border: "border-teal-500/30",
    iconColor: "text-teal-400",
  },
  {
    href: "/english-us",
    icon: Flag,
    label: "الإنجليزية الأمريكية 🇺🇸",
    desc: "مفردات ونطق وعبارات شائعة في الإنجليزية الأمريكية",
    color: "from-sky-500/20 to-blue-600/20",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
  },
  {
    href: "/english-uk",
    icon: Flag,
    label: "الإنجليزية البريطانية 🇬🇧",
    desc: "مفردات ونطق وعبارات شائعة في الإنجليزية البريطانية",
    color: "from-rose-500/20 to-pink-600/20",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
  {
    href: "/placement-test",
    icon: ClipboardList,
    label: "اختبار تحديد المستوى",
    desc: "اكتشف مستواك في اللغة الإنجليزية من A1 إلى C2",
    color: "from-purple-500/20 to-violet-600/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    href: "/levels",
    icon: BookOpen,
    label: "المستويات والدروس",
    desc: "تصفح جميع المستويات من المبتدئ إلى الإتقان",
    color: "from-orange-500/20 to-amber-600/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    href: "/about",
    icon: Users,
    label: "من نحن",
    desc: "تعرّف على منصة VOT for English وقصتنا",
    color: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
  },
];

export default function More() {
  const [, navigate] = useLocation();

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center gap-3 mb-2">
        <img src={logoImg} alt="VOT" className="h-9 w-auto" />
        <div>
          <h1 className="text-xl font-bold text-white">المزيد</h1>
          <p className="text-xs text-muted-foreground">استكشف كل ميزات التطبيق</p>
        </div>
      </div>

      <div className="grid gap-2.5">
        {options.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(opt.href)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${opt.color} border ${opt.border} text-right hover:scale-[1.01] active:scale-[0.99] transition-transform`}
            >
              <div className={`w-11 h-11 rounded-xl bg-background/40 flex items-center justify-center flex-shrink-0 ${opt.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
