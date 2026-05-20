import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, ChevronDown, ChevronUp } from "lucide-react";

const UK_FEATURES = [
  { title: "حرف R الصامت", desc: "في معظم لهجات بريطانية، R لا تُنطق في نهاية الكلمة: car, water, better" },
  { title: "صوت A الطويل", desc: "كلمات مثل dance, castle, path تُنطق بـ 'ah' طويلة: /dɑːns/" },
  { title: "حرف T الواضح", desc: "T تُنطق واضحة وحادة: water, better, butter (مختلفة عن الأمريكية)" },
  { title: "التنغيم", desc: "الإنجليزية البريطانية لها تنغيم أكثر تنوعاً وإيقاعاً موسيقياً" },
];

const UK_PHRASES = [
  { phrase: "Cheers!", meaning: "شكراً / في صحتك" },
  { phrase: "Brilliant!", meaning: "رائع / ممتاز" },
  { phrase: "Fancy a cuppa?", meaning: "هل تريد كوب شاي؟" },
  { phrase: "Quite right.", meaning: "صحيح تماماً" },
  { phrase: "Lovely!", meaning: "جميل / رائع" },
  { phrase: "Mind the gap!", meaning: "انتبه للفجوة (في المترو)" },
  { phrase: "Blimey!", meaning: "يا إلهي! / يا ربي!" },
  { phrase: "I'm knackered.", meaning: "أنا متعب جداً" },
];

const VOCAB_DIFFS = [
  { uk: "lift",          us: "elevator",    ar: "مصعد" },
  { uk: "flat",          us: "apartment",   ar: "شقة" },
  { uk: "lorry",         us: "truck",       ar: "شاحنة" },
  { uk: "petrol",        us: "gas",         ar: "بنزين" },
  { uk: "biscuit",       us: "cookie",      ar: "بسكويت" },
  { uk: "sweets",        us: "candy",       ar: "حلوى" },
  { uk: "rubbish",       us: "garbage",     ar: "قمامة" },
  { uk: "tap",           us: "faucet",      ar: "صنبور" },
  { uk: "underground",   us: "subway",      ar: "مترو" },
  { uk: "nappy",         us: "diaper",      ar: "حفاض" },
  { uk: "pavement",      us: "sidewalk",    ar: "رصيف" },
  { uk: "holiday",       us: "vacation",    ar: "إجازة" },
  { uk: "film",          us: "movie",       ar: "فيلم" },
  { uk: "mobile",        us: "cell phone",  ar: "هاتف محمول" },
  { uk: "rubber",        us: "eraser",      ar: "ممحاة" },
];

function speak(word: string) {
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-GB";
  speechSynthesis.speak(u);
}

export default function EnglishUK() {
  const [open, setOpen] = useState<string | null>("vocab");

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(open === id ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 text-right">
        <h2 className="font-bold text-white">{title}</h2>
        {open === id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open === id && <div className="px-5 pb-5">{children}</div>}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 py-4">
        <div className="text-5xl mb-3">🇬🇧</div>
        <h1 className="text-2xl font-bold text-white">الإنجليزية البريطانية</h1>
        <p className="text-muted-foreground text-sm">تعلّم المفردات والنطق البريطاني</p>
      </motion.div>

      <Section id="vocab" title="مفردات بريطانية vs أمريكية">
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs text-muted-foreground pb-2 border-b border-border">
            <span>🇬🇧 بريطاني</span>
            <span>🇺🇸 أمريكي</span>
            <span>المعنى</span>
          </div>
          {VOCAB_DIFFS.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-3 text-sm py-2 border-b border-border/40 items-center">
              <div className="flex items-center gap-1">
                <span className="text-rose-400 font-medium">{d.uk}</span>
                <button onClick={() => speak(d.uk)} className="text-muted-foreground hover:text-primary">
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <span className="text-muted-foreground text-xs">{d.us}</span>
              <span className="text-muted-foreground">{d.ar}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="pronunciation" title="مميزات النطق البريطاني">
        <div className="space-y-3">
          {UK_FEATURES.map((f, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="phrases" title="عبارات شائعة بريطانية">
        <div className="space-y-3 text-sm">
          {UK_PHRASES.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/40">
              <div className="flex-1">
                <p className="text-rose-400 font-medium">{p.phrase}</p>
                <p className="text-muted-foreground">{p.meaning}</p>
              </div>
              <button onClick={() => speak(p.phrase)} className="text-muted-foreground hover:text-primary">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="accents" title="اللهجات البريطانية الشهيرة">
        <div className="space-y-3 text-sm">
          {[
            { name: "Received Pronunciation (RP)", desc: "اللهجة البريطانية الفصحى — تستخدم في الأخبار والتعليم" },
            { name: "Cockney", desc: "لهجة لندن الشعبية — مشهورة بقلب الكلمات" },
            { name: "Scouse", desc: "لهجة مدينة ليفربول — ميوزيكالية وسريعة" },
            { name: "Yorkshire", desc: "لهجة شمال إنجلترا — أبطأ وأثقل" },
            { name: "Scottish", desc: "الاسكتلندية — R قوية ومميزة جداً" },
          ].map((a, i) => (
            <div key={i} className="py-2 border-b border-border/40">
              <p className="font-semibold text-white">{a.name}</p>
              <p className="text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
