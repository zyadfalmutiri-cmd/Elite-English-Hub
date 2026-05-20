import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Users, Mic2, MessageCircle, ClipboardList, BookOpen, ChevronLeft } from "lucide-react";
import logoImg from "/logo.png";

const options = [
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
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <img src={logoImg} alt="VOT" className="h-10 w-auto" />
        <div>
          <h1 className="text-xl font-bold text-white">المزيد</h1>
          <p className="text-sm text-muted-foreground">استكشف كل ميزات التطبيق</p>
        </div>
      </div>

      <div className="grid gap-3">
        {options.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate(opt.href)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${opt.color} border ${opt.border} text-right hover:scale-[1.01] active:scale-[0.99] transition-transform`}
            >
              <div className={`w-12 h-12 rounded-xl bg-background/40 flex items-center justify-center flex-shrink-0 ${opt.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
