import { motion } from "framer-motion";
import { BookOpen, Target, Heart, Award } from "lucide-react";
import logoImg from "/logo.png";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <img src={logoImg} alt="VOT for English" className="h-24 w-auto mx-auto" />
        <p className="text-muted-foreground text-lg">منصة تعليمية متكاملة للناطقين بالعربية</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold text-white">رسالتنا</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          نسعى في منصة VOT for English إلى جعل تعلم اللغة الإنجليزية تجربة ممتعة وفعّالة لكل ناطق بالعربية.
          نؤمن بأن كل شخص يستطيع إتقان الإنجليزية بالطريقة الصحيحة والدعم المناسب.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3">
        {[
          { icon: BookOpen, label: "٧٢ درساً", desc: "من A1 إلى C2", color: "text-blue-400" },
          { icon: Award, label: "٦ مستويات", desc: "متدرجة باحترافية", color: "text-yellow-400" },
          { icon: Heart, label: "بالعربية", desc: "شرح واضح ومبسط", color: "text-pink-400" },
          { icon: Target, label: "ذكاء اصطناعي", desc: "مساعد شخصي ذكي", color: "text-green-400" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className={`w-7 h-7 ${item.color} mx-auto mb-2`} />
              <p className="font-bold text-white">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">ما يميّزنا</h2>
        <ul className="space-y-3">
          {[
            "منهج متكامل من الصفر حتى الإتقان (A1 → C2)",
            "شرح بالعربية مع أمثلة إنجليزية واضحة",
            "مساعد ذكاء اصطناعي صوتي للتحدث والتدريب",
            "تدريبات النطق بتقييم فوري",
            "نظام نقاط وإنجازات يحفّزك على الاستمرار",
            "اختبار تحديد المستوى لبداية صحيحة",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
              <span className="text-primary mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="text-center py-4 border-t border-border">
        <p className="text-muted-foreground text-sm">VOT for English © {new Date().getFullYear()}</p>
        <p className="text-xs text-muted-foreground mt-1">تعلّم بثقة، تحدث بفخر</p>
      </motion.div>
    </div>
  );
}
